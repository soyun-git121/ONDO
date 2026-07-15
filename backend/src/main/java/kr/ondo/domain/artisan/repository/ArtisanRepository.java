package kr.ondo.domain.artisan.repository;

import java.util.Optional;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.entity.Designation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 공개 API용 조회. isPublished=true만 노출 (api.md §2).
 */
public interface ArtisanRepository extends JpaRepository<Artisan, Long> {

    Page<Artisan> findByPublishedTrue(Pageable pageable);

    Page<Artisan> findByPublishedTrueAndDesignation(Designation designation, Pageable pageable);

    /** 상세: 갤러리까지 함께 로드 (N+1 방지). */
    @EntityGraph(attributePaths = "images")
    Optional<Artisan> findBySlugAndPublishedTrue(String slug);
}
