package com.family.edu.controller;

import com.family.edu.model.vo.ResponseVO;
import com.family.edu.model.vo.StoryVO;
import com.family.edu.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    public ResponseVO<List<StoryVO>> list(@RequestParam(required = false) String storyType) {
        return ResponseVO.success(storyService.listPublished(storyType));
    }

    @GetMapping("/{id}")
    public ResponseVO<StoryVO> detail(@PathVariable Long id) {
        return ResponseVO.success(storyService.getPublishedDetail(id));
    }
}
