package com.family.edu.service;

import com.family.edu.config.AppProperties;
import com.family.edu.enums.MediaType;
import com.family.edu.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaStorageService {

    private static final Set<String> AUDIO_EXT = new HashSet<String>(Arrays.asList("mp3", "m4a", "wav"));
    private static final Set<String> VIDEO_EXT = new HashSet<String>(Arrays.asList("mp4", "webm"));
    private static final Set<String> IMAGE_EXT = new HashSet<String>(Arrays.asList("jpg", "jpeg", "png", "webp"));

    private final AppProperties appProperties;

    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("上传文件不能为空");
        }
        String originalName = StringUtils.defaultIfBlank(file.getOriginalFilename(), "file");
        String extension = extractExtension(originalName);
        MediaType mediaType = resolveMediaType(extension);
        validateSize(mediaType, file.getSize());

        String storedName = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        Path root = resolveRootPath();
        Path target = root.resolve(storedName);
        try {
            Files.createDirectories(root);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("store file failed fileName={}", originalName, e);
            throw new BusinessException("文件保存失败");
        }
        return new StoredFile(originalName, storedName, mediaType,
                StringUtils.defaultIfBlank(file.getContentType(), "application/octet-stream"), file.getSize());
    }

    /**
     * 保存 TTS 等程序生成的二进制文件。
     */
    public StoredFile storeBytes(String originalName, byte[] content, String mimeType, MediaType mediaType) {
        if (content == null || content.length == 0) {
            throw new BusinessException("文件内容不能为空");
        }
        validateSize(mediaType, content.length);
        String extension = resolveExtension(mediaType);
        String storedName = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        Path root = resolveRootPath();
        Path target = root.resolve(storedName);
        try {
            Files.createDirectories(root);
            Files.write(target, content);
        } catch (IOException e) {
            log.error("store bytes failed fileName={}", originalName, e);
            throw new BusinessException("文件保存失败");
        }
        return new StoredFile(originalName, storedName, mediaType,
                StringUtils.defaultIfBlank(mimeType, "application/octet-stream"), content.length);
    }

    private String resolveExtension(MediaType mediaType) {
        if (mediaType == MediaType.AUDIO) {
            return "mp3";
        }
        if (mediaType == MediaType.VIDEO) {
            return "mp4";
        }
        return "bin";
    }

    public Resource loadAsResource(String filePath) {
        try {
            Path file = resolveRootPath().resolve(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new BusinessException(404, "文件不存在");
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new BusinessException(404, "文件不存在");
        }
    }

    public void delete(String filePath) {
        try {
            Files.deleteIfExists(resolveRootPath().resolve(filePath));
        } catch (IOException e) {
            log.error("delete file failed filePath={}", filePath, e);
            throw new BusinessException("文件删除失败");
        }
    }

    private Path resolveRootPath() {
        return Paths.get(appProperties.getStorage().getLocalPath()).toAbsolutePath().normalize();
    }

    private String extractExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        if (index < 0 || index == fileName.length() - 1) {
            throw new BusinessException("不支持的文件格式");
        }
        return fileName.substring(index + 1).toLowerCase(Locale.ROOT);
    }

    private MediaType resolveMediaType(String extension) {
        if (AUDIO_EXT.contains(extension)) {
            return MediaType.AUDIO;
        }
        if (VIDEO_EXT.contains(extension)) {
            return MediaType.VIDEO;
        }
        if (IMAGE_EXT.contains(extension)) {
            return MediaType.IMAGE;
        }
        throw new BusinessException("不支持的文件格式: " + extension);
    }

    private void validateSize(MediaType mediaType, long size) {
        long maxSize;
        if (mediaType == MediaType.AUDIO) {
            maxSize = appProperties.getUpload().getMaxAudioSize();
        } else if (mediaType == MediaType.VIDEO) {
            maxSize = appProperties.getUpload().getMaxVideoSize();
        } else {
            maxSize = appProperties.getUpload().getMaxImageSize();
        }
        if (size > maxSize) {
            throw new BusinessException("文件大小超出限制");
        }
    }

    public static class StoredFile {
        private final String originalName;
        private final String storedPath;
        private final MediaType mediaType;
        private final String mimeType;
        private final long fileSize;

        public StoredFile(String originalName, String storedPath, MediaType mediaType, String mimeType, long fileSize) {
            this.originalName = originalName;
            this.storedPath = storedPath;
            this.mediaType = mediaType;
            this.mimeType = mimeType;
            this.fileSize = fileSize;
        }

        public String getOriginalName() {
            return originalName;
        }

        public String getStoredPath() {
            return storedPath;
        }

        public MediaType getMediaType() {
            return mediaType;
        }

        public String getMimeType() {
            return mimeType;
        }

        public long getFileSize() {
            return fileSize;
        }
    }
}
