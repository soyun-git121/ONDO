package kr.ondo.domain.news.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.news.dto.AdminNewsListItem;
import kr.ondo.domain.news.dto.AdminNewsResponse;
import kr.ondo.domain.news.dto.NewsCreateRequest;
import kr.ondo.domain.news.dto.NewsPublishRequest;
import kr.ondo.domain.news.dto.NewsUpdateRequest;
import kr.ondo.domain.news.service.AdminNewsService;
import kr.ondo.domain.news.service.NewsImportService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** 관리자 뉴스 CRUD (JWT). api.md §8. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/news")
public class AdminNewsController {

    private final AdminNewsService adminNewsService;
    private final NewsImportService newsImportService;

    /** 네이버 뉴스 검색 API로 전통문화 기사 가져오기(CURATED, 중복 URL 제외). 수동 실행. */
    @PostMapping("/import")
    public ApiResponse<Integer> importFromNaver(
            @RequestParam(defaultValue = "전통문화") String query,
            @RequestParam(defaultValue = "10") int display) {
        return ApiResponse.ok(newsImportService.importFromNaver(query, display));
    }

    @GetMapping
    public ApiResponse<PageResponse<AdminNewsListItem>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(adminNewsService.getList(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminNewsResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(adminNewsService.getOne(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminNewsResponse> create(@Valid @RequestBody NewsCreateRequest request) {
        return ApiResponse.ok(adminNewsService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminNewsResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody NewsUpdateRequest request) {
        return ApiResponse.ok(adminNewsService.update(id, request));
    }

    @PatchMapping("/{id}/publish")
    public ApiResponse<AdminNewsResponse> publish(@PathVariable Long id,
                                                  @RequestBody NewsPublishRequest request) {
        return ApiResponse.ok(adminNewsService.setPublish(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminNewsService.delete(id);
        return ApiResponse.ok();
    }
}
