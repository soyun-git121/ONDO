package kr.ondo.domain.inquiry.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.inquiry.dto.InquiryCreateRequest;
import kr.ondo.domain.inquiry.dto.InquiryCreateResponse;
import kr.ondo.domain.inquiry.service.InquiryService;
import kr.ondo.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** 협업문의 공개 API. api.md §7. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<InquiryCreateResponse> create(@Valid @RequestBody InquiryCreateRequest request) {
        return ApiResponse.ok(inquiryService.create(request));
    }
}
