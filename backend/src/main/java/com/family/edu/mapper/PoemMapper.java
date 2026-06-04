package com.family.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.family.edu.entity.Poem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface PoemMapper extends BaseMapper<Poem> {

    @Select("SELECT COUNT(1) FROM poem WHERE cover_id = #{mediaId} OR audio_id = #{mediaId} OR video_id = #{mediaId}")
    int countByMediaId(@Param("mediaId") Long mediaId);
}
