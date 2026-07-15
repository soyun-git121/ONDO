package kr.ondo.domain.product.controller;

import kr.ondo.domain.product.dto.ProductDetailResponse;
import kr.ondo.domain.product.dto.ProductSummaryResponse;
import kr.ondo.domain.product.service.ProductService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 상품 공개 API. api.md §3.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ApiResponse<PageResponse<ProductSummaryResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String artisan,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "latest") String sort
    ) {
        return ApiResponse.ok(productService.getProducts(page, size, artisan, category, sort));
    }

    @GetMapping("/{slug}")
    public ApiResponse<ProductDetailResponse> getProduct(@PathVariable String slug) {
        return ApiResponse.ok(productService.getProduct(slug));
    }
}
