package com.family.edu.model.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class TtsSynthesizeDTO {

    @NotBlank(message = "合成文本不能为空")
    private String text;

    private String fileName;

    private String voice;

    private String rate;
}
