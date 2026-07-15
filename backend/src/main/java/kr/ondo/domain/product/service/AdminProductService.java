package kr.ondo.domain.product.service;

import java.util.List;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.exception.ArtisanErrorCode;
import kr.ondo.domain.artisan.repository.ArtisanRepository;
import kr.ondo.domain.product.dto.AdminProductListItem;
import kr.ondo.domain.product.dto.AdminProductResponse;
import kr.ondo.domain.product.dto.ProductCreateRequest;
import kr.ondo.domain.product.dto.ProductStatusRequest;
import kr.ondo.domain.product.dto.ProductUpdateRequest;
import kr.ondo.domain.product.entity.Product;
import kr.ondo.domain.product.entity.ProductImage;
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

/** 관리자 상품 CRUD + 상태 변경. api.md §8. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ArtisanRepository artisanRepository;

    public PageResponse<AdminProductListItem> getList(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size <= 0 ? 20 : Math.min(size, 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return PageResponse.of(productRepository.findAll(pageable), AdminProductListItem::from);
    }

    public AdminProductResponse getOne(Long id) {
        return AdminProductResponse.from(findOrThrow(id));
    }

    @Transactional
    public AdminProductResponse create(ProductCreateRequest req) {
        if (productRepository.existsBySlug(req.slug())) {
            throw new BusinessException(GlobalErrorCode.DUPLICATE_SLUG);
        }
        Artisan artisan = loadArtisan(req.artisanId());
        Product product = Product.builder()
                .artisan(artisan).slug(req.slug()).name(req.name()).category(req.category())
                .price(req.price()).summary(req.summary()).description(req.description())
                .thumbnailUrl(req.thumbnailUrl()).stockQuantity(req.stockQuantity())
                .status(req.status()).externalUrl(req.externalUrl())
                .build();
        toImages(req.images()).forEach(product::addImage);
        return AdminProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public AdminProductResponse update(Long id, ProductUpdateRequest req) {
        Product product = findOrThrow(id);
        Artisan artisan = loadArtisan(req.artisanId());
        product.update(artisan, req.name(), req.category(), req.price(), req.summary(),
                req.description(), req.thumbnailUrl(), req.stockQuantity(), req.status(),
                req.externalUrl());
        product.replaceImages(toImages(req.images()));
        return AdminProductResponse.from(product);
    }

    @Transactional
    public AdminProductResponse changeStatus(Long id, ProductStatusRequest req) {
        Product product = findOrThrow(id);
        product.changeStatus(req.status());
        return AdminProductResponse.from(product);
    }

    @Transactional
    public void delete(Long id) {
        productRepository.delete(findOrThrow(id));
    }

    private Product findOrThrow(Long id) {
        return productRepository.findWithDetailsById(id)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));
    }

    private Artisan loadArtisan(Long artisanId) {
        return artisanRepository.findById(artisanId)
                .orElseThrow(() -> new BusinessException(ArtisanErrorCode.ARTISAN_NOT_FOUND));
    }

    private List<ProductImage> toImages(List<ProductCreateRequest.ImageRequest> reqs) {
        if (reqs == null) {
            return List.of();
        }
        return reqs.stream()
                .map(r -> ProductImage.builder()
                        .imageUrl(r.imageUrl()).caption(r.caption()).sortOrder(r.sortOrder()).build())
                .toList();
    }
}
