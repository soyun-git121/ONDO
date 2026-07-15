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

/** 관리자 주문·문의 관리. api.md §8. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminOrderInquiryTest {

    @Autowired
    MockMvc mockMvc;

    private String token() throws Exception {
        return AdminAuthTest.login(mockMvc, "admin", "admin1234");
    }

    private int createOrder() throws Exception {
        String json = """
                { "ordererName":"홍길동", "phone":"010-1234-5678", "zipcode":"03187",
                  "address":"서울", "items":[{"productId":1,"quantity":2}] }
                """;
        String body = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON).content(json))
                .andReturn().getResponse().getContentAsString();
        // admin 목록에서 id를 얻는다
        String token = token();
        String list = mockMvc.perform(get("/api/admin/orders").header("Authorization", "Bearer " + token))
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(list, "$.data.content[0].id");
    }

    @Test
    @DisplayName("주문 상태 PENDING→PAID 전이")
    void orderTransition() throws Exception {
        String token = token();
        int id = createOrder();
        mockMvc.perform(patch("/api/admin/orders/{id}/status", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"PAID\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PAID"))
                .andExpect(jsonPath("$.data.paidAt").exists());
    }

    @Test
    @DisplayName("허용되지 않는 전이 PENDING→SHIPPED → 400")
    void invalidTransition() throws Exception {
        String token = token();
        int id = createOrder();
        mockMvc.perform(patch("/api/admin/orders/{id}/status", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"SHIPPED\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_INPUT"));
    }

    @Test
    @DisplayName("주문 취소 → 재고 복원 (18 → 20)")
    void cancelRestoresStock() throws Exception {
        String token = token();
        int id = createOrder(); // mini-buk 재고 20 → 18

        mockMvc.perform(get("/api/products/mini-buk"))
                .andExpect(jsonPath("$.data.stockQuantity").value(18));

        mockMvc.perform(patch("/api/admin/orders/{id}/status", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"CANCELLED\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/products/mini-buk"))
                .andExpect(jsonPath("$.data.stockQuantity").value(20));
    }

    @Test
    @DisplayName("문의 접수 후 admin 조회 + 상태 PATCH")
    void inquiryManage() throws Exception {
        String token = token();
        String inquiry = """
                { "type":"B2B_GIFT", "companyName":"온기", "contactName":"김담당",
                  "email":"kim@ongi.co.kr", "message":"문의합니다." }
                """;
        String body = mockMvc.perform(post("/api/inquiries")
                        .contentType(MediaType.APPLICATION_JSON).content(inquiry))
                .andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(body, "$.data.id");

        mockMvc.perform(get("/api/admin/inquiries").header("Authorization", "Bearer " + token)
                        .param("status", "NEW"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].message").value("문의합니다."));

        mockMvc.perform(patch("/api/admin/inquiries/{id}", id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"IN_REVIEW\",\"adminNote\":\"7/20 미팅\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("IN_REVIEW"))
                .andExpect(jsonPath("$.data.adminNote").value("7/20 미팅"));
    }
}
