package kr.ondo.domain.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * POST /api/orders 요청. api.md §4.
 * 금액은 서버가 재계산하므로 요청에 포함하지 않는다(클라이언트 금액 신뢰 안 함).
 */
public record OrderCreateRequest(
        @NotBlank String ordererName,
        @NotBlank String phone,
        String email,
        @NotBlank String zipcode,
        @NotBlank String address,
        String addressDetail,
        String memo,
        @NotEmpty @Valid List<Item> items
) {
    public record Item(
            @NotNull Long productId,
            @Min(1) int quantity
    ) {
    }
}
