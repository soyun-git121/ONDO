package kr.ondo.domain.project.repository;

import java.util.List;
import java.util.Optional;
import kr.ondo.domain.project.entity.Project;
import kr.ondo.domain.project.entity.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * 공개 협업 실적 조회. 공개분만(projectDate DESC). api.md §6.
 * 참여 보유자(artisans)는 지연 로딩(batch fetch)으로 채운다.
 */
public interface ProjectRepository extends JpaRepository<Project, Long> {

    /** 목록 — 유형·보유자(slug)·featured 필터. 보유자 필터는 EXISTS 서브쿼리(중복/페이징 안전). */
    @Query("""
            select p from Project p
            where p.published = true
              and (:type is null or p.type = :type)
              and (:featured is null or p.featured = :featured)
              and (:artisanSlug is null or exists (
                    select 1 from ProjectArtisan pa
                    where pa.project = p and pa.artisan.slug = :artisanSlug))
            """)
    Page<Project> search(@Param("type") ProjectType type,
                        @Param("artisanSlug") String artisanSlug,
                        @Param("featured") Boolean featured,
                        Pageable pageable);

    Optional<Project> findBySlugAndPublishedTrue(String slug);

    /** 보유자 랜딩용 — 해당 보유자가 참여한 공개 실적 (projectDate DESC). api.md §2. */
    @Query("""
            select p from Project p
            where p.published = true
              and exists (select 1 from ProjectArtisan pa
                          where pa.project = p and pa.artisan.id = :artisanId)
            order by p.projectDate desc
            """)
    List<Project> findByArtisanForLanding(@Param("artisanId") Long artisanId, Pageable pageable);
}
