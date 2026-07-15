package kr.ondo.domain.artisan.entity;

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
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 보유자 갤러리 이미지 (공방·작업·작품). db_schema.md §2.
 * artisan 삭제 시 CASCADE (Artisan.images의 orphanRemoval + cascade).
 */
@Entity
@Getter
@Table(name = "artisan_image", indexes = {
        @Index(name = "idx_ai_artisan", columnList = "artisan_id, sort_order")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ArtisanImage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 200)
    private String caption;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Builder
    private ArtisanImage(String imageUrl, String caption, int sortOrder) {
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.sortOrder = sortOrder;
    }

    /** Artisan.addImage에서 호출 — 역방향 설정. */
    void assignArtisan(Artisan artisan) {
        this.artisan = artisan;
    }
}
