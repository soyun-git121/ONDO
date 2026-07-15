package kr.ondo.domain.admin.service;

import kr.ondo.domain.admin.dto.LoginRequest;
import kr.ondo.domain.admin.dto.LoginResponse;
import kr.ondo.domain.admin.entity.AdminUser;
import kr.ondo.domain.admin.exception.AdminErrorCode;
import kr.ondo.domain.admin.repository.AdminUserRepository;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 관리자 로그인 → JWT 액세스 토큰 발급. api.md §8.
 * (Refresh 토큰 HttpOnly 쿠키·로그아웃은 후속 단계 — 현재는 액세스 토큰만.)
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        AdminUser admin = adminUserRepository.findByUsername(request.username())
                .orElseThrow(() -> new BusinessException(AdminErrorCode.LOGIN_FAILED));

        if (!passwordEncoder.matches(request.password(), admin.getPassword())) {
            throw new BusinessException(AdminErrorCode.LOGIN_FAILED);
        }

        admin.updateLastLogin();
        String token = jwtProvider.createAccessToken(admin.getUsername(), admin.getRole());
        return new LoginResponse(token, jwtProvider.getAccessValiditySeconds());
    }
}
