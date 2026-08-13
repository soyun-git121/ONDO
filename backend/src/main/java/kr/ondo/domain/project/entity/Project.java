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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * 협업 실적(Project) — 쇼케이스. db_schema.md §8 / api.md §6.
 * 보유자와 N:M(ProjectArtisan). 노출: /projects, 보유자 랜딩, 협업문의 페이지.
 */
@Entity
@Getter
@Table(name = "project", indexes = {
        @Index(name = "idx_project_list", columnList = "is_published, type, project_date"),
        @Index(name = "idx_project_home", columnList = "show_on_home, display_order"),
        @Index(name = "idx_project_collaboration", columnList = "show_on_collaboration, display_order")
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
    @JdbcTypeCode(SqlTypes.VARCHAR)
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

    /**
     * 노출 위치. 페이지마다 따로 고른다 — 홈에만, 협업문의에만, 둘 다, 어느 쪽도 아님이 모두 가능하다.
     * 예전에는 is_featured 하나로 두 페이지를 함께 켜고 껐다(V2에서 분리).
     */
    @Column(name = "show_on_home", nullable = false)
    private boolean showOnHome;

    @Column(name = "show_on_collaboration", nullable = false)
    private boolean showOnCollaboration;

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
                    boolean showOnHome, boolean showOnCollaboration, int displayOrder, boolean published) {
        this.slug = slug;
        this.title = title;
        this.type = type;
        this.clientName = clientName;
        this.summary = summary;
        this.description = description;
        this.resultMetric = resultMetric;
        this.thumbnailUrl = thumbnailUrl;
        this.projectDate = projectDate;
        this.showOnHome = showOnHome;
        this.showOnCollaboration = showOnCollaboration;
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

    /**
     * slug 변경 — 공개 URL이 바뀐다. 기존에 공유된 링크는 404가 되므로 update()와 분리해 둔다.
     * 중복 검사는 호출부(AdminProjectService)가 한다.
     */
    public void changeSlug(String slug) {
        this.slug = slug;
    }

    /** admin 수정 — slug는 changeSlug()로 따로 바꾼다. */
    public void update(String title, ProjectType type, String clientName, String summary,
                       String description, String resultMetric, String thumbnailUrl,
                       LocalDate projectDate, boolean showOnHome, boolean showOnCollaboration,
                       int displayOrder, boolean published) {
        this.title = title;
        this.type = type;
        this.clientName = clientName;
        this.summary = summary;
        this.description = description;
        this.resultMetric = resultMetric;
        this.thumbnailUrl = thumbnailUrl;
        this.projectDate = projectDate;
        this.showOnHome = showOnHome;
        this.showOnCollaboration = showOnCollaboration;
        this.displayOrder = displayOrder;
        this.published = published;
    }

    public void replaceImages(List<ProjectImage> newImages) {
        images.clear();
        newImages.forEach(this::addImage);
    }

    public void replaceParticipants(List<ProjectArtisan> newParticipants) {
        participants.clear();
        newParticipants.forEach(this::addParticipant);
    }
}
