package kr.ondo.domain.order.exception;

import kr.ondo.global.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 주문 도메인 에러 코드. api.md '공통 > 에러 코드' 참조.
 */
@Getter
@RequiredArgsConstructor
public enum OrderErrorCode implements ErrorCode {

    ORDER_NOT_FOUND("ORDER_NOT_FOUND", "주문을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    OUT_OF_STOCK("OUT_OF_STOCK", "재고가 부족합니다.", HttpStatus.CONFLICT),
    NOT_PURCHASABLE("INVALID_INPUT", "구매할 수 없는 상품이 포함되어 있습니다.", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus status;
}
