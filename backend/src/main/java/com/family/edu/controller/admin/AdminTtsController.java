package com.family.edu.controller.admin;

import com.family.edu.model.dto.TtsGenerateDTO;
import com.family.edu.model.dto.TtsSynthesizeDTO;
import com.family.edu.model.vo.MediaAssetVO;
import com.family.edu.model.vo.PoemVO;
import com.family.edu.model.vo.ResponseVO;
import com.family.edu.service.TextToSpeechService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/tts")
@RequiredArgsConstructor
public class AdminTtsController {

    private final TextToSpeechService textToSpeechService;

    /**
     * 通用文字转音频，直接传入文本合成并入库。
     */
    @PostMapping("/synthesize")
    public ResponseVO<MediaAssetVO> synthesize(@Validated @RequestBody TtsSynthesizeDTO dto) {
        String fileName = dto.getFileName() == null ? "tts-" + System.currentTimeMillis() + ".mp3" : dto.getFileName();
        MediaAssetVO asset = textToSpeechService.synthesizeAndSave(
                dto.getText(), fileName, dto.getVoice(), dto.getRate());
        return ResponseVO.success(asset);
    }
}
