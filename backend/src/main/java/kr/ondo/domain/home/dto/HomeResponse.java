package kr.ondo.domain.home.dto;

import java.time.LocalDateTime;
import java.util.List;
import kr.ondo.domain.artisan.entity.Designation;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.product.entity.ProductStatus;
import kr.ondo.domain.project.entity.ProjectType;

/**
 * GET /api/home — 홈 화면용 통합 데이터(1콜). api.md §1.
 * 대표 보유자 / 대표 상품 / featured 실적 / 최신 뉴스.
 */
public record HomeResponse(
        List<ArtisanItem> featuredArtisans,
        List<ProductItem> featuredProducts,
        List<ProjectItem> featuredProjects,
        List<NewsItem> latestNews
) {
    public record ArtisanItem(
            String slug, String name, String title, Designation designation,
            String shortIntro, String profileImageUrl) {
    }

    public record ProductItem(
            String slug, String name, int price, String thumbnailUrl,
            String artisanName, ProductStatus status) {
    }

    public record ProjectItem(
            String slug, String title, ProjectType type, String resultMetric, String thumbnailUrl) {
    }

    public record NewsItem(
            Long id, String title, NewsCategory category, String thumbnailUrl,
            LocalDateTime publishedAt) {
    }
}
