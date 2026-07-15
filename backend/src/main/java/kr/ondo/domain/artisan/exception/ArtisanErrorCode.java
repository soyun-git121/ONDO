package kr.ondo.domain.artisan.exception;

import kr.ondo.global.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 보유자 도메인 에러 코드. api.md '공통 > 에러 코드'({DOMAIN}_NOT_FOUND) 참조.
 */
@Getter
@RequiredArgsConstructor
public enum ArtisanErrorCode implements ErrorCode {

    ARTISAN_NOT_FOUND("ARTISAN_NOT_FOUND", "보유자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

    private final String code;
    private final String message;
    private final HttpStatus status;
}
