package kr.ondo.domain.order.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.order.dto.OrderCreateRequest;
import kr.ondo.domain.order.dto.OrderCreateResponse;
import kr.ondo.domain.order.dto.OrderLookupResponse;
import kr.ondo.domain.order.service.OrderService;
import kr.ondo.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 주문 공개 API. api.md §4. 실결제 없음 — PENDING 생성 + 비회원 조회.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<OrderCreateResponse> create(@Valid @RequestBody OrderCreateRequest request) {
        return ApiResponse.ok(orderService.createOrder(request));
    }

    @GetMapping("/{orderNumber}")
    public ApiResponse<OrderLookupResponse> lookup(
            @PathVariable String orderNumber,
            @RequestParam String phone
    ) {
        return ApiResponse.ok(orderService.getOrder(orderNumber, phone));
    }
}
