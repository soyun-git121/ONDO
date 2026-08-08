package kr.ondo.domain.admin.config;

import kr.ondo.domain.admin.entity.AdminUser;
import kr.ondo.domain.admin.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 관리자 계정 부트스트랩. 비밀번호는 설정값(`ondo.admin.bootstrap-password`)이 권위를 갖는다 —
 * 별도의 비밀번호 변경 화면 없이, 설정된 값이 곧 로그인 비밀번호다.
 * <p>실제 값은 저장소에 두지 않는다: 로컬은 gitignore된 backend/.env, 운영은 ADMIN_PASSWORD 환경변수.
 * 값이 비어 있으면(운영 기본값) 아무것도 하지 않는다.
 * <p>부팅 때마다 계정이 없으면 만들고, 있으면 비밀번호가 설정값과 다를 때만 맞춘다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements ApplicationRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ondo.admin.bootstrap-username:admin}")
    private String username;

    @Value("${ondo.admin.bootstrap-password:}")
    private String password;

    @Value("${ondo.admin.bootstrap-name:온도 관리자}")
    private String name;

    @Override
    public void run(ApplicationArguments args) {
        if (password.isBlank()) {
            log.info("ondo.admin.bootstrap-password 미설정 — 관리자 계정 부트스트랩을 건너뜁니다.");
            return;
        }

        adminUserRepository.findByUsername(username).ifPresentOrElse(
                existing -> {
                    // 설정된 비밀번호와 다르면 맞춘다(설정값이 권위). ApplicationRunner는 트랜잭션
                    // 밖이라 더티 체킹이 안 되므로 save로 명시 반영.
                    if (!passwordEncoder.matches(password, existing.getPassword())) {
                        existing.changePassword(passwordEncoder.encode(password));
                        adminUserRepository.save(existing);
                        log.info("관리자 비밀번호를 설정값으로 갱신: {}", username);
                    }
                },
                () -> {
                    adminUserRepository.save(
                            AdminUser.create(username, passwordEncoder.encode(password), name, "ADMIN"));
                    log.info("관리자 계정 생성: {}", username);
                });
    }
}
