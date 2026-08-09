package kr.ondo.domain.project;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.repository.ArtisanRepository;
import kr.ondo.domain.project.entity.Project;
import kr.ondo.domain.project.entity.ProjectArtisan;
import kr.ondo.domain.project.entity.ProjectImage;
import kr.ondo.domain.project.entity.ProjectType;
import kr.ondo.domain.project.repository.ProjectRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/**
 * 협업 실적 공개 API. api.md §6.
 * 실적은 시드에 없다(예시 데이터를 두면 실제 실적으로 오인된다) — 테스트가 직접 만든다.
 * 보유자(윤종국)는 data.sql 시드를 그대로 쓴다.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ProjectApiTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    ArtisanRepository artisanRepository;

    /**
     * 노출 위치가 다른 3건. 홈·협업문의를 각각 따로 켤 수 있다는 게 이 도메인의 핵심 규칙이라
     * 조합이 겹치지 않게 깔아 둔다.
     */
    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        Artisan artisan = artisanRepository.findBySlugAndPublishedTrue("yoon-jongguk").orElseThrow();

        Project both = save("both", "홈·협업문의 모두", ProjectType.FUNDING, true, true, true);
        both.addImage(ProjectImage.builder().imageUrl("/img/1.png").caption("대표").sortOrder(0).build());
        both.addParticipant(ProjectArtisan.of(artisan, "전통 북 제작"));
        projectRepository.save(both);

        projectRepository.save(save("home", "홈만", ProjectType.COLLAB, true, false, true));
        projectRepository.save(save("collab", "협업문의만", ProjectType.COLLAB, false, true, true));
        // 비공개 — 어떤 목록에도 나오면 안 된다.
        projectRepository.save(save("hidden", "비공개", ProjectType.COLLAB, true, true, false));
    }

    /** 다른 테스트(보유자 랜딩·홈)가 여기서 만든 실적을 보지 않도록 반드시 되돌린다. */
    @AfterEach
    void tearDown() {
        projectRepository.deleteAll();
    }

    private Project save(String slug, String title, ProjectType type,
                         boolean home, boolean collab, boolean published) {
        return Project.builder()
                .slug(slug).title(title).type(type)
                .resultMetric("성과 " + slug)
                .projectDate(LocalDate.of(2026, 3, 15))
                .showOnHome(home).showOnCollaboration(collab)
                .displayOrder(0).published(published)
                .build();
    }

    @Test
    @DisplayName("GET /api/projects — 공개분 전체, 참여 보유자 포함")
    void listProjects() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                // 비공개 1건은 빠지고 공개 3건만.
                .andExpect(jsonPath("$.data.totalElements").value(3))
                // projectDate가 같아 목록 순서는 정해지지 않는다 — 인덱스 대신 slug로 집어 검증한다.
                .andExpect(jsonPath("$.data.content[?(@.slug == 'both')].artisans[0].name")
                        .value("윤종국"));
    }

    @Test
    @DisplayName("GET /api/projects?placement= — 홈·협업문의를 따로 고른다")
    void placementFilter() throws Exception {
        mockMvc.perform(get("/api/projects").param("placement", "home"))
                .andExpect(jsonPath("$.data.totalElements").value(2));
        mockMvc.perform(get("/api/projects").param("placement", "collaboration"))
                .andExpect(jsonPath("$.data.totalElements").value(2));
        // 'collab'은 협업문의에만 켰으므로 홈 목록에는 없어야 한다.
        mockMvc.perform(get("/api/projects").param("placement", "home"))
                .andExpect(jsonPath("$.data.content[?(@.slug == 'collab')]").isEmpty());
    }

    @Test
    @DisplayName("GET /api/projects?placement= — 지원하지 않는 값은 400")
    void placementInvalid() throws Exception {
        mockMvc.perform(get("/api/projects").param("placement", "nope"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_INPUT"));
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
        mockMvc.perform(get("/api/projects/both"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.resultMetric").value("성과 both"))
                .andExpect(jsonPath("$.data.artisans[0].role").value("전통 북 제작"))
                .andExpect(jsonPath("$.data.images.length()").value(1));
    }

    @Test
    @DisplayName("GET /api/projects/{slug} — 비공개는 404")
    void hiddenNotFound() throws Exception {
        mockMvc.perform(get("/api/projects/hidden"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error.code").value("PROJECT_NOT_FOUND"));
    }

    @Test
    @DisplayName("GET /api/projects/{slug} — 없으면 404")
    void notFound() throws Exception {
        mockMvc.perform(get("/api/projects/no-such"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error.code").value("PROJECT_NOT_FOUND"));
    }
}
