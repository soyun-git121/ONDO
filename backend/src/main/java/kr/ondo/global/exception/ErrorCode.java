package kr.ondo.global.exception;

import org.springframework.http.HttpStatus;

/**
 * 도메인별 에러 코드 enum이 구현하는 공통 인터페이스.
 * 예: ArtisanErrorCode.ARTISAN_NOT_FOUND (api.md '공통 > 에러 코드' 참조)
 */
public interface ErrorCode {

    String getCode();

    String getMessage();

    HttpStatus getStatus();
}
