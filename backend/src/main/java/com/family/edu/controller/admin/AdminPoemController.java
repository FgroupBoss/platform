package com.family.edu.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.family.edu.model.dto.PoemSaveDTO;
import com.family.edu.model.dto.StatusUpdateDTO;
import com.family.edu.model.dto.TtsGenerateDTO;
import com.family.edu.model.vo.PoemVO;
import com.family.edu.model.vo.ResponseVO;
import com.family.edu.service.PoemService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/poems")
@RequiredArgsConstructor
public class AdminPoemController {

    private final PoemService poemService;

    @GetMapping
    public ResponseVO<Page<PoemVO>> page(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String dynasty,
            @RequestParam(required = false) String status) {
        return ResponseVO.success(poemService.pageAdmin(page, size, dynasty, status));
    }

    @GetMapping("/{id}")
    public ResponseVO<PoemVO> detail(@PathVariable Long id) {
        return ResponseVO.success(poemService.getAdminDetail(id));
    }

    @PostMapping
    public ResponseVO<PoemVO> create(@Validated @RequestBody PoemSaveDTO dto) {
        return ResponseVO.success(poemService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseVO<PoemVO> update(@PathVariable Long id, @Validated @RequestBody PoemSaveDTO dto) {
        return ResponseVO.success(poemService.update(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseVO<PoemVO> updateStatus(@PathVariable Long id, @Validated @RequestBody StatusUpdateDTO dto) {
        return ResponseVO.success(poemService.updateStatus(id, dto.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseVO<Void> delete(@PathVariable Long id) {
        poemService.delete(id);
        return ResponseVO.success();
    }

    /** 根据诗词正文文字转音频并自动绑定 */
    @PostMapping("/{id}/generate-audio")
    public ResponseVO<PoemVO> generateAudio(@PathVariable Long id,
                                            @RequestBody(required = false) TtsGenerateDTO dto) {
        return ResponseVO.success(poemService.generateAudio(id, dto));
    }

    /** 上传音频文件并绑定到诗词 */
    @PostMapping("/{id}/bind-audio")
    public ResponseVO<PoemVO> bindAudio(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseVO.success(poemService.bindAudio(id, file));
    }
}
