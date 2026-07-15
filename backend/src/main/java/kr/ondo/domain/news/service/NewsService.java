package kr.ondo.domain.news.service;

import kr.ondo.domain.news.dto.NewsDetailResponse;
import kr.ondo.domain.news.dto.NewsSummaryResponse;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.news.entity.NewsType;
import kr.ondo.domain.news.exception.NewsErrorCode;
import kr.ondo.domain.news.repository.NewsRepository;
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
public class NewsService {

    private static final int MAX_SIZE = 50;
    private static final int DEFAULT_SIZE = 12;

    private final NewsRepository newsRepository;

    public PageResponse<NewsSummaryResponse> getNewsList(int page, int size, String category) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), clampSize(size),
                Sort.by(Sort.Direction.DESC, "publishedAt"));
        var result = (category == null || category.isBlank())
                ? newsRepository.findByPublishedTrue(pageable)
                : newsRepository.findByPublishedTrueAndCategory(parseCategory(category), pageable);
        return PageResponse.of(result, NewsSummaryResponse::from);
    }

    /** 상세 — ORIGINAL 전용, 공개분만. 없으면 404. */
    public NewsDetailResponse getNews(Long id) {
        return newsRepository.findByIdAndPublishedTrueAndType(id, NewsType.ORIGINAL)
                .map(NewsDetailResponse::from)
                .orElseThrow(() -> new BusinessException(NewsErrorCode.NEWS_NOT_FOUND));
    }

    private int clampSize(int size) {
        return size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
    }

    private NewsCategory parseCategory(String raw) {
        try {
            return NewsCategory.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "지원하지 않는 category: " + raw);
        }
    }
}
