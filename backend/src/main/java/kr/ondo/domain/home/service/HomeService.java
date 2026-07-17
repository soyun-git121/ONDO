package kr.ondo.domain.home.service;

import kr.ondo.domain.artisan.service.ArtisanService;
import kr.ondo.domain.home.dto.HomeResponse;
import kr.ondo.domain.news.service.NewsService;
import kr.ondo.domain.product.service.ProductService;
import kr.ondo.domain.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 홈 통합 조회. 각 도메인 공개 서비스의 목록 메서드를 재사용해 상단 N건씩 묶는다.
 */
@Service
@RequiredArgsConstructor
public class HomeService {

    private final ArtisanService artisanService;
    private final ProductService productService;
    private final ProjectService projectService;
    private final NewsService newsService;

    public HomeResponse getHome() {
        return new HomeResponse(
                artisanService.getArtisans(0, 6, null).content(),
                productService.getProducts(0, 6, null, null, "latest").content(),
                projectService.getProjects(0, 6, null, null, null).content(),
                newsService.getNewsList(0, 5, null).content()
        );
    }
}
