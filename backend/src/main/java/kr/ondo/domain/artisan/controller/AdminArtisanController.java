package kr.ondo.domain.artisan.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.artisan.dto.AdminArtisanListItem;
import kr.ondo.domain.artisan.dto.AdminArtisanResponse;
import kr.ondo.domain.artisan.dto.ArtisanCreateRequest;
import kr.ondo.domain.artisan.dto.ArtisanUpdateRequest;
import kr.ondo.domain.artisan.service.AdminArtisanService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자 보유자 CRUD (JWT 필요). api.md §8.
 * "보유자 추가는 admin CRUD만으로 가능해야 함" — 하드코딩 금지 원칙 구현.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/artisans")
public class AdminArtisanController {

    private final AdminArtisanService adminArtisanService;

    @GetMapping
    public ApiResponse<PageResponse<AdminArtisanListItem>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(adminArtisanService.getList(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminArtisanResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(adminArtisanService.getOne(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminArtisanResponse> create(@Valid @RequestBody ArtisanCreateRequest request) {
        return ApiResponse.ok(adminArtisanService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminArtisanResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody ArtisanUpdateRequest request) {
        return ApiResponse.ok(adminArtisanService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminArtisanService.delete(id);
        return ApiResponse.ok();
    }
}
