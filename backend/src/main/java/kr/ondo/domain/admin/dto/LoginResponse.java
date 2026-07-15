package kr.ondo.domain.admin.dto;

/** POST /api/admin/auth/login 응답. api.md §8. */
public record LoginResponse(String accessToken, long expiresIn) {
}
