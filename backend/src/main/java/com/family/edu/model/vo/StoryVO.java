package com.family.edu.model.vo;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StoryVO {

    private String id;
    private String title;
    private String storyType;
    private List<String> paragraphs;
    private Integer ageMin;
    private String coverUrl;
    private String audioUrl;
    private String videoUrl;
    private String coverId;
    private String audioId;
    private String videoId;
    private String status;
    private Integer sortOrder;
}
