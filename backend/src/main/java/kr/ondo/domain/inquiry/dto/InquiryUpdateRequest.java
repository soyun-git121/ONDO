package kr.ondo.domain.inquiry.dto;

import jakarta.validation.constraints.NotNull;
import kr.ondo.domain.inquiry.entity.InquiryStatus;

/** PATCH /api/admin/inquiries/{id} 요청. api.md §8. */
public record InquiryUpdateRequest(
        @NotNull InquiryStatus status,
        String adminNote
) {
}
