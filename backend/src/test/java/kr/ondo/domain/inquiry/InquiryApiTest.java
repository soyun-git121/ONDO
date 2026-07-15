package kr.ondo.domain.inquiry;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/** 협업문의 접수 API. api.md §7. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class InquiryApiTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("POST /api/inquiries — 접수 201, 상태 NEW")
    void createInquiry() throws Exception {
        String json = """
                {
                  "type": "B2B_GIFT", "companyName": "주식회사 온기", "contactName": "김담당",
                  "email": "kim@ongi.co.kr", "phone": "02-123-4567",
                  "message": "명절 선물 패키지 300세트 문의드립니다."
                }
                """;
        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.status").value("NEW"));
    }

    @Test
    @DisplayName("POST /api/inquiries — 필수/이메일 검증 실패 시 400")
    void validation() throws Exception {
        String json = """
                { "type": "COLLAB", "contactName": "", "email": "not-an-email", "message": "" }
                """;
        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_INPUT"));
    }
}
