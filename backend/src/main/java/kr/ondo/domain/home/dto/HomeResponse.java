package kr.ondo.domain.home.dto;

import java.util.List;
import kr.ondo.domain.artisan.dto.ArtisanSummaryResponse;
import kr.ondo.domain.news.dto.NewsSummaryResponse;
import kr.ondo.domain.product.dto.ProductSummaryResponse;
import kr.ondo.domain.project.dto.ProjectSummaryResponse;

/**
 * GET /api/home 통합 응답. api.md §1 — 홈 첫 화면에 필요한 요약 데이터 묶음.
 * 기존 도메인 summary DTO를 재사용한다(중복 정의 금지).
 */
public record HomeResponse(
        List<ArtisanSummaryResponse> featuredArtisans,
        List<ProductSummaryResponse> featuredProducts,
        List<ProjectSummaryResponse> featuredProjects,
        List<NewsSummaryResponse> latestNews
) {
}
