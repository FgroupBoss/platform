package com.family.edu.model.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class StorySaveDTO {

    @NotBlank(message = "标题不能为空")
    private String title;
    private String storyType;

    @NotEmpty(message = "故事正文不能为空")
    private List<String> paragraphs;

    private Integer ageMin;
    private Long coverId;
    private Long audioId;
    private Long videoId;
    private String status;
    private Integer sortOrder;
}
