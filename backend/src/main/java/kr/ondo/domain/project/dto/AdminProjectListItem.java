package kr.ondo.domain.project.dto;

import java.time.LocalDate;
import kr.ondo.domain.project.entity.Project;
import kr.ondo.domain.project.entity.ProjectType;

/** 관리자 실적 목록 항목 (비공개 포함). */
public record AdminProjectListItem(
        Long id,
        String slug,
        String title,
        ProjectType type,
        String clientName,
        LocalDate projectDate,
        boolean showOnHome,
        boolean showOnCollaboration,
        boolean published
) {
    public static AdminProjectListItem from(Project p) {
        return new AdminProjectListItem(
                p.getId(), p.getSlug(), p.getTitle(), p.getType(), p.getClientName(),
                p.getProjectDate(), p.isShowOnHome(), p.isShowOnCollaboration(), p.isPublished()
        );
    }
}
