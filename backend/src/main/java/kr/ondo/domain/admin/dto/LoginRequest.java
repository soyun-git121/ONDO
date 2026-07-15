package kr.ondo.domain.admin.dto;

import jakarta.validation.constraints.NotBlank;

/** POST /api/admin/auth/login 요청. api.md §8. */
public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password
) {
}
