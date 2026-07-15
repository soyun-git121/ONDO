package kr.ondo.domain.project;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/** 협업 실적 공개 API. dev H2 + data.sql(tumblbug-buk, 윤종국 참여). api.md §6. */
@SpringBootTest
@AutoConfigureMockMvc
class ProjectApiTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/projects — 목록에 참여 보유자 포함")
    void listProjects() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.content[0].slug").value("tumblbug-buk"))
                .andExpect(jsonPath("$.data.content[0].artisans[0].name").value("윤종국"));
    }

    @Test
    @DisplayName("GET /api/projects?artisan=&type= — 필터")
    void filters() throws Exception {
        mockMvc.perform(get("/api/projects").param("artisan", "yoon-jongguk"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
        mockMvc.perform(get("/api/projects").param("type", "FUNDING"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
        mockMvc.perform(get("/api/projects").param("type", "LECTURE"))
                .andExpect(jsonPath("$.data.totalElements").value(0));
    }

    @Test
    @DisplayName("GET /api/projects/{slug} — 상세 + 참여 보유자(role)")
    void getDetail() throws Exception {
        mockMvc.perform(get("/api/projects/tumblbug-buk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.resultMetric").value("펀딩률 1,200% 달성"))
                .andExpect(jsonPath("$.data.artisans[0].role").value("전통 북 제작"))
                .andExpect(jsonPath("$.data.images.length()").value(1));
    }

    @Test
    @DisplayName("GET /api/projects/{slug} — 없으면 404")
    void notFound() throws Exception {
        mockMvc.perform(get("/api/projects/no-such"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error.code").value("PROJECT_NOT_FOUND"));
    }
}
