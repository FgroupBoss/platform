package com.family.edu.model.vo;

import com.family.edu.enums.MediaType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MediaAssetVO {

    private String id;
    private String fileName;
    private MediaType mediaType;
    private String mimeType;
    private Long fileSize;
    private Integer durationSec;
    private String url;
    private Integer referenceCount;
}
