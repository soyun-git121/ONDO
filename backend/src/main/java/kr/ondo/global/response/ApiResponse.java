package kr.ondo.global.response;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 모든 API 응답 공통 래퍼. api.md '공통 > 응답 포맷' 참조.
 * { "success": true, "data": {...}, "error": null }
 */
@JsonInclude(JsonInclude.Include.ALWAYS)
public record ApiResponse<T>(boolean success, T data, ErrorBody error) {

    public record ErrorBody(String code, String message) {
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(true, null, null);
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return new ApiResponse<>(false, null, new ErrorBody(code, message));
    }
}
