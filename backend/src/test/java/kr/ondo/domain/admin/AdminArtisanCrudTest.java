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
                { "slug":"park-jonggun", "name":"박종군", "title":"장도장", "designation":"HOLDER",
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

    @Test
    @DisplayName("slug 수정 → 새 주소로 열리고 옛 주소는 404")
    void changeSlug() throws Exception {
        String token = token();
        int id = createArtisan(token, "old-slug");

        mockMvc.perform(get("/api/artisans/{slug}", "old-slug"))
                .andExpect(status().isOk());

        mockMvc.perform(put("/api/admin/artisans/{id}", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(updateBody("new-slug")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("new-slug"));

        mockMvc.perform(get("/api/artisans/{slug}", "new-slug"))
                .andExpect(status().isOk());
        // 바뀐 주소의 대가 — 기존에 공유된 링크는 열리지 않는다(화면에서 경고하는 내용).
        mockMvc.perform(get("/api/artisans/{slug}", "old-slug"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("slug를 그대로 두고 저장하면 자기 자신과 충돌하지 않는다")
    void keepSlugOnUpdate() throws Exception {
        String token = token();
        int id = createArtisan(token, "keep-me");

        // 중복 검사가 자기 자신을 제외하지 않으면 여기서 409가 난다 — 저장 대부분이 이 경로다.
        mockMvc.perform(put("/api/admin/artisans/{id}", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(updateBody("keep-me")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("keep-me"));
    }

    @Test
    @DisplayName("수정으로 남의 slug를 가져가면 409 DUPLICATE_SLUG")
    void duplicateSlugOnUpdate() throws Exception {
        String token = token();
        int id = createArtisan(token, "mine");

        // yoon-jongguk은 시드에 이미 있는 보유자다.
        mockMvc.perform(put("/api/admin/artisans/{id}", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(updateBody("yoon-jongguk")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("DUPLICATE_SLUG"));
    }

    @Test
    @DisplayName("수정 시에도 한글·공백 slug는 400 — 열어준 경로로 다시 깨진 값이 들어오지 않게")
    void invalidSlugOnUpdate() throws Exception {
        String token = token();
        int id = createArtisan(token, "valid-slug");

        mockMvc.perform(put("/api/admin/artisans/{id}", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(updateBody("불국사 한정판  ")))
                .andExpect(status().isBadRequest());
    }

    private int createArtisan(String token, String slug) throws Exception {
        String create = """
                { "slug":"%s", "name":"박종군", "title":"장도장", "designation":"HOLDER",
                  "shortIntro":"칼에 담긴 전통", "displayOrder":1, "published":true, "images":[] }
                """.formatted(slug);
        String body = mockMvc.perform(post("/api/admin/artisans")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(create))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.data.id");
    }

    private String updateBody(String slug) {
        return """
                { "slug":"%s", "name":"박종군", "title":"장도장", "designation":"HOLDER",
                  "shortIntro":"칼에 담긴 전통", "displayOrder":1, "published":true, "images":[] }
                """.formatted(slug);
    }
}
