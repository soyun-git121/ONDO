package kr.ondo.domain.inquiry.service;

import kr.ondo.domain.inquiry.dto.AdminInquiryResponse;
import kr.ondo.domain.inquiry.dto.InquiryUpdateRequest;
import kr.ondo.domain.inquiry.entity.Inquiry;
import kr.ondo.domain.inquiry.entity.InquiryStatus;
import kr.ondo.domain.inquiry.entity.InquiryType;
import kr.ondo.domain.inquiry.exception.InquiryErrorCode;
import kr.ondo.domain.inquiry.repository.InquiryRepository;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 관리자 문의 조회·처리. api.md §8. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminInquiryService {

    private final InquiryRepository inquiryRepository;

    public PageResponse<AdminInquiryResponse> getList(int page, int size, String status, String type) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size <= 0 ? 20 : Math.min(size, 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        var result = inquiryRepository.search(parseStatus(status), parseType(type), pageable);
        return PageResponse.of(result, AdminInquiryResponse::from);
    }

    public AdminInquiryResponse getOne(Long id) {
        return AdminInquiryResponse.from(findOrThrow(id));
    }

    @Transactional
    public AdminInquiryResponse update(Long id, InquiryUpdateRequest req) {
        Inquiry inquiry = findOrThrow(id);
        inquiry.updateStatus(req.status(), req.adminNote());
        return AdminInquiryResponse.from(inquiry);
    }

    private Inquiry findOrThrow(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(InquiryErrorCode.INQUIRY_NOT_FOUND));
    }

    private InquiryStatus parseStatus(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return InquiryStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "지원하지 않는 status: " + raw);
        }
    }

    private InquiryType parseType(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return InquiryType.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "지원하지 않는 type: " + raw);
        }
    }
}
