package com.family.edu.model.dto;

import lombok.Data;

@Data
public class TtsGenerateDTO {

    /** 可选，覆盖默认音色，如 zh-CN-XiaoxiaoNeural */
    private String voice;

    /** 可选，语速，如 +0%、-10% */
    private String rate;
}
