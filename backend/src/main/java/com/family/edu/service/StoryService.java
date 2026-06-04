package com.family.edu.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.family.edu.entity.Story;
import com.family.edu.enums.ContentStatus;
import com.family.edu.exception.BusinessException;
import com.family.edu.mapper.StoryMapper;
import com.family.edu.model.dto.StorySaveDTO;
import com.family.edu.model.dto.TtsGenerateDTO;
import com.family.edu.model.vo.StoryVO;
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
public class StoryService {

    private final StoryMapper storyMapper;
    private final MediaAssetService mediaAssetService;
    private final TextToSpeechService textToSpeechService;

    public List<StoryVO> listPublished(String storyType) {
        LambdaQueryWrapper<Story> wrapper = buildPublicQuery(storyType);
        return storyMapper.selectList(wrapper).stream().map(this::toVO).collect(Collectors.toList());
    }

    public Page<StoryVO> pageAdmin(int page, int size, String storyType, String status) {
        LambdaQueryWrapper<Story> wrapper = new LambdaQueryWrapper<Story>()
                .orderByAsc(Story::getSortOrder)
                .orderByDesc(Story::getId);
        if (StringUtils.isNotBlank(storyType)) {
            wrapper.eq(Story::getStoryType, storyType);
        }
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(Story::getStatus, parseStatus(status));
        }
        Page<Story> result = storyMapper.selectPage(new Page<Story>(page, size), wrapper);
        Page<StoryVO> voPage = new Page<StoryVO>(result.getCurrent(), result.getSize(), result.getTotal());
        voPage.setRecords(result.getRecords().stream().map(this::toVO).collect(Collectors.toList()));
        return voPage;
    }

    public StoryVO getPublishedDetail(Long id) {
        Story story = requireStory(id);
        if (story.getStatus() != ContentStatus.published) {
            throw new BusinessException(404, "故事不存在或未发布");
        }
        return toVO(story);
    }

    public StoryVO getAdminDetail(Long id) {
        return toVO(requireStory(id));
    }

    @Transactional(rollbackFor = Exception.class)
    public StoryVO create(StorySaveDTO dto) {
        mediaAssetService.validateMediaIds(dto.getCoverId(), dto.getAudioId(), dto.getVideoId());
        Story story = fromDTO(new Story(), dto);
        story.setCreatedAt(LocalDateTime.now());
        story.setUpdatedAt(LocalDateTime.now());
        storyMapper.insert(story);
        return toVO(story);
    }

    @Transactional(rollbackFor = Exception.class)
    public StoryVO update(Long id, StorySaveDTO dto) {
        Story story = requireStory(id);
        mediaAssetService.validateMediaIds(dto.getCoverId(), dto.getAudioId(), dto.getVideoId());
        fromDTO(story, dto);
        story.setUpdatedAt(LocalDateTime.now());
        storyMapper.updateById(story);
        return toVO(story);
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        requireStory(id);
        storyMapper.deleteById(id);
    }

    @Transactional(rollbackFor = Exception.class)
    public StoryVO updateStatus(Long id, String status) {
        Story story = requireStory(id);
        story.setStatus(parseStatus(status));
        story.setUpdatedAt(LocalDateTime.now());
        storyMapper.updateById(story);
        return toVO(story);
    }

    @Transactional(rollbackFor = Exception.class)
    public StoryVO generateAudio(Long id, TtsGenerateDTO dto) {
        Story story = requireStory(id);
        if (story.getParagraphs() == null || story.getParagraphs().isEmpty()) {
            throw new BusinessException("故事正文为空，无法生成音频");
        }
        String speechText = buildSpeechText(story);
        String fileName = story.getTitle() + "-朗读.mp3";
        String voice = dto == null ? null : dto.getVoice();
        String rate = dto == null ? null : dto.getRate();

        com.family.edu.model.vo.MediaAssetVO asset = textToSpeechService.synthesizeAndSave(
                speechText, fileName, voice, rate);
        Long newAudioId = Long.valueOf(asset.getId());
        Long oldAudioId = story.getAudioId();
        story.setAudioId(newAudioId);
        story.setUpdatedAt(LocalDateTime.now());
        storyMapper.updateById(story);
        mediaAssetService.deleteIfUnreferenced(oldAudioId);
        return toVO(story);
    }

    @Transactional(rollbackFor = Exception.class)
    public StoryVO bindAudio(Long id, MultipartFile file) {
        Story story = requireStory(id);
        com.family.edu.model.vo.MediaAssetVO asset = mediaAssetService.upload(file);
        Long newAudioId = Long.valueOf(asset.getId());
        Long oldAudioId = story.getAudioId();
        story.setAudioId(newAudioId);
        story.setUpdatedAt(LocalDateTime.now());
        storyMapper.updateById(story);
        mediaAssetService.deleteIfUnreferenced(oldAudioId);
        return toVO(story);
    }

    private String buildSpeechText(Story story) {
        StringBuilder builder = new StringBuilder();
        builder.append(story.getTitle()).append("。");
        for (String paragraph : story.getParagraphs()) {
            if (StringUtils.isNotBlank(paragraph)) {
                builder.append(paragraph);
            }
        }
        return builder.toString();
    }

    public Story requireStory(Long id) {
        Story story = storyMapper.selectById(id);
        if (story == null) {
            throw new BusinessException(404, "故事不存在");
        }
        return story;
    }

    public StoryVO toVO(Story story) {
        return StoryVO.builder()
                .id(String.valueOf(story.getId()))
                .title(story.getTitle())
                .storyType(story.getStoryType())
                .paragraphs(story.getParagraphs())
                .ageMin(story.getAgeMin())
                .coverUrl(MediaUrlHelper.streamUrl(story.getCoverId()))
                .audioUrl(MediaUrlHelper.streamUrl(story.getAudioId()))
                .videoUrl(MediaUrlHelper.streamUrl(story.getVideoId()))
                .coverId(MediaUrlHelper.mediaIdString(story.getCoverId()))
                .audioId(MediaUrlHelper.mediaIdString(story.getAudioId()))
                .videoId(MediaUrlHelper.mediaIdString(story.getVideoId()))
                .status(story.getStatus() == null ? null : story.getStatus().name())
                .sortOrder(story.getSortOrder())
                .build();
    }

    private LambdaQueryWrapper<Story> buildPublicQuery(String storyType) {
        LambdaQueryWrapper<Story> wrapper = new LambdaQueryWrapper<Story>()
                .eq(Story::getStatus, ContentStatus.published)
                .orderByAsc(Story::getSortOrder)
                .orderByAsc(Story::getId);
        if (StringUtils.isNotBlank(storyType)) {
            wrapper.eq(Story::getStoryType, storyType);
        }
        return wrapper;
    }

    private Story fromDTO(Story story, StorySaveDTO dto) {
        story.setTitle(dto.getTitle());
        story.setStoryType(dto.getStoryType());
        story.setParagraphs(dto.getParagraphs());
        story.setAgeMin(dto.getAgeMin() == null ? 3 : dto.getAgeMin());
        story.setCoverId(dto.getCoverId());
        story.setAudioId(dto.getAudioId());
        story.setVideoId(dto.getVideoId());
        story.setStatus(parseStatus(StringUtils.defaultIfBlank(dto.getStatus(), ContentStatus.draft.name())));
        story.setSortOrder(dto.getSortOrder() == null ? 0 : dto.getSortOrder());
        return story;
    }

    private ContentStatus parseStatus(String status) {
        try {
            return ContentStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new BusinessException("无效的状态: " + status);
        }
    }
}
