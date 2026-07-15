package kr.ondo.domain.artisan;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/**
 * 보유자 공개 API 통합 테스트. dev 프로필 H2 + data.sql 시드(윤종국) 기준.
 * api.md §2 계약 검증.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ArtisanApiTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/artisans — 공개 보유자 목록(페이지네이션) 반환")
    void listArtisans() throws Exception {
        mockMvc.perform(get("/api/artisans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].slug").value("yoon-jongguk"))
                .andExpect(jsonPath("$.data.content[0].name").value("윤종국"))
                .andExpect(jsonPath("$.data.content[0].designation").value("HOLDER"))
                .andExpect(jsonPath("$.data.hasNext").value(false));
    }

    @Test
    @DisplayName("GET /api/artisans/{slug} — 상세 + 갤러리 반환, products/projects는 빈 배열")
    void getArtisanDetail() throws Exception {
        mockMvc.perform(get("/api/artisans/yoon-jongguk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("윤종국"))
                .andExpect(jsonPath("$.data.snsLinks.instagram").exists())
                .andExpect(jsonPath("$.data.images.length()").value(2))
                .andExpect(jsonPath("$.data.images[0].caption").value("공방 전경"))
                .andExpect(jsonPath("$.data.products").isArray())
                .andExpect(jsonPath("$.data.products.length()").value(2))
                .andExpect(jsonPath("$.data.projects[0].slug").value("tumblbug-buk"));
    }

    @Test
    @DisplayName("GET /api/artisans/{slug} — 없는 slug는 404 ARTISAN_NOT_FOUND")
    void getArtisanNotFound() throws Exception {
        mockMvc.perform(get("/api/artisans/no-such-artisan"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("ARTISAN_NOT_FOUND"));
    }
}
