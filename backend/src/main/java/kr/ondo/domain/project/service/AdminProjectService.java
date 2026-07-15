package kr.ondo.domain.project.service;

import java.util.List;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.exception.ArtisanErrorCode;
import kr.ondo.domain.artisan.repository.ArtisanRepository;
import kr.ondo.domain.project.dto.AdminProjectListItem;
import kr.ondo.domain.project.dto.AdminProjectResponse;
import kr.ondo.domain.project.dto.ProjectCreateRequest;
import kr.ondo.domain.project.dto.ProjectUpdateRequest;
import kr.ondo.domain.project.entity.Project;
import kr.ondo.domain.project.entity.ProjectArtisan;
import kr.ondo.domain.project.entity.ProjectImage;
import kr.ondo.domain.project.exception.ProjectErrorCode;
import kr.ondo.domain.project.repository.ProjectRepository;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 관리자 실적 CRUD (참여 보유자 N:M). api.md §8. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminProjectService {

    private final ProjectRepository projectRepository;
    private final ArtisanRepository artisanRepository;

    public PageResponse<AdminProjectListItem> getList(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size <= 0 ? 20 : Math.min(size, 100),
                Sort.by(Sort.Direction.DESC, "projectDate"));
        return PageResponse.of(projectRepository.findAll(pageable), AdminProjectListItem::from);
    }

    public AdminProjectResponse getOne(Long id) {
        return AdminProjectResponse.from(findOrThrow(id));
    }

    @Transactional
    public AdminProjectResponse create(ProjectCreateRequest req) {
        if (projectRepository.existsBySlug(req.slug())) {
            throw new BusinessException(GlobalErrorCode.DUPLICATE_SLUG);
        }
        Project project = Project.builder()
                .slug(req.slug()).title(req.title()).type(req.type()).clientName(req.clientName())
                .summary(req.summary()).description(req.description()).resultMetric(req.resultMetric())
                .thumbnailUrl(req.thumbnailUrl()).projectDate(req.projectDate())
                .featured(req.isFeatured()).displayOrder(req.displayOrder()).published(req.published())
                .build();
        toImages(req.images()).forEach(project::addImage);
        toParticipants(req.artisans()).forEach(project::addParticipant);
        return AdminProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public AdminProjectResponse update(Long id, ProjectUpdateRequest req) {
        Project project = findOrThrow(id);
        project.update(req.title(), req.type(), req.clientName(), req.summary(), req.description(),
                req.resultMetric(), req.thumbnailUrl(), req.projectDate(), req.isFeatured(),
                req.displayOrder(), req.published());
        project.replaceImages(toImages(req.images()));
        project.replaceParticipants(toParticipants(req.artisans()));
        return AdminProjectResponse.from(project);
    }

    @Transactional
    public void delete(Long id) {
        projectRepository.delete(findOrThrow(id));
    }

    private Project findOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ProjectErrorCode.PROJECT_NOT_FOUND));
    }

    private List<ProjectImage> toImages(List<ProjectCreateRequest.ImageRequest> reqs) {
        if (reqs == null) {
            return List.of();
        }
        return reqs.stream()
                .map(r -> ProjectImage.builder()
                        .imageUrl(r.imageUrl()).caption(r.caption()).sortOrder(r.sortOrder()).build())
                .toList();
    }

    private List<ProjectArtisan> toParticipants(List<ProjectCreateRequest.ArtisanRequest> reqs) {
        if (reqs == null) {
            return List.of();
        }
        return reqs.stream()
                .map(r -> {
                    Artisan artisan = artisanRepository.findById(r.artisanId())
                            .orElseThrow(() -> new BusinessException(ArtisanErrorCode.ARTISAN_NOT_FOUND));
                    return ProjectArtisan.of(artisan, r.role());
                })
                .toList();
    }
}
