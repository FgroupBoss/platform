package com.family.edu.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.family.edu.model.dto.StatusUpdateDTO;
import com.family.edu.model.dto.StorySaveDTO;
import com.family.edu.model.dto.TtsGenerateDTO;
import com.family.edu.model.vo.ResponseVO;
import com.family.edu.model.vo.StoryVO;
import com.family.edu.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/stories")
@RequiredArgsConstructor
public class AdminStoryController {

    private final StoryService storyService;

    @GetMapping
    public ResponseVO<Page<StoryVO>> page(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String storyType,
            @RequestParam(required = false) String status) {
        return ResponseVO.success(storyService.pageAdmin(page, size, storyType, status));
    }

    @GetMapping("/{id}")
    public ResponseVO<StoryVO> detail(@PathVariable Long id) {
        return ResponseVO.success(storyService.getAdminDetail(id));
    }

    @PostMapping
    public ResponseVO<StoryVO> create(@Validated @RequestBody StorySaveDTO dto) {
        return ResponseVO.success(storyService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseVO<StoryVO> update(@PathVariable Long id, @Validated @RequestBody StorySaveDTO dto) {
        return ResponseVO.success(storyService.update(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseVO<StoryVO> updateStatus(@PathVariable Long id, @Validated @RequestBody StatusUpdateDTO dto) {
        return ResponseVO.success(storyService.updateStatus(id, dto.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseVO<Void> delete(@PathVariable Long id) {
        storyService.delete(id);
        return ResponseVO.success();
    }

    /** 根据故事正文文字转音频并自动绑定 */
    @PostMapping("/{id}/generate-audio")
    public ResponseVO<StoryVO> generateAudio(@PathVariable Long id,
                                             @RequestBody(required = false) TtsGenerateDTO dto) {
        return ResponseVO.success(storyService.generateAudio(id, dto));
    }

    /** 上传音频文件并绑定到故事 */
    @PostMapping("/{id}/bind-audio")
    public ResponseVO<StoryVO> bindAudio(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseVO.success(storyService.bindAudio(id, file));
    }
}
