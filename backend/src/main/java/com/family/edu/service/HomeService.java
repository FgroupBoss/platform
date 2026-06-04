package com.family.edu.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.family.edu.entity.Poem;
import com.family.edu.entity.Story;
import com.family.edu.enums.ContentStatus;
import com.family.edu.exception.BusinessException;
import com.family.edu.mapper.PoemMapper;
import com.family.edu.mapper.StoryMapper;
import com.family.edu.model.vo.HomeRecommendVO;
import com.family.edu.model.vo.PoemVO;
import com.family.edu.model.vo.StoryVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final PoemMapper poemMapper;
    private final StoryMapper storyMapper;
    private final PoemService poemService;
    private final StoryService storyService;

    public HomeRecommendVO recommend() {
        Poem poem = poemMapper.selectOne(new LambdaQueryWrapper<Poem>()
                .eq(Poem::getStatus, ContentStatus.published)
                .orderByAsc(Poem::getSortOrder)
                .orderByAsc(Poem::getId)
                .last("LIMIT 1"));
        Story story = storyMapper.selectOne(new LambdaQueryWrapper<Story>()
                .eq(Story::getStatus, ContentStatus.published)
                .orderByAsc(Story::getSortOrder)
                .orderByAsc(Story::getId)
                .last("LIMIT 1"));

        PoemVO poemVO = poem == null ? null : poemService.toVO(poem);
        StoryVO storyVO = story == null ? null : storyService.toVO(story);
        return HomeRecommendVO.builder().poem(poemVO).story(storyVO).build();
    }
}
