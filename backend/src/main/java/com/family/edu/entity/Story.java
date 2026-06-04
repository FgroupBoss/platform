package com.family.edu.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.family.edu.enums.ContentStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName(value = "story", autoResultMap = true)
public class Story {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String storyType;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> paragraphs;

    private Integer ageMin;
    private Long coverId;
    private Long audioId;
    private Long videoId;
    private ContentStatus status;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
