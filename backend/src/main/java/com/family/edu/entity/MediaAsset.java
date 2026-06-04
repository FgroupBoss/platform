package com.family.edu.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.family.edu.enums.MediaType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("media_asset")
public class MediaAsset {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String fileName;
    private String filePath;
    private MediaType mediaType;
    private String mimeType;
    private Long fileSize;
    private Integer durationSec;
    private LocalDateTime createdAt;
}
