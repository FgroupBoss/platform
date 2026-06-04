package com.family.edu.model.vo;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PoemVO {

    private String id;
    private String title;
    private String author;
    private String dynasty;
    private List<String> lines;
    private List<String> pinyin;
    private String translation;
    private String difficulty;
    private List<String> tags;
    private String coverUrl;
    private String audioUrl;
    private String videoUrl;
    private String coverId;
    private String audioId;
    private String videoId;
    private String status;
    private Integer sortOrder;
}
