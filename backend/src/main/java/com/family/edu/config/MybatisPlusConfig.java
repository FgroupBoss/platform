package com.family.edu.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MybatisPlusConfig {

    @Value("${mybatis-plus.db-type:H2}")
    private String dbType;

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        DbType type = DbType.getDbType(dbType);
        if (type == null) {
            type = DbType.H2;
        }
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(type));
        return interceptor;
    }
}
