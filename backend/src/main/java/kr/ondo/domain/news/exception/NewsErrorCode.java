package kr.ondo.domain.news.exception;

import kr.ondo.global.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum NewsErrorCode implements ErrorCode {

    NEWS_NOT_FOUND("NEWS_NOT_FOUND", "뉴스를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    NEWS_IMPORT_FAILED("NEWS_IMPORT_FAILED", "뉴스를 가져오지 못했습니다. 네이버 API 키 설정을 확인해 주세요.", HttpStatus.BAD_GATEWAY);

    private final String code;
    private final String message;
    private final HttpStatus status;
}
