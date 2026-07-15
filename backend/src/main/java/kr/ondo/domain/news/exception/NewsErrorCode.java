package kr.ondo.domain.news.exception;

import kr.ondo.global.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum NewsErrorCode implements ErrorCode {

    NEWS_NOT_FOUND("NEWS_NOT_FOUND", "뉴스를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

    private final String code;
    private final String message;
    private final HttpStatus status;
}
