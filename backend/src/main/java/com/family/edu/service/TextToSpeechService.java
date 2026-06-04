package com.family.edu.service;

import com.family.edu.config.AppProperties;
import com.family.edu.entity.MediaAsset;
import com.family.edu.enums.MediaType;
import com.family.edu.exception.BusinessException;
import com.family.edu.mapper.MediaAssetMapper;
import com.family.edu.model.vo.MediaAssetVO;
import com.family.edu.service.tts.EdgeTtsClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class TextToSpeechService {

    private final AppProperties appProperties;
    private final EdgeTtsClient edgeTtsClient;
    private final MediaStorageService mediaStorageService;
    private final MediaAssetMapper mediaAssetMapper;

    @Transactional(rollbackFor = Exception.class)
    public MediaAssetVO synthesizeAndSave(String text, String fileName, String voice, String rate) {
        if (!appProperties.getTts().isEnabled()) {
            throw new BusinessException("文字转音频功能未启用");
        }
        String safeName = StringUtils.defaultIfBlank(fileName, "tts-" + System.currentTimeMillis() + ".mp3");
        if (!safeName.toLowerCase().endsWith(".mp3")) {
            safeName = safeName + ".mp3";
        }

        log.info("tts synthesize start fileName={} textLength={}", safeName, text.length());
        byte[] audioBytes = edgeTtsClient.synthesize(text, voice, rate);
        MediaStorageService.StoredFile storedFile = mediaStorageService.storeBytes(
                safeName, audioBytes, "audio/mpeg", MediaType.AUDIO);

        MediaAsset asset = new MediaAsset();
        asset.setFileName(storedFile.getOriginalName());
        asset.setFilePath(storedFile.getStoredPath());
        asset.setMediaType(MediaType.AUDIO);
        asset.setMimeType(storedFile.getMimeType());
        asset.setFileSize(storedFile.getFileSize());
        asset.setCreatedAt(LocalDateTime.now());
        mediaAssetMapper.insert(asset);

        log.info("tts synthesize done mediaId={} fileSize={}", asset.getId(), asset.getFileSize());
        return MediaAssetVO.builder()
                .id(String.valueOf(asset.getId()))
                .fileName(asset.getFileName())
                .mediaType(asset.getMediaType())
                .mimeType(asset.getMimeType())
                .fileSize(asset.getFileSize())
                .url(com.family.edu.util.MediaUrlHelper.streamUrl(asset.getId()))
                .build();
    }
}
