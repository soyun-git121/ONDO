package kr.ondo.domain.project.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.project.dto.AdminProjectListItem;
import kr.ondo.domain.project.dto.AdminProjectResponse;
import kr.ondo.domain.project.dto.ProjectCreateRequest;
import kr.ondo.domain.project.dto.ProjectUpdateRequest;
import kr.ondo.domain.project.service.AdminProjectService;
import kr.ondo.global.response.ApiResponse;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** 관리자 실적 CRUD (JWT). api.md §8. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final AdminProjectService adminProjectService;

    @GetMapping
    public ApiResponse<PageResponse<AdminProjectListItem>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(adminProjectService.getList(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminProjectResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(adminProjectService.getOne(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminProjectResponse> create(@Valid @RequestBody ProjectCreateRequest request) {
        return ApiResponse.ok(adminProjectService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminProjectResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody ProjectUpdateRequest request) {
        return ApiResponse.ok(adminProjectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminProjectService.delete(id);
        return ApiResponse.ok();
    }
}
