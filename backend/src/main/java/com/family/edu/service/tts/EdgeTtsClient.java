package com.family.edu.service.tts;

import com.family.edu.config.AppProperties;
import com.family.edu.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 基于微软 Edge 在线朗读（Read Aloud）接口，免费支持中文。
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EdgeTtsClient {

    private static final String TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
    private static final String OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";

    private final AppProperties appProperties;
    private final OkHttpClient okHttpClient = new OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(0, TimeUnit.SECONDS)
            .build();

    public byte[] synthesize(String text, String voice, String rate) {
        if (StringUtils.isBlank(text)) {
            throw new BusinessException("合成文本不能为空");
        }
        String resolvedVoice = StringUtils.defaultIfBlank(voice, appProperties.getTts().getVoice());
        String resolvedRate = StringUtils.defaultIfBlank(rate, appProperties.getTts().getRate());
        int timeoutSec = appProperties.getTts().getTimeoutSec();

        CountDownLatch latch = new CountDownLatch(1);
        ByteArrayOutputStream audioBuffer = new ByteArrayOutputStream();
        AtomicReference<Throwable> errorRef = new AtomicReference<Throwable>();

        String connectionId = UUID.randomUUID().toString().replace("-", "");
        String url = "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1"
                + "?TrustedClientToken=" + TRUSTED_CLIENT_TOKEN
                + "&ConnectionId=" + connectionId;

        Request request = new Request.Builder()
                .url(url)
                .header("Origin", "chrome-extension://jdiccldimpdaikemeemdpgllmebfbjeg")
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .build();

        WebSocket webSocket = okHttpClient.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                sendConfig(webSocket);
                sendSsml(webSocket, text, resolvedVoice, resolvedRate);
                sendTurnEnd(webSocket);
            }

            @Override
            public void onMessage(WebSocket webSocket, String textMessage) {
                if (textMessage.contains("Path:turn.end")) {
                    webSocket.close(1000, "done");
                }
            }

            @Override
            public void onMessage(WebSocket webSocket, ByteString bytes) {
                appendAudioChunk(audioBuffer, bytes.toByteArray());
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                errorRef.set(t);
                latch.countDown();
            }

            @Override
            public void onClosed(WebSocket webSocket, int code, String reason) {
                latch.countDown();
            }
        });

        try {
            boolean finished = latch.await(timeoutSec, TimeUnit.SECONDS);
            if (!finished) {
                webSocket.cancel();
                throw new BusinessException("语音合成超时");
            }
            if (errorRef.get() != null) {
                log.error("edge tts failed", errorRef.get());
                throw new BusinessException("语音合成失败，请检查网络连接");
            }
            if (audioBuffer.size() == 0) {
                throw new BusinessException("语音合成未返回音频数据");
            }
            return audioBuffer.toByteArray();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            webSocket.cancel();
            throw new BusinessException("语音合成被中断");
        }
    }

    private void sendConfig(WebSocket webSocket) {
        String message = "Path: speech.config\r\n"
                + "X-Timestamp: " + utcTimestamp() + "\r\n"
                + "Content-Type: application/json\r\n\r\n"
                + "{\"context\":{\"synthesis\":{\"audio\":{\"metadataoptions\":{"
                + "\"sentenceBoundaryEnabled\":\"false\",\"wordBoundaryEnabled\":\"false\"},"
                + "\"outputFormat\":\"" + OUTPUT_FORMAT + "\"}}}}";
        webSocket.send(message);
    }

    private void sendSsml(WebSocket webSocket, String text, String voice, String rate) {
        String ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'>"
                + "<voice name='" + escapeXml(voice) + "'>"
                + "<prosody rate='" + escapeXml(rate) + "' pitch='+0%'>"
                + escapeXml(text)
                + "</prosody></voice></speak>";
        String message = "Path: ssml\r\n"
                + "X-Timestamp: " + utcTimestamp() + "\r\n"
                + "Content-Type: application/ssml+xml\r\n\r\n"
                + ssml;
        webSocket.send(message);
    }

    private void sendTurnEnd(WebSocket webSocket) {
        String message = "Path: turn.end\r\n"
                + "X-Timestamp: " + utcTimestamp() + "\r\n"
                + "Content-Type: application/json\r\n\r\n"
                + "{}";
        webSocket.send(message);
    }

    private void appendAudioChunk(ByteArrayOutputStream buffer, byte[] payload) {
        String header = new String(payload, 0, Math.min(payload.length, 128), StandardCharsets.UTF_8);
        int index = header.indexOf("\r\n\r\n");
        if (index < 0) {
            return;
        }
        if (!header.startsWith("Path:audio")) {
            return;
        }
        int audioStart = index + 4;
        if (audioStart < payload.length) {
            buffer.write(payload, audioStart, payload.length - audioStart);
        }
    }

    private String utcTimestamp() {
        SimpleDateFormat format = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss 'GMT+0000 (Coordinated Universal Time)'", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("UTC"));
        return format.format(new Date());
    }

    private String escapeXml(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
