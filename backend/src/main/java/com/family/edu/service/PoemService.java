package com.family.edu.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.family.edu.entity.Poem;
import com.family.edu.enums.ContentStatus;
import com.family.edu.exception.BusinessException;
import com.family.edu.mapper.PoemMapper;
import com.family.edu.model.dto.PoemSaveDTO;
import com.family.edu.model.dto.TtsGenerateDTO;
import com.family.edu.model.vo.PoemVO;
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
public class PoemService {

    private final PoemMapper poemMapper;
    private final MediaAssetService mediaAssetService;
    private final TextToSpeechService textToSpeechService;

    public List<PoemVO> listPublished(String dynasty, String difficulty) {
        LambdaQueryWrapper<Poem> wrapper = buildPublicQuery(dynasty, difficulty);
        return poemMapper.selectList(wrapper).stream().map(this::toVO).collect(Collectors.toList());
    }

    public Page<PoemVO> pageAdmin(int page, int size, String dynasty, String status) {
        LambdaQueryWrapper<Poem> wrapper = new LambdaQueryWrapper<Poem>()
                .orderByAsc(Poem::getSortOrder)
                .orderByDesc(Poem::getId);
        if (StringUtils.isNotBlank(dynasty)) {
            wrapper.eq(Poem::getDynasty, dynasty);
        }
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(Poem::getStatus, parseStatus(status));
        }
        Page<Poem> result = poemMapper.selectPage(new Page<Poem>(page, size), wrapper);
        Page<PoemVO> voPage = new Page<PoemVO>(result.getCurrent(), result.getSize(), result.getTotal());
        voPage.setRecords(result.getRecords().stream().map(this::toVO).collect(Collectors.toList()));
        return voPage;
    }

    public PoemVO getPublishedDetail(Long id) {
        Poem poem = requirePoem(id);
        if (poem.getStatus() != ContentStatus.published) {
            throw new BusinessException(404, "诗词不存在或未发布");
        }
        return toVO(poem);
    }

    public PoemVO getAdminDetail(Long id) {
        return toVO(requirePoem(id));
    }

    @Transactional(rollbackFor = Exception.class)
    public PoemVO create(PoemSaveDTO dto) {
        mediaAssetService.validateMediaIds(dto.getCoverId(), dto.getAudioId(), dto.getVideoId());
        Poem poem = fromDTO(new Poem(), dto);
        poem.setCreatedAt(LocalDateTime.now());
        poem.setUpdatedAt(LocalDateTime.now());
        poemMapper.insert(poem);
        return toVO(poem);
    }

    @Transactional(rollbackFor = Exception.class)
    public PoemVO update(Long id, PoemSaveDTO dto) {
        Poem poem = requirePoem(id);
        mediaAssetService.validateMediaIds(dto.getCoverId(), dto.getAudioId(), dto.getVideoId());
        fromDTO(poem, dto);
        poem.setUpdatedAt(LocalDateTime.now());
        poemMapper.updateById(poem);
        return toVO(poem);
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        requirePoem(id);
        poemMapper.deleteById(id);
    }

    @Transactional(rollbackFor = Exception.class)
    public PoemVO updateStatus(Long id, String status) {
        Poem poem = requirePoem(id);
        poem.setStatus(parseStatus(status));
        poem.setUpdatedAt(LocalDateTime.now());
        poemMapper.updateById(poem);
        return toVO(poem);
    }

    @Transactional(rollbackFor = Exception.class)
    public PoemVO generateAudio(Long id, TtsGenerateDTO dto) {
        Poem poem = requirePoem(id);
        if (poem.getLines() == null || poem.getLines().isEmpty()) {
            throw new BusinessException("诗词正文为空，无法生成音频");
        }
        String speechText = buildSpeechText(poem);
        String fileName = poem.getTitle() + "-朗读.mp3";
        String voice = dto == null ? null : dto.getVoice();
        String rate = dto == null ? null : dto.getRate();

        com.family.edu.model.vo.MediaAssetVO asset = textToSpeechService.synthesizeAndSave(
                speechText, fileName, voice, rate);
        Long newAudioId = Long.valueOf(asset.getId());
        Long oldAudioId = poem.getAudioId();
        poem.setAudioId(newAudioId);
        poem.setUpdatedAt(LocalDateTime.now());
        poemMapper.updateById(poem);
        mediaAssetService.deleteIfUnreferenced(oldAudioId);
        return toVO(poem);
    }

    @Transactional(rollbackFor = Exception.class)
    public PoemVO bindAudio(Long id, MultipartFile file) {
        Poem poem = requirePoem(id);
        com.family.edu.model.vo.MediaAssetVO asset = mediaAssetService.upload(file);
        Long newAudioId = Long.valueOf(asset.getId());
        Long oldAudioId = poem.getAudioId();
        poem.setAudioId(newAudioId);
        poem.setUpdatedAt(LocalDateTime.now());
        poemMapper.updateById(poem);
        mediaAssetService.deleteIfUnreferenced(oldAudioId);
        return toVO(poem);
    }

    private String buildSpeechText(Poem poem) {
        StringBuilder builder = new StringBuilder();
        builder.append(poem.getTitle());
        if (StringUtils.isNotBlank(poem.getAuthor())) {
            builder.append("，").append(poem.getAuthor());
        }
        builder.append("。");
        for (String line : poem.getLines()) {
            if (StringUtils.isNotBlank(line)) {
                builder.append(line).append("。");
            }
        }
        return builder.toString();
    }

    public Poem requirePoem(Long id) {
        Poem poem = poemMapper.selectById(id);
        if (poem == null) {
            throw new BusinessException(404, "诗词不存在");
        }
        return poem;
    }

    public PoemVO toVO(Poem poem) {
        return PoemVO.builder()
                .id(String.valueOf(poem.getId()))
                .title(poem.getTitle())
                .author(poem.getAuthor())
                .dynasty(poem.getDynasty())
                .lines(poem.getLines())
                .pinyin(poem.getPinyin())
                .translation(poem.getTranslation())
                .difficulty(poem.getDifficulty())
                .tags(poem.getTags())
                .coverUrl(MediaUrlHelper.streamUrl(poem.getCoverId()))
                .audioUrl(MediaUrlHelper.streamUrl(poem.getAudioId()))
                .videoUrl(MediaUrlHelper.streamUrl(poem.getVideoId()))
                .coverId(MediaUrlHelper.mediaIdString(poem.getCoverId()))
                .audioId(MediaUrlHelper.mediaIdString(poem.getAudioId()))
                .videoId(MediaUrlHelper.mediaIdString(poem.getVideoId()))
                .status(poem.getStatus() == null ? null : poem.getStatus().name())
                .sortOrder(poem.getSortOrder())
                .build();
    }

    private LambdaQueryWrapper<Poem> buildPublicQuery(String dynasty, String difficulty) {
        LambdaQueryWrapper<Poem> wrapper = new LambdaQueryWrapper<Poem>()
                .eq(Poem::getStatus, ContentStatus.published)
                .orderByAsc(Poem::getSortOrder)
                .orderByAsc(Poem::getId);
        if (StringUtils.isNotBlank(dynasty)) {
            wrapper.eq(Poem::getDynasty, dynasty);
        }
        if (StringUtils.isNotBlank(difficulty)) {
            wrapper.eq(Poem::getDifficulty, difficulty);
        }
        return wrapper;
    }

    private Poem fromDTO(Poem poem, PoemSaveDTO dto) {
        poem.setTitle(dto.getTitle());
        poem.setAuthor(dto.getAuthor());
        poem.setDynasty(dto.getDynasty());
        poem.setLines(dto.getLines());
        poem.setPinyin(dto.getPinyin());
        poem.setTranslation(dto.getTranslation());
        poem.setDifficulty(StringUtils.defaultIfBlank(dto.getDifficulty(), "easy"));
        poem.setTags(dto.getTags());
        poem.setCoverId(dto.getCoverId());
        poem.setAudioId(dto.getAudioId());
        poem.setVideoId(dto.getVideoId());
        poem.setStatus(parseStatus(StringUtils.defaultIfBlank(dto.getStatus(), ContentStatus.draft.name())));
        poem.setSortOrder(dto.getSortOrder() == null ? 0 : dto.getSortOrder());
        return poem;
    }

    private ContentStatus parseStatus(String status) {
        try {
            return ContentStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new BusinessException("无效的状态: " + status);
        }
    }
}
