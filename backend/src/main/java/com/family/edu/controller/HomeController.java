package com.family.edu.controller;

import com.family.edu.model.vo.HomeRecommendVO;
import com.family.edu.model.vo.ResponseVO;
import com.family.edu.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/recommend")
    public ResponseVO<HomeRecommendVO> recommend() {
        return ResponseVO.success(homeService.recommend());
    }
}
