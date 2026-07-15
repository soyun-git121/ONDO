package kr.ondo.domain.product.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.product.dto.AdminProductListItem;
import kr.ondo.domain.product.dto.AdminProductResponse;
import kr.ondo.domain.product.dto.ProductCreateRequest;
import kr.ondo.domain.product.dto.ProductStatusRequest;
import kr.ondo.domain.product.dto.ProductUpdateRequest;
import kr.ondo.domain.product.service.AdminProductService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** 관리자 상품 CRUD (JWT). api.md §8. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    public ApiResponse<PageResponse<AdminProductListItem>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(adminProductService.getList(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminProductResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(adminProductService.getOne(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminProductResponse> create(@Valid @RequestBody ProductCreateRequest request) {
        return ApiResponse.ok(adminProductService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminProductResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody ProductUpdateRequest request) {
        return ApiResponse.ok(adminProductService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<AdminProductResponse> changeStatus(@PathVariable Long id,
                                                          @Valid @RequestBody ProductStatusRequest request) {
        return ApiResponse.ok(adminProductService.changeStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminProductService.delete(id);
        return ApiResponse.ok();
    }
}
