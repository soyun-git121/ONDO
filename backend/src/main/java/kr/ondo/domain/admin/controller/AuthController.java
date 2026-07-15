package kr.ondo.domain.admin.controller;

import jakarta.validation.Valid;
import kr.ondo.domain.admin.dto.LoginRequest;
import kr.ondo.domain.admin.dto.LoginResponse;
import kr.ondo.domain.admin.service.AuthService;
import kr.ondo.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 관리자 인증 API. api.md §8. (/api/admin/auth/** 은 인증 없이 허용) */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }
}
