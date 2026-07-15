package kr.ondo.domain.project.controller;

import kr.ondo.domain.project.dto.ProjectDetailResponse;
import kr.ondo.domain.project.dto.ProjectSummaryResponse;
import kr.ondo.domain.project.service.ProjectService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 협업 실적 공개 API. api.md §6. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ApiResponse<PageResponse<ProjectSummaryResponse>> getProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String artisan,
            @RequestParam(required = false) Boolean featured
    ) {
        return ApiResponse.ok(projectService.getProjects(page, size, type, artisan, featured));
    }

    @GetMapping("/{slug}")
    public ApiResponse<ProjectDetailResponse> getProject(@PathVariable String slug) {
        return ApiResponse.ok(projectService.getProject(slug));
    }
}
