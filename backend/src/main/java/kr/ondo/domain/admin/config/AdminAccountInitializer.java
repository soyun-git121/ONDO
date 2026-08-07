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
 * 관리자 계정 부트스트랩. 비밀번호는 설정값(`ondo.admin.bootstrap-password`)으로만 주입한다.
 * — dev/local: application.yml이 개발용 기본값(admin1234)을 넣어준다.
 * — prod: 값이 비어 있으면 계정을 만들지 않는다. 배포 시 ADMIN_PASSWORD 환경변수로 1회 주입 후 제거.
 * 이미 같은 username이 있으면 아무것도 하지 않아 비밀번호를 덮어쓰지 않는다.
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
        if (adminUserRepository.existsByUsername(username)) {
            return;
        }
        adminUserRepository.save(AdminUser.create(username, passwordEncoder.encode(password), name, "ADMIN"));
        log.info("관리자 계정 생성: {}", username);
    }
}
