package com.family.edu.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Storage storage = new Storage();
    private Upload upload = new Upload();
    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Admin admin = new Admin();
    private Tts tts = new Tts();

    @Data
    public static class Storage {
        private String localPath = "./uploads";
    }

    @Data
    public static class Upload {
        private long maxAudioSize = 20971520L;
        private long maxVideoSize = 209715200L;
        private long maxImageSize = 5242880L;
    }

    @Data
    public static class Jwt {
        private String secret;
        private int expireHours = 24;
    }

    @Data
    public static class Cors {
        private String allowedOrigins = "http://localhost:5173";
    }

    @Data
    public static class Admin {
        private String defaultUsername = "admin";
        private String defaultPassword = "admin123";
    }

    @Data
    public static class Tts {
        /** 是否启用文字转音频 */
        private boolean enabled = true;
        /** 提供方：edge（微软 Edge 在线 TTS，免费） */
        private String provider = "edge";
        /** 中文女声，适合朗读；可选 zh-CN-YunxiNeural（男声） */
        private String voice = "zh-CN-XiaoxiaoNeural";
        /** 语速，如 +0%、-10%、+10% */
        private String rate = "+0%";
        /** 合成超时（秒） */
        private int timeoutSec = 60;
    }
}
