package kr.ondo.domain.upload.controller;

import kr.ondo.domain.upload.dto.UploadResponse;
import kr.ondo.domain.upload.service.UploadService;
import kr.ondo.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** 관리자 이미지 업로드 (JWT). api.md §8. multipart/form-data, 필드명 file. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/uploads")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping
    public ApiResponse<UploadResponse> upload(@RequestParam("file") MultipartFile file) {
        return ApiResponse.ok(new UploadResponse(uploadService.store(file)));
    }
}
