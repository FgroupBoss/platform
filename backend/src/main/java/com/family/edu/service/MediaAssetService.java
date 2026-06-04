package com.family.edu.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.family.edu.entity.MediaAsset;
import com.family.edu.enums.MediaType;
import com.family.edu.exception.BusinessException;
import com.family.edu.mapper.MediaAssetMapper;
import com.family.edu.mapper.PoemMapper;
import com.family.edu.mapper.StoryMapper;
import com.family.edu.model.vo.MediaAssetVO;
import com.family.edu.util.MediaUrlHelper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaAssetService {

    private final MediaAssetMapper mediaAssetMapper;
    private final PoemMapper poemMapper;
    private final StoryMapper storyMapper;
    private final MediaStorageService mediaStorageService;

    @Transactional(rollbackFor = Exception.class)
    public MediaAssetVO upload(MultipartFile file) {
        MediaStorageService.StoredFile storedFile = mediaStorageService.store(file);
        MediaAsset asset = new MediaAsset();
        asset.setFileName(storedFile.getOriginalName());
        asset.setFilePath(storedFile.getStoredPath());
        asset.setMediaType(storedFile.getMediaType());
        asset.setMimeType(storedFile.getMimeType());
        asset.setFileSize(storedFile.getFileSize());
        asset.setCreatedAt(LocalDateTime.now());
        mediaAssetMapper.insert(asset);
        return toVO(asset, false);
    }

    public Page<MediaAssetVO> pageList(int page, int size, MediaType mediaType) {
        LambdaQueryWrapper<MediaAsset> wrapper = new LambdaQueryWrapper<MediaAsset>()
                .orderByDesc(MediaAsset::getCreatedAt);
        if (mediaType != null) {
            wrapper.eq(MediaAsset::getMediaType, mediaType);
        }
        Page<MediaAsset> result = mediaAssetMapper.selectPage(new Page<MediaAsset>(page, size), wrapper);
        Page<MediaAssetVO> voPage = new Page<MediaAssetVO>(result.getCurrent(), result.getSize(), result.getTotal());
        List<MediaAssetVO> records = result.getRecords().stream()
                .map(item -> toVO(item, true))
                .collect(Collectors.toList());
        voPage.setRecords(records);
        return voPage;
    }

    public MediaAssetVO getById(Long id) {
        MediaAsset asset = requireAsset(id);
        return toVO(asset, true);
    }

    public MediaAsset requireAsset(Long id) {
        MediaAsset asset = mediaAssetMapper.selectById(id);
        if (asset == null) {
            throw new BusinessException(404, "媒体资源不存在");
        }
        return asset;
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        MediaAsset asset = requireAsset(id);
        int refCount = poemMapper.countByMediaId(id) + storyMapper.countByMediaId(id);
        if (refCount > 0) {
            throw new BusinessException("该文件已被内容引用，无法删除");
        }
        mediaStorageService.delete(asset.getFilePath());
        mediaAssetMapper.deleteById(id);
    }

    /**
     * 无引用时删除媒体（用于 TTS 重新生成后清理旧音频）。
     */
    public void deleteIfUnreferenced(Long mediaId) {
        if (mediaId == null) {
            return;
        }
        int refCount = poemMapper.countByMediaId(mediaId) + storyMapper.countByMediaId(mediaId);
        if (refCount > 0) {
            return;
        }
        try {
            delete(mediaId);
        } catch (BusinessException ex) {
            // 已被引用或不存在时忽略
        }
    }

    public int countReference(Long mediaId) {
        return poemMapper.countByMediaId(mediaId) + storyMapper.countByMediaId(mediaId);
    }

    public void validateMediaIds(Long coverId, Long audioId, Long videoId) {
        validateMediaId(coverId, MediaType.IMAGE);
        validateMediaId(audioId, MediaType.AUDIO);
        validateMediaId(videoId, MediaType.VIDEO);
    }

    private void validateMediaId(Long mediaId, MediaType expectedType) {
        if (mediaId == null) {
            return;
        }
        MediaAsset asset = requireAsset(mediaId);
        if (asset.getMediaType() != expectedType) {
            throw new BusinessException("媒体类型不匹配: " + mediaId);
        }
    }

    private MediaAssetVO toVO(MediaAsset asset, boolean withRefCount) {
        MediaAssetVO.MediaAssetVOBuilder builder = MediaAssetVO.builder()
                .id(String.valueOf(asset.getId()))
                .fileName(asset.getFileName())
                .mediaType(asset.getMediaType())
                .mimeType(asset.getMimeType())
                .fileSize(asset.getFileSize())
                .durationSec(asset.getDurationSec())
                .url(MediaUrlHelper.streamUrl(asset.getId()));
        if (withRefCount) {
            builder.referenceCount(countReference(asset.getId()));
        }
        return builder.build();
    }
}
