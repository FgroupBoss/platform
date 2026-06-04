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
@TableName(value = "poem", autoResultMap = true)
public class Poem {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String author;
    private String dynasty;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> lines;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> pinyin;

    private String translation;
    private String difficulty;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> tags;

    private Long coverId;
    private Long audioId;
    private Long videoId;
    private ContentStatus status;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
