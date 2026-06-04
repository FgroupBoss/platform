package com.family.edu.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.family.edu.enums.MediaType;
import com.family.edu.model.vo.MediaAssetVO;
import com.family.edu.model.vo.ResponseVO;
import com.family.edu.service.MediaAssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/media")
@RequiredArgsConstructor
public class AdminMediaController {

    private final MediaAssetService mediaAssetService;

    @GetMapping
    public ResponseVO<Page<MediaAssetVO>> page(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) MediaType mediaType) {
        return ResponseVO.success(mediaAssetService.pageList(page, size, mediaType));
    }

    @GetMapping("/{id}")
    public ResponseVO<MediaAssetVO> detail(@PathVariable Long id) {
        return ResponseVO.success(mediaAssetService.getById(id));
    }

    @PostMapping("/upload")
    public ResponseVO<MediaAssetVO> upload(@RequestParam("file") MultipartFile file) {
        return ResponseVO.success(mediaAssetService.upload(file));
    }

    @DeleteMapping("/{id}")
    public ResponseVO<Void> delete(@PathVariable Long id) {
        mediaAssetService.delete(id);
        return ResponseVO.success();
    }
}
