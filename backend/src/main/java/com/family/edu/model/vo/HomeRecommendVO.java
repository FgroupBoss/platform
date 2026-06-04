package com.family.edu.model.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HomeRecommendVO {

    private PoemVO poem;
    private StoryVO story;
}
