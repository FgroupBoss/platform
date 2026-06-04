package com.family.edu.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceConfig {

    private final DataSourceProperties dataSourceProperties;
    private final AppProperties appProperties;

    @Bean
    @Primary
    public DataSource dataSource() throws IOException {
        prepareStorageDirectory(appProperties.getStorage().getLocalPath());
        HikariDataSource dataSource = dataSourceProperties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
        return dataSource;
    }

    private void prepareStorageDirectory(String localPath) throws IOException {
        Path uploadRoot = Paths.get(localPath).toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
        log.info("upload directory ready path={}", uploadRoot);
    }
}
