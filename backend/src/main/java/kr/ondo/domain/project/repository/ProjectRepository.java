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

    /**
     * 목록 — 유형·보유자(slug)·노출 위치 필터. 보유자 필터는 EXISTS 서브쿼리(중복/페이징 안전).
     * 노출 위치 두 인자는 해당 페이지로 좁힐 때만 true를 넘기고, 전체 목록에서는 둘 다 null이다.
     */
    @Query("""
            select p from Project p
            where p.published = true
              and (:type is null or p.type = :type)
              and (:showOnHome is null or p.showOnHome = :showOnHome)
              and (:showOnCollaboration is null or p.showOnCollaboration = :showOnCollaboration)
              and (:artisanSlug is null or exists (
                    select 1 from ProjectArtisan pa
                    where pa.project = p and pa.artisan.slug = :artisanSlug))
            """)
    Page<Project> search(@Param("type") ProjectType type,
                        @Param("artisanSlug") String artisanSlug,
                        @Param("showOnHome") Boolean showOnHome,
                        @Param("showOnCollaboration") Boolean showOnCollaboration,
                        Pageable pageable);

    Optional<Project> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    /** 수정 시 중복 검사 — 자기 자신은 제외한다(slug를 그대로 두고 저장하는 경우가 대부분이다). */
    boolean existsBySlugAndIdNot(String slug, Long id);

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
