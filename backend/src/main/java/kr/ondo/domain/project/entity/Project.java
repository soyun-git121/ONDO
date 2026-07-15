package kr.ondo.domain.project.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 협업 실적(Project) — 쇼케이스. db_schema.md §8 / api.md §6.
 * 보유자와 N:M(ProjectArtisan). 노출: /projects, 보유자 랜딩, 협업문의 페이지.
 */
@Entity
@Getter
@Table(name = "project", indexes = {
        @Index(name = "idx_project_list", columnList = "is_published, type, project_date"),
        @Index(name = "idx_project_featured", columnList = "is_featured, display_order")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectType type;

    @Column(name = "client_name", length = 100)
    private String clientName;

    @Column(length = 300)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description; // 마크다운: 배경→진행→결과

    @Column(name = "result_metric", length = 200)
    private String resultMetric;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "project_date", nullable = false)
    private LocalDate projectDate;

    @Column(name = "is_featured", nullable = false)
    private boolean featured;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "is_published", nullable = false)
    private boolean published;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProjectImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectArtisan> participants = new ArrayList<>();

    @Builder
    private Project(String slug, String title, ProjectType type, String clientName, String summary,
                    String description, String resultMetric, String thumbnailUrl, LocalDate projectDate,
                    boolean featured, int displayOrder, boolean published) {
        this.slug = slug;
        this.title = title;
        this.type = type;
        this.clientName = clientName;
        this.summary = summary;
        this.description = description;
        this.resultMetric = resultMetric;
        this.thumbnailUrl = thumbnailUrl;
        this.projectDate = projectDate;
        this.featured = featured;
        this.displayOrder = displayOrder;
        this.published = published;
    }

    public void addImage(ProjectImage image) {
        images.add(image);
        image.assignProject(this);
    }

    public void addParticipant(ProjectArtisan participant) {
        participants.add(participant);
        participant.assignProject(this);
    }
}
