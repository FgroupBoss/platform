package com.family.edu.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.family.edu.entity.AdminUser;
import com.family.edu.mapper.AdminUserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminDataInitializer implements CommandLineRunner {

    private final AdminUserMapper adminUserMapper;
    private final AppProperties appProperties;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String username = appProperties.getAdmin().getDefaultUsername();
        AdminUser existing = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUser>().eq(AdminUser::getUsername, username).last("LIMIT 1"));
        if (existing != null) {
            return;
        }
        AdminUser admin = new AdminUser();
        admin.setUsername(username);
        admin.setPasswordHash(passwordEncoder.encode(appProperties.getAdmin().getDefaultPassword()));
        adminUserMapper.insert(admin);
        log.info("default admin user created username={}", username);
    }
}
