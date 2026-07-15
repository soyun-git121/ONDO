package kr.ondo.domain.admin.config;

import kr.ondo.domain.admin.entity.AdminUser;
import kr.ondo.domain.admin.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * dev 전용 관리자 계정 부트스트랩 (admin / admin1234).
 * 관리자 계정은 콘텐츠 시드(data.sql)와 성격이 달라 인코더로 안전하게 생성한다.
 * 운영(prod)에서는 실행되지 않으며 별도 방법으로 계정을 등록한다.
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
public class AdminAccountInitializer implements ApplicationRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!adminUserRepository.existsByUsername("admin")) {
            adminUserRepository.save(AdminUser.create(
                    "admin", passwordEncoder.encode("admin1234"), "온도 관리자", "ADMIN"));
        }
    }
}
