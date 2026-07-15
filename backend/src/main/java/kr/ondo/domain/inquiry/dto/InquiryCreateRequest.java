package kr.ondo.domain.inquiry.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.ondo.domain.inquiry.entity.InquiryType;

/**
 * POST /api/inquiries 요청. api.md §7.
 */
public record InquiryCreateRequest(
        @NotNull InquiryType type,
        String companyName,
        @NotBlank String contactName,
        @NotBlank @Email String email,
        String phone,
        @NotBlank String message
) {
}
