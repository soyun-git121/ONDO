package kr.ondo.domain.artisan.service;

import kr.ondo.domain.artisan.dto.AdminArtisanListItem;
import kr.ondo.domain.artisan.dto.AdminArtisanResponse;
import kr.ondo.domain.artisan.dto.ArtisanCreateRequest;
import kr.ondo.domain.artisan.dto.ArtisanUpdateRequest;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.entity.ArtisanImage;
import kr.ondo.domain.artisan.exception.ArtisanErrorCode;
import kr.ondo.domain.artisan.repository.ArtisanRepository;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import kr.ondo.global.response.PageResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 관리자 보유자 CRUD. api.md §8.
 * 비공개 포함 조회, slug 중복 시 409, setter 대신 엔티티 변경 메서드 사용.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminArtisanService {

    private final ArtisanRepository artisanRepository;

    public PageResponse<AdminArtisanListItem> getList(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size <= 0 ? 20 : Math.min(size, 100),
                Sort.by(Sort.Direction.ASC, "displayOrder", "id"));
        return PageResponse.of(artisanRepository.findAll(pageable), AdminArtisanListItem::from);
    }

    public AdminArtisanResponse getOne(Long id) {
        return AdminArtisanResponse.from(findOrThrow(id));
    }

    @Transactional
    public AdminArtisanResponse create(ArtisanCreateRequest req) {
        if (artisanRepository.existsBySlug(req.slug())) {
            throw new BusinessException(GlobalErrorCode.DUPLICATE_SLUG);
        }
        Artisan artisan = Artisan.builder()
                .slug(req.slug()).name(req.name()).title(req.title()).designation(req.designation())
                .shortIntro(req.shortIntro()).story(req.story()).profileImageUrl(req.profileImageUrl())
                .coverImageUrl(req.coverImageUrl()).videoUrl(req.videoUrl()).snsLinks(req.snsLinks())
                .displayOrder(req.displayOrder()).published(req.published())
                .build();
        applyImages(artisan, toImages(req.images()));
        return AdminArtisanResponse.from(artisanRepository.save(artisan));
    }

    @Transactional
    public AdminArtisanResponse update(Long id, ArtisanUpdateRequest req) {
        Artisan artisan = findOrThrow(id);
        artisan.update(req.name(), req.title(), req.designation(), req.shortIntro(), req.story(),
                req.profileImageUrl(), req.coverImageUrl(), req.videoUrl(), req.snsLinks(),
                req.displayOrder(), req.published());
        artisan.replaceImages(toImages(req.images()));
        return AdminArtisanResponse.from(artisan);
    }

    @Transactional
    public void delete(Long id) {
        Artisan artisan = findOrThrow(id);
        artisanRepository.delete(artisan);
    }

    private Artisan findOrThrow(Long id) {
        return artisanRepository.findWithImagesById(id)
                .orElseThrow(() -> new BusinessException(ArtisanErrorCode.ARTISAN_NOT_FOUND));
    }

    private List<ArtisanImage> toImages(List<ArtisanCreateRequest.ImageRequest> reqs) {
        if (reqs == null) {
            return List.of();
        }
        return reqs.stream()
                .map(r -> ArtisanImage.builder()
                        .imageUrl(r.imageUrl()).caption(r.caption()).sortOrder(r.sortOrder()).build())
                .toList();
    }

    private void applyImages(Artisan artisan, List<ArtisanImage> images) {
        images.forEach(artisan::addImage);
    }
}
