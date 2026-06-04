package com.family.edu.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.family.edu.entity.AdminUser;
import com.family.edu.exception.BusinessException;
import com.family.edu.mapper.AdminUserMapper;
import com.family.edu.model.dto.LoginRequest;
import com.family.edu.model.vo.LoginVO;
import com.family.edu.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminUserMapper adminUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginVO login(LoginRequest request) {
        AdminUser user = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUser>().eq(AdminUser::getUsername, request.getUsername()));
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(401, "用户名或密码错误");
        }
        String token = jwtTokenProvider.createToken(user.getUsername());
        return new LoginVO(token, user.getUsername());
    }
}
