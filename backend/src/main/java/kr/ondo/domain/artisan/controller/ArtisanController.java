package kr.ondo.domain.artisan.controller;

import kr.ondo.domain.artisan.dto.ArtisanDetailResponse;
import kr.ondo.domain.artisan.dto.ArtisanSummaryResponse;
import kr.ondo.domain.artisan.service.ArtisanService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 보유자 공개 API. api.md §2.
 * 응답은 ApiResponse<T> 래핑, try-catch 금지(GlobalExceptionHandler 위임) — claude.md.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/artisans")
public class ArtisanController {

    private final ArtisanService artisanService;

    @GetMapping
    public ApiResponse<PageResponse<ArtisanSummaryResponse>> getArtisans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String designation
    ) {
        return ApiResponse.ok(artisanService.getArtisans(page, size, designation));
    }

    @GetMapping("/{slug}")
    public ApiResponse<ArtisanDetailResponse> getArtisan(@PathVariable String slug) {
        return ApiResponse.ok(artisanService.getArtisan(slug));
    }
}
