package kr.ondo.domain.product.service;

import kr.ondo.domain.product.dto.ProductDetailResponse;
import kr.ondo.domain.product.dto.ProductSummaryResponse;
import kr.ondo.domain.product.entity.ProductCategory;
import kr.ondo.domain.product.entity.ProductStatus;
import kr.ondo.domain.product.exception.ProductErrorCode;
import kr.ondo.domain.product.repository.ProductRepository;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private static final int MAX_SIZE = 50;
    private static final int DEFAULT_SIZE = 12;

    private final ProductRepository productRepository;

    /** 상품 목록 — 보유자·카테고리 필터 + 정렬(latest|priceAsc|priceDesc). HIDDEN 제외. */
    public PageResponse<ProductSummaryResponse> getProducts(int page, int size, String artisanSlug,
                                                            String category, String sort) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), clampSize(size), resolveSort(sort));
        var result = productRepository.search(
                ProductStatus.HIDDEN,
                (artisanSlug == null || artisanSlug.isBlank()) ? null : artisanSlug,
                parseCategory(category),
                pageable
        );
        return PageResponse.of(result, ProductSummaryResponse::from);
    }

    /** 상품 상세. 없거나 HIDDEN이면 404. */
    public ProductDetailResponse getProduct(String slug) {
        return productRepository.findBySlugAndStatusNot(slug, ProductStatus.HIDDEN)
                .map(ProductDetailResponse::from)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));
    }

    private int clampSize(int size) {
        if (size <= 0) {
            return DEFAULT_SIZE;
        }
        return Math.min(size, MAX_SIZE);
    }

    private Sort resolveSort(String sort) {
        return switch (sort == null ? "latest" : sort) {
            case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
            case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private ProductCategory parseCategory(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return ProductCategory.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "지원하지 않는 category: " + raw);
        }
    }
}
