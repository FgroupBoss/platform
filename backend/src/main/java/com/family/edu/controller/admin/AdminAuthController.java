package com.family.edu.controller.admin;

import com.family.edu.model.dto.LoginRequest;
import com.family.edu.model.vo.LoginVO;
import com.family.edu.model.vo.ResponseVO;
import com.family.edu.service.AdminAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseVO<LoginVO> login(@Validated @RequestBody LoginRequest request) {
        return ResponseVO.success(adminAuthService.login(request));
    }
}
