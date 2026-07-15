package kr.ondo.domain.artisan.service;

import java.util.List;
import kr.ondo.domain.artisan.dto.ArtisanDetailResponse;
import kr.ondo.domain.artisan.dto.ArtisanDetailResponse.ProductItem;
import kr.ondo.domain.artisan.dto.ArtisanDetailResponse.ProjectItem;
import kr.ondo.domain.artisan.dto.ArtisanSummaryResponse;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.entity.Designation;
import kr.ondo.domain.artisan.exception.ArtisanErrorCode;
import kr.ondo.domain.artisan.repository.ArtisanRepository;
import kr.ondo.domain.product.entity.ProductStatus;
import kr.ondo.domain.product.repository.ProductRepository;
import kr.ondo.domain.project.repository.ProjectRepository;
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
public class ArtisanService {

    private static final int MAX_SIZE = 50;   // api.md 공통: size 최대 50
    private static final int DEFAULT_SIZE = 12;
    private static final int LANDING_PRODUCTS = 8; // api.md §2: 보유자 상세 대표 상품 최신 8개

    private final ArtisanRepository artisanRepository;
    private final ProductRepository productRepository;
    private final ProjectRepository projectRepository;

    /** 보유자 목록 (공개분, displayOrder 정렬). */
    public PageResponse<ArtisanSummaryResponse> getArtisans(int page, int size, String designation) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                clampSize(size),
                Sort.by(Sort.Direction.ASC, "displayOrder", "id")
        );

        var result = (designation == null || designation.isBlank())
                ? artisanRepository.findByPublishedTrue(pageable)
                : artisanRepository.findByPublishedTrueAndDesignation(parseDesignation(designation), pageable);

        return PageResponse.of(result, ArtisanSummaryResponse::from);
    }

    /** 보유자 상세 + 갤러리 + 대표 상품. 없거나 비공개면 404. */
    public ArtisanDetailResponse getArtisan(String slug) {
        Artisan artisan = artisanRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new BusinessException(ArtisanErrorCode.ARTISAN_NOT_FOUND));

        List<ProductItem> products = productRepository
                .findByArtisanForLanding(artisan.getId(), ProductStatus.HIDDEN,
                        PageRequest.of(0, LANDING_PRODUCTS))
                .stream()
                .map(p -> new ProductItem(p.getSlug(), p.getName(), p.getPrice(),
                        p.getCategory().name(), p.getStatus().name(), p.getThumbnailUrl()))
                .toList();

        List<ProjectItem> projects = projectRepository
                .findByArtisanForLanding(artisan.getId(), Pageable.unpaged())
                .stream()
                .map(pr -> new ProjectItem(pr.getSlug(), pr.getTitle(), pr.getType().name(),
                        pr.getResultMetric(), pr.getProjectDate(), pr.getThumbnailUrl()))
                .toList();

        return ArtisanDetailResponse.from(artisan, products, projects);
    }

    private int clampSize(int size) {
        if (size <= 0) {
            return DEFAULT_SIZE;
        }
        return Math.min(size, MAX_SIZE);
    }

    private Designation parseDesignation(String raw) {
        try {
            return Designation.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "지원하지 않는 designation: " + raw);
        }
    }
}
