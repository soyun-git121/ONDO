package kr.ondo.domain.inquiry.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.inquiry.dto.AdminInquiryResponse;
import kr.ondo.domain.inquiry.dto.InquiryUpdateRequest;
import kr.ondo.domain.inquiry.service.AdminInquiryService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 관리자 문의 관리 (JWT). api.md §8. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/inquiries")
public class AdminInquiryController {

    private final AdminInquiryService adminInquiryService;

    @GetMapping
    public ApiResponse<PageResponse<AdminInquiryResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        return ApiResponse.ok(adminInquiryService.getList(page, size, status, type));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminInquiryResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(adminInquiryService.getOne(id));
    }

    @PatchMapping("/{id}")
    public ApiResponse<AdminInquiryResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody InquiryUpdateRequest request) {
        return ApiResponse.ok(adminInquiryService.update(id, request));
    }
}
