package kr.ondo.domain.news.controller;

import kr.ondo.domain.news.dto.NewsDetailResponse;
import kr.ondo.domain.news.dto.NewsSummaryResponse;
import kr.ondo.domain.news.service.NewsService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 뉴스 공개 API. api.md §5. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ApiResponse<PageResponse<NewsSummaryResponse>> getNewsList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category
    ) {
        return ApiResponse.ok(newsService.getNewsList(page, size, category));
    }

    @GetMapping("/{id}")
    public ApiResponse<NewsDetailResponse> getNews(@PathVariable Long id) {
        return ApiResponse.ok(newsService.getNews(id));
    }
}
