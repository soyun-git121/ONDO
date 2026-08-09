package kr.ondo.domain.home;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/** 홈 통합 데이터. dev H2 + data.sql 시드 기준. api.md §1. */
@SpringBootTest
@AutoConfigureMockMvc
class HomeApiTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/home — 보유자·상품·featured 실적·최신 뉴스 1콜 집계")
    void getHome() throws Exception {
        mockMvc.perform(get("/api/home"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.featuredArtisans[0].slug").value("yoon-jongguk"))
                .andExpect(jsonPath("$.data.featuredProducts[0].artisanName").value("윤종국"))
                // 실적은 시드에 없다 — 홈 노출분은 admin이 고른다. 필드 계약만 확인.
                // 필터 동작 자체는 ProjectApiTest.placementFilter가 검증한다.
                .andExpect(jsonPath("$.data.featuredProjects").isArray())
                .andExpect(jsonPath("$.data.latestNews[0].id").value(1));
    }
}
