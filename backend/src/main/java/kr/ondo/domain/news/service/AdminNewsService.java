package kr.ondo.domain.news.service;

import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.exception.ArtisanErrorCode;
import kr.ondo.domain.artisan.repository.ArtisanRepository;
import kr.ondo.domain.news.dto.AdminNewsListItem;
import kr.ondo.domain.news.dto.AdminNewsResponse;
import kr.ondo.domain.news.dto.NewsCreateRequest;
import kr.ondo.domain.news.dto.NewsPublishRequest;
import kr.ondo.domain.news.dto.NewsUpdateRequest;
import kr.ondo.domain.news.entity.News;
import kr.ondo.domain.news.exception.NewsErrorCode;
import kr.ondo.domain.news.repository.NewsRepository;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 관리자 뉴스 CRUD + publish 토글. api.md §8. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminNewsService {

    private final NewsRepository newsRepository;
    private final ArtisanRepository artisanRepository;

    public PageResponse<AdminNewsListItem> getList(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size <= 0 ? 20 : Math.min(size, 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return PageResponse.of(newsRepository.findAll(pageable), AdminNewsListItem::from);
    }

    public AdminNewsResponse getOne(Long id) {
        return AdminNewsResponse.from(findOrThrow(id));
    }

    @Transactional
    public AdminNewsResponse create(NewsCreateRequest req) {
        News news = News.builder()
                .title(req.title()).thumbnailUrl(req.thumbnailUrl()).type(req.type())
                .content(req.content()).externalUrl(req.externalUrl()).sourceName(req.sourceName())
                .category(req.category()).artisan(loadArtisan(req.artisanId()))
                .published(req.published()).publishedAt(req.publishedAt())
                .build();
        return AdminNewsResponse.from(newsRepository.save(news));
    }

    @Transactional
    public AdminNewsResponse update(Long id, NewsUpdateRequest req) {
        News news = findOrThrow(id);
        news.update(req.title(), req.thumbnailUrl(), req.type(), req.content(), req.externalUrl(),
                req.sourceName(), req.category(), loadArtisan(req.artisanId()), req.publishedAt());
        return AdminNewsResponse.from(news);
    }

    @Transactional
    public AdminNewsResponse setPublish(Long id, NewsPublishRequest req) {
        News news = findOrThrow(id);
        news.setPublished(req.published());
        return AdminNewsResponse.from(news);
    }

    @Transactional
    public void delete(Long id) {
        newsRepository.delete(findOrThrow(id));
    }

    private News findOrThrow(Long id) {
        return newsRepository.findWithArtisanById(id)
                .orElseThrow(() -> new BusinessException(NewsErrorCode.NEWS_NOT_FOUND));
    }

    private Artisan loadArtisan(Long artisanId) {
        if (artisanId == null) {
            return null;
        }
        return artisanRepository.findById(artisanId)
                .orElseThrow(() -> new BusinessException(ArtisanErrorCode.ARTISAN_NOT_FOUND));
    }
}
