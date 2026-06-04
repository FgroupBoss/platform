package com.family.edu.model.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class PoemSaveDTO {

    @NotBlank(message = "标题不能为空")
    private String title;
    private String author;
    private String dynasty;

    @NotEmpty(message = "诗句不能为空")
    private List<String> lines;

    private List<String> pinyin;
    private String translation;
    private String difficulty;
    private List<String> tags;
    private Long coverId;
    private Long audioId;
    private Long videoId;
    private String status;
    private Integer sortOrder;
}
