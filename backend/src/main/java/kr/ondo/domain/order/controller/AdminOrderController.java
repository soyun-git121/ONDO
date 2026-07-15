package kr.ondo.domain.order.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.order.dto.AdminOrderListItem;
import kr.ondo.domain.order.dto.AdminOrderResponse;
import kr.ondo.domain.order.dto.OrderStatusRequest;
import kr.ondo.domain.order.service.AdminOrderService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 관리자 주문 관리 (JWT). api.md §8. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ApiResponse<PageResponse<AdminOrderListItem>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        return ApiResponse.ok(adminOrderService.getList(page, size, status));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminOrderResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(adminOrderService.getOne(id));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<AdminOrderResponse> changeStatus(@PathVariable Long id,
                                                        @Valid @RequestBody OrderStatusRequest request) {
        return ApiResponse.ok(adminOrderService.changeStatus(id, request));
    }
}
