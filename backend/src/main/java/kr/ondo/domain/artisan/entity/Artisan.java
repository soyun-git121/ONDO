package kr.ondo.domain.artisan.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 보유자(Artisan) — 핵심 도메인(1급 객체). db_schema.md §1 / api.md §2.
 * 상품·콘텐츠는 보유자에 종속. setter 금지 — 의도가 드러나는 변경 메서드만 (claude.md).
 */
@Entity
@Getter
@Table(name = "artisan", indexes = {
        @Index(name = "idx_artisan_published", columnList = "is_published, display_order")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Artisan extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 50)
    private String title; // 종목 (악기장)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Designation designation;

    @Column(name = "short_intro", nullable = false, length = 200)
    private String shortIntro;

    @Column(columnDefinition = "TEXT")
    private String story; // 마크다운

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Convert(converter = SnsLinksConverter.class)
    @Column(name = "sns_links", columnDefinition = "TEXT")
    private Map<String, String> snsLinks;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "is_published", nullable = false)
    private boolean published;

    @OneToMany(mappedBy = "artisan", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ArtisanImage> images = new ArrayList<>();

    @Builder
    private Artisan(String slug, String name, String title, Designation designation, String shortIntro,
                    String story, String profileImageUrl, String coverImageUrl, String videoUrl,
                    Map<String, String> snsLinks, int displayOrder, boolean published) {
        this.slug = slug;
        this.name = name;
        this.title = title;
        this.designation = designation;
        this.shortIntro = shortIntro;
        this.story = story;
        this.profileImageUrl = profileImageUrl;
        this.coverImageUrl = coverImageUrl;
        this.videoUrl = videoUrl;
        this.snsLinks = snsLinks;
        this.displayOrder = displayOrder;
        this.published = published;
    }

    /** 갤러리 이미지 추가 — 양방향 연관관계 편의 메서드. */
    public void addImage(ArtisanImage image) {
        images.add(image);
        image.assignArtisan(this);
    }

    public void publish() {
        this.published = true;
    }

    public void unpublish() {
        this.published = false;
    }
}
