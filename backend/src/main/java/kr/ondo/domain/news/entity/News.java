package kr.ondo.domain.news.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 뉴스. db_schema.md §7 / api.md §5.
 * ORIGINAL → content(마크다운) 상세 / CURATED → external_url 외부 링크.
 * artisan은 '보유자 소식'일 때 연결(nullable) → 보유자 랜딩에 노출 가능.
 */
@Entity
@Getter
@Table(name = "news", indexes = {
        @Index(name = "idx_news_list", columnList = "is_published, category, published_at"),
        @Index(name = "idx_news_artisan", columnList = "artisan_id")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class News extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NewsType type;

    @Column(columnDefinition = "TEXT")
    private String content; // ORIGINAL일 때 (마크다운)

    @Column(name = "external_url", length = 500)
    private String externalUrl; // CURATED일 때

    @Column(name = "source_name", length = 100)
    private String sourceName; // CURATED 출처

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NewsCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id")
    private Artisan artisan; // nullable

    @Column(name = "is_published", nullable = false)
    private boolean published;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Builder
    private News(String title, String thumbnailUrl, NewsType type, String content, String externalUrl,
                 String sourceName, NewsCategory category, Artisan artisan, boolean published,
                 LocalDateTime publishedAt) {
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.type = type;
        this.content = content;
        this.externalUrl = externalUrl;
        this.sourceName = sourceName;
        this.category = category;
        this.artisan = artisan;
        this.published = published;
        this.publishedAt = publishedAt;
    }

    /** admin 수정 (published는 PATCH /publish로 별도 관리). */
    public void update(String title, String thumbnailUrl, NewsType type, String content,
                       String externalUrl, String sourceName, NewsCategory category,
                       Artisan artisan, LocalDateTime publishedAt) {
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.type = type;
        this.content = content;
        this.externalUrl = externalUrl;
        this.sourceName = sourceName;
        this.category = category;
        this.artisan = artisan;
        this.publishedAt = publishedAt;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }
}
