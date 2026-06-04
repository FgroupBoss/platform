package com.family.edu.controller;

import com.family.edu.model.vo.PoemVO;
import com.family.edu.model.vo.ResponseVO;
import com.family.edu.service.PoemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/poems")
@RequiredArgsConstructor
public class PoemController {

    private final PoemService poemService;

    @GetMapping
    public ResponseVO<List<PoemVO>> list(
            @RequestParam(required = false) String dynasty,
            @RequestParam(required = false) String difficulty) {
        return ResponseVO.success(poemService.listPublished(dynasty, difficulty));
    }

    @GetMapping("/{id}")
    public ResponseVO<PoemVO> detail(@PathVariable Long id) {
        return ResponseVO.success(poemService.getPublishedDetail(id));
    }
}
