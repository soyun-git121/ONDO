package kr.ondo.domain.admin;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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

/**
 * 관리자 보유자 CRUD. 하드코딩 없이 admin API만으로 보유자 추가 가능함을 검증. api.md §8.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminArtisanCrudTest {

    @Autowired
    MockMvc mockMvc;

    private String token() throws Exception {
        return AdminAuthTest.login(mockMvc, "admin", "admin1234");
    }

    @Test
    @DisplayName("생성(비공개) → 공개 목록엔 안 뜨고, 공개 전환 후 뜬다")
    void createThenPublish() throws Exception {
        String token = token();
        String create = """
                { "slug":"park-jonggun", "name":"박종군", "title":"장도장", "designation":"HOLDER",
                  "shortIntro":"칼에 담긴 전통", "displayOrder":1, "published":false,
                  "images":[{"imageUrl":"/uploads/x.webp","caption":"공방","sortOrder":0}] }
                """;
        String body = mockMvc.perform(post("/api/admin/artisans")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(create))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.images.length()").value(1))
                .andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(body, "$.data.id");

        // 비공개라 공개 API 목록엔 없음 (윤종국 1명만)
        mockMvc.perform(get("/api/artisans"))
                .andExpect(jsonPath("$.data.totalElements").value(1));

        // 공개 전환
        String update = """
                { "name":"박종군", "title":"장도장", "designation":"HOLDER",
                  "shortIntro":"칼에 담긴 전통", "displayOrder":1, "published":true, "images":[] }
                """;
        mockMvc.perform(put("/api/admin/artisans/{id}", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(update))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.published").value(true))
                .andExpect(jsonPath("$.data.images.length()").value(0));

        // 이제 공개 목록에 2명
        mockMvc.perform(get("/api/artisans"))
                .andExpect(jsonPath("$.data.totalElements").value(2));

        // 삭제
        mockMvc.perform(delete("/api/admin/artisans/{id}", id)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/artisans"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    @DisplayName("slug 중복 생성 → 409 DUPLICATE_SLUG")
    void duplicateSlug() throws Exception {
        String token = token();
        String create = """
                { "slug":"yoon-jongguk", "name":"중복", "title":"악기장", "designation":"HOLDER",
                  "shortIntro":"중복 slug", "displayOrder":9, "published":false, "images":[] }
                """;
        mockMvc.perform(post("/api/admin/artisans")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(create))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("DUPLICATE_SLUG"));
    }
}
