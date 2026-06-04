package com.family.edu.controller;

import com.family.edu.entity.MediaAsset;
import com.family.edu.exception.BusinessException;
import com.family.edu.service.MediaAssetService;
import com.family.edu.service.MediaStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaStreamController {

    private final MediaAssetService mediaAssetService;
    private final MediaStorageService mediaStorageService;

    @GetMapping("/stream/{id}")
    public ResponseEntity<Resource> stream(@PathVariable Long id) {
        MediaAsset asset = mediaAssetService.requireAsset(id);
        Resource resource = mediaStorageService.loadAsResource(asset.getFilePath());
        MediaType mediaType = resolveMediaType(asset.getMimeType());
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + asset.getFileName() + "\"")
                .body(resource);
    }

    private MediaType resolveMediaType(String mimeType) {
        try {
            return MediaType.parseMediaType(mimeType);
        } catch (Exception e) {
            throw new BusinessException("无法识别的媒体类型");
        }
    }
}
