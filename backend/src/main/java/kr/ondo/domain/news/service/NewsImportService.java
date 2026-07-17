package kr.ondo.domain.news.service;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import kr.ondo.domain.news.client.NaverNewsClient;
import kr.ondo.domain.news.client.NaverNewsItem;
import kr.ondo.domain.news.client.OgImageFetcher;
import kr.ondo.domain.news.entity.News;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.news.entity.NewsType;
import kr.ondo.domain.news.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

/**
 * 네이버 뉴스 검색 API로 전통문화 관련 기사를 가져와 CURATED 뉴스로 저장.
 * 관리자가 /api/admin/news/import 로 필요할 때 실행(자동 스케줄 없음).
 */
@Service
@RequiredArgsConstructor
public class NewsImportService {

    private static final String SOURCE_NAME = "네이버뉴스";
    private static final DateTimeFormatter NAVER_PUBDATE_FORMAT = DateTimeFormatter.RFC_1123_DATE_TIME;

    private final NaverNewsClient naverNewsClient;
    private final OgImageFetcher ogImageFetcher;
    private final NewsRepository newsRepository;

    @Transactional
    public int importFromNaver(String query, int display) {
        List<NaverNewsItem> items = naverNewsClient.search(query, display);
        int imported = 0;
        for (NaverNewsItem item : items) {
            String url = pickUrl(item);
            if (url == null || newsRepository.existsByExternalUrl(url)) {
                continue;
            }
            News news = News.builder()
                    .title(cleanText(item.title()))
                    .thumbnailUrl(ogImageFetcher.fetch(url))
                    .type(NewsType.CURATED)
                    .externalUrl(url)
                    .sourceName(SOURCE_NAME)
                    .category(NewsCategory.TRADITION)
                    .artisan(null)
                    .published(true)
                    .publishedAt(parsePubDate(item.pubDate()))
                    .build();
            newsRepository.save(news);
            imported++;
        }
        return imported;
    }

    private String pickUrl(NaverNewsItem item) {
        if (item.originallink() != null && !item.originallink().isBlank()) {
            return item.originallink();
        }
        if (item.link() != null && !item.link().isBlank()) {
            return item.link();
        }
        return null;
    }

    private String cleanText(String raw) {
        if (raw == null) {
            return "";
        }
        return HtmlUtils.htmlUnescape(raw.replaceAll("</?b>", "")).trim();
    }

    private LocalDateTime parsePubDate(String pubDate) {
        if (pubDate == null || pubDate.isBlank()) {
            return LocalDateTime.now();
        }
        try {
            return java.time.ZonedDateTime.parse(pubDate, NAVER_PUBDATE_FORMAT).toLocalDateTime();
        } catch (DateTimeException e) {
            return LocalDateTime.now();
        }
    }
}
