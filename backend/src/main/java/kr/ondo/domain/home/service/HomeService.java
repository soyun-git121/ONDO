package kr.ondo.domain.home.service;

import kr.ondo.domain.artisan.repository.ArtisanRepository;
import kr.ondo.domain.home.dto.HomeResponse;
import kr.ondo.domain.home.dto.HomeResponse.ArtisanItem;
import kr.ondo.domain.home.dto.HomeResponse.NewsItem;
import kr.ondo.domain.home.dto.HomeResponse.ProductItem;
import kr.ondo.domain.home.dto.HomeResponse.ProjectItem;
import kr.ondo.domain.news.repository.NewsRepository;
import kr.ondo.domain.product.entity.ProductStatus;
import kr.ondo.domain.product.repository.ProductRepository;
import kr.ondo.domain.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 홈 통합 데이터 집계. api.md §1.
 * 각 도메인 레포지토리에서 공개분을 소량씩 조회해 1콜로 조합한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeService {

    private static final int FEATURED_ARTISANS = 6;
    private static final int FEATURED_PRODUCTS = 6;
    private static final int FEATURED_PROJECTS = 6;
    private static final int LATEST_NEWS = 4;

    private final ArtisanRepository artisanRepository;
    private final ProductRepository productRepository;
    private final ProjectRepository projectRepository;
    private final NewsRepository newsRepository;

    public HomeResponse getHome() {
        var artisans = artisanRepository
                .findByPublishedTrue(PageRequest.of(0, FEATURED_ARTISANS,
                        Sort.by(Sort.Direction.ASC, "displayOrder", "id")))
                .getContent().stream()
                .map(a -> new ArtisanItem(a.getSlug(), a.getName(), a.getTitle(),
                        a.getDesignation(), a.getShortIntro(), a.getProfileImageUrl()))
                .toList();

        var products = productRepository
                .search(ProductStatus.HIDDEN, null, null, PageRequest.of(0, FEATURED_PRODUCTS,
                        Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().stream()
                .map(p -> new ProductItem(p.getSlug(), p.getName(), p.getPrice(),
                        p.getThumbnailUrl(), p.getArtisan().getName(), p.getStatus()))
                .toList();

        var projects = projectRepository
                .search(null, null, true, PageRequest.of(0, FEATURED_PROJECTS,
                        Sort.by(Sort.Direction.DESC, "projectDate")))
                .getContent().stream()
                .map(pr -> new ProjectItem(pr.getSlug(), pr.getTitle(), pr.getType(),
                        pr.getResultMetric(), pr.getThumbnailUrl()))
                .toList();

        var news = newsRepository
                .findByPublishedTrue(PageRequest.of(0, LATEST_NEWS,
                        Sort.by(Sort.Direction.DESC, "publishedAt")))
                .getContent().stream()
                .map(n -> new NewsItem(n.getId(), n.getTitle(), n.getCategory(),
                        n.getThumbnailUrl(), n.getPublishedAt()))
                .toList();

        return new HomeResponse(artisans, products, projects, news);
    }
}
