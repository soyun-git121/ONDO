package kr.ondo.global.controller;

import java.time.LocalDateTime;
import java.util.Map;
import kr.ondo.global.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 셋업 검증용 헬스체크. GET /api/health
 */
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok(Map.of(
                "status", "UP",
                "service", "ondo-backend",
                "time", LocalDateTime.now().toString()
        ));
    }
}
