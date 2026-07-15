package kr.ondo.domain.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import kr.ondo.domain.artisan.entity.Artisan;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 프로젝트 참여 보유자 (N:M + role). db_schema.md §9.
 * 한 프로젝트에 보유자 여러 명 참여 가능, 보유자 없는 프로젝트도 가능(ONDO 자체).
 * (project_id, artisan_id) 유니크 — 대리키 사용으로 매핑 단순화.
 */
@Entity
@Getter
@Table(name = "project_artisan",
        uniqueConstraints = @UniqueConstraint(name = "uk_pa", columnNames = {"project_id", "artisan_id"}),
        indexes = @Index(name = "idx_pa_artisan", columnList = "artisan_id"))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectArtisan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    @Column(length = 100)
    private String role; // 참여 역할 (선택)

    private ProjectArtisan(Artisan artisan, String role) {
        this.artisan = artisan;
        this.role = role;
    }

    public static ProjectArtisan of(Artisan artisan, String role) {
        return new ProjectArtisan(artisan, role);
    }

    void assignProject(Project project) {
        this.project = project;
    }
}
