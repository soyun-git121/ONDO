package kr.ondo.domain.news.repository;

import java.util.Optional;
import kr.ondo.domain.news.entity.News;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.news.entity.NewsType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 공개 뉴스 조회. 공개분만(publishedAt DESC). api.md §5.
 */
public interface NewsRepository extends JpaRepository<News, Long> {

    Page<News> findByPublishedTrue(Pageable pageable);

    Page<News> findByPublishedTrueAndCategory(NewsCategory category, Pageable pageable);

    /** 상세는 ORIGINAL 전용 (CURATED는 상세 없음). artisan 함께 로드. */
    @EntityGraph(attributePaths = "artisan")
    Optional<News> findByIdAndPublishedTrueAndType(Long id, NewsType type);

    /** admin 상세 — 공개 여부·타입 무관. */
    @EntityGraph(attributePaths = "artisan")
    Optional<News> findWithArtisanById(Long id);
}
