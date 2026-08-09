package kr.ondo.global.controller;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import kr.ondo.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 셋업 검증 + keep-warm용 헬스체크. GET /api/health
 *
 * <p>DB를 실제로 한 번 조회한다. 단순히 200만 돌려주면 Render는 깨워도 Aiven MySQL은
 * 접속이 없는 상태 그대로라 무료 플랜의 자동 전원 차단을 막지 못한다
 * (.github/workflows/keep-warm.yml이 이 엔드포인트를 주기적으로 호출한다).
 *
 * <p>DB가 죽어도 200 + db=DOWN으로 응답한다 — Render 헬스체크 경로로 쓰일 수 있어
 * 5xx를 내면 배포가 실패로 처리되거나 컨테이너가 재시작될 수 있다. 대신 db 필드를 보고
 * 워크플로가 실패하도록 해 알림은 받는다.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/api/health")
    public ApiResponse<Map<String, Object>> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "UP");
        body.put("service", "ondo-backend");
        body.put("db", probeDb());
        body.put("time", LocalDateTime.now().toString());
        return ApiResponse.ok(body);
    }

    private String probeDb() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return "UP";
        } catch (Exception e) {
            log.warn("헬스체크 DB 조회 실패: {}", e.getMessage());
            return "DOWN";
        }
    }
}
