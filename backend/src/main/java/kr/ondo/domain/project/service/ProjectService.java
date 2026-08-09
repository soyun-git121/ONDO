package kr.ondo.domain.project.service;

import kr.ondo.domain.project.dto.ProjectDetailResponse;
import kr.ondo.domain.project.dto.ProjectSummaryResponse;
import kr.ondo.domain.project.entity.ProjectPlacement;
import kr.ondo.domain.project.entity.ProjectType;
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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private static final int MAX_SIZE = 50;
    private static final int DEFAULT_SIZE = 12;

    private final ProjectRepository projectRepository;

    public PageResponse<ProjectSummaryResponse> getProjects(int page, int size, String type,
                                                            String artisanSlug, String placement) {
        ProjectPlacement target = parsePlacement(placement);
        var result = projectRepository.search(
                parseType(type),
                (artisanSlug == null || artisanSlug.isBlank()) ? null : artisanSlug,
                target == ProjectPlacement.HOME ? Boolean.TRUE : null,
                target == ProjectPlacement.COLLABORATION ? Boolean.TRUE : null,
                PageRequest.of(Math.max(page, 0), clampSize(size), sortFor(target))
        );
        return PageResponse.of(result, ProjectSummaryResponse::from);
    }

    /**
     * 전체 목록은 최신순이지만, 홈·협업문의처럼 자리가 정해진 곳은 admin이 정한 순서를 먼저 따른다
     * (displayOrder '숫자가 작을수록 앞'). 같은 순서면 최신 실적이 앞에 온다.
     */
    private Sort sortFor(ProjectPlacement placement) {
        return placement == null
                ? Sort.by(Sort.Direction.DESC, "projectDate")
                : Sort.by(Sort.Order.asc("displayOrder"), Sort.Order.desc("projectDate"));
    }

    public ProjectDetailResponse getProject(String slug) {
        return projectRepository.findBySlugAndPublishedTrue(slug)
                .map(ProjectDetailResponse::from)
                .orElseThrow(() -> new BusinessException(ProjectErrorCode.PROJECT_NOT_FOUND));
    }

    private int clampSize(int size) {
        return size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
    }

    private ProjectPlacement parsePlacement(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return ProjectPlacement.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "지원하지 않는 placement: " + raw);
        }
    }

    private ProjectType parseType(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return ProjectType.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "지원하지 않는 type: " + raw);
        }
    }
}
