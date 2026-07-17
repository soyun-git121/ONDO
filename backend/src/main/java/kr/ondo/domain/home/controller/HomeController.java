package kr.ondo.domain.home.controller;

import kr.ondo.domain.home.dto.HomeResponse;
import kr.ondo.domain.home.service.HomeService;
import kr.ondo.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 홈 통합 API. api.md §1.
 * 응답은 ApiResponse<T> 래핑, try-catch 금지(GlobalExceptionHandler 위임) — claude.md.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/home")
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ApiResponse<HomeResponse> getHome() {
        return ApiResponse.ok(homeService.getHome());
    }
}
