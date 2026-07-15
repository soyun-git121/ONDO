package kr.ondo.domain.admin;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/** 관리자 콘텐츠 CRUD — 상품·뉴스·실적. api.md §8. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminContentCrudTest {

    @Autowired
    MockMvc mockMvc;

    private String token() throws Exception {
        return AdminAuthTest.login(mockMvc, "admin", "admin1234");
    }

    @Test
    @DisplayName("상품 생성 → 상태 PATCH(품절) → 공개 상세에 반영")
    void productCreateAndStatus() throws Exception {
        String token = token();
        String create = """
                { "artisanId":1, "slug":"buk-goods", "name":"북 굿즈", "category":"GOODS",
                  "price":12000, "stockQuantity":5, "status":"ON_SALE",
                  "images":[{"imageUrl":"/uploads/a.webp","caption":null,"sortOrder":0}] }
                """;
        String body = mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(create))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.artisanName").value("윤종국"))
                .andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(body, "$.data.id");

        mockMvc.perform(patch("/api/admin/products/{id}/status", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"SOLD_OUT\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SOLD_OUT"));

        mockMvc.perform(get("/api/products/buk-goods"))
                .andExpect(jsonPath("$.data.status").value("SOLD_OUT"));
    }

    @Test
    @DisplayName("상품 생성 — slug 중복 409")
    void productDuplicateSlug() throws Exception {
        String token = token();
        String create = """
                { "artisanId":1, "slug":"mini-buk", "name":"중복", "category":"GOODS",
                  "price":1000, "stockQuantity":1, "status":"ON_SALE", "images":[] }
                """;
        mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(create))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("DUPLICATE_SLUG"));
    }

    @Test
    @DisplayName("뉴스 생성(비공개) → publish → 공개 목록 반영")
    void newsCreateAndPublish() throws Exception {
        String token = token();
        String create = """
                { "title":"새 소식", "type":"ORIGINAL", "content":"## 본문", "category":"ONDO_NEWS",
                  "published":false, "publishedAt":"2026-08-01T09:00:00" }
                """;
        String body = mockMvc.perform(post("/api/admin/news")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(create))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(body, "$.data.id");

        // 공개 목록엔 기존 2건만
        mockMvc.perform(get("/api/news"))
                .andExpect(jsonPath("$.data.totalElements").value(2));

        mockMvc.perform(patch("/api/admin/news/{id}/publish", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"published\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.published").value(true));

        mockMvc.perform(get("/api/news"))
                .andExpect(jsonPath("$.data.totalElements").value(3));
    }

    @Test
    @DisplayName("실적 생성 — 참여 보유자(role) 포함")
    void projectCreateWithParticipant() throws Exception {
        String token = token();
        String create = """
                { "slug":"gift-set-500", "title":"명절 선물 500세트", "type":"B2B_GIFT",
                  "clientName":"A사", "resultMetric":"완판", "projectDate":"2026-02-01",
                  "isFeatured":true, "published":true,
                  "images":[], "artisans":[{"artisanId":1,"role":"제작"}] }
                """;
        String body = mockMvc.perform(post("/api/admin/projects")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(create))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.artisans[0].role").value("제작"))
                .andReturn().getResponse().getContentAsString();
        String slug = JsonPath.read(body, "$.data.slug");

        mockMvc.perform(get("/api/projects/{slug}", slug))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.artisans[0].name").value("윤종국"));
    }
}
