package kr.ondo.global.exception;

import lombok.Getter;

/**
 * 도메인 로직에서 던지는 공통 예외. 컨트롤러에서 try-catch 금지 —
 * GlobalExceptionHandler가 일괄 처리한다. (claude.md 컨벤션)
 */
@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String detailMessage) {
        super(detailMessage);
        this.errorCode = errorCode;
    }
}
