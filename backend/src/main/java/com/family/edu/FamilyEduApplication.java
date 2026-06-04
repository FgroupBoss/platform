package com.family.edu;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.family.edu.mapper")
public class FamilyEduApplication {

    public static void main(String[] args) {
        SpringApplication.run(FamilyEduApplication.class, args);
    }
}
