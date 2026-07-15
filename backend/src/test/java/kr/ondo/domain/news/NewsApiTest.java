package kr.ondo.domain.news;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/** 뉴스 공개 API. dev H2 + data.sql(ORIGINAL id=1, CURATED id=2). api.md §5. */
@SpringBootTest
@AutoConfigureMockMvc
class NewsApiTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/news — 공개 뉴스 목록(publishedAt DESC)")
    void listNews() throws Exception {
        mockMvc.perform(get("/api/news"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements").value(2))
                .andExpect(jsonPath("$.data.content[0].id").value(1)); // 2026-07-01이 최신
    }

    @Test
    @DisplayName("GET /api/news?category — 분류 필터")
    void filterByCategory() throws Exception {
        mockMvc.perform(get("/api/news").param("category", "TRADITION"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.content[0].type").value("CURATED"));
    }

    @Test
    @DisplayName("GET /api/news/{id} — ORIGINAL 상세, 보유자 연결")
    void getOriginalDetail() throws Exception {
        mockMvc.perform(get("/api/news/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").exists())
                .andExpect(jsonPath("$.data.artisan.slug").value("yoon-jongguk"));
    }

    @Test
    @DisplayName("GET /api/news/{id} — CURATED는 상세 없음 404")
    void curatedHasNoDetail() throws Exception {
        mockMvc.perform(get("/api/news/2"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error.code").value("NEWS_NOT_FOUND"));
    }
}
