package kr.ondo.domain.inquiry.dto;

import java.time.LocalDateTime;
import kr.ondo.domain.inquiry.entity.Inquiry;
import kr.ondo.domain.inquiry.entity.InquiryStatus;
import kr.ondo.domain.inquiry.entity.InquiryType;

/** 관리자용 문의 상세 (message 전문·adminNote 포함). api.md §8. */
public record AdminInquiryResponse(
        Long id,
        InquiryType type,
        String companyName,
        String contactName,
        String email,
        String phone,
        String message,
        InquiryStatus status,
        String adminNote,
        LocalDateTime createdAt
) {
    public static AdminInquiryResponse from(Inquiry i) {
        return new AdminInquiryResponse(
                i.getId(), i.getType(), i.getCompanyName(), i.getContactName(), i.getEmail(),
                i.getPhone(), i.getMessage(), i.getStatus(), i.getAdminNote(), i.getCreatedAt()
        );
    }
}
