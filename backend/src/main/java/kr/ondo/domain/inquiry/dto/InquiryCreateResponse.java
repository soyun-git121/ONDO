package kr.ondo.domain.inquiry.dto;

import kr.ondo.domain.inquiry.entity.Inquiry;
import kr.ondo.domain.inquiry.entity.InquiryStatus;

/**
 * POST /api/inquiries 응답 (201). api.md §7.
 */
public record InquiryCreateResponse(Long id, InquiryStatus status) {
    public static InquiryCreateResponse from(Inquiry i) {
        return new InquiryCreateResponse(i.getId(), i.getStatus());
    }
}
