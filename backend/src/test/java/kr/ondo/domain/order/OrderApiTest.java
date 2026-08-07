package kr.ondo.domain.order;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

/**
 * 주문 공개 API 통합 테스트. dev H2 + data.sql(미니 장구 오브제 재고 10, 주문 제작 INQUIRY_ONLY).
 * @Transactional로 각 테스트 롤백 → 재고 상태 격리. api.md §4.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class OrderApiTest {

    @Autowired
    MockMvc mockMvc;

    private static final String ORDER_JSON = """
            {
              "ordererName": "홍길동", "phone": "010-1234-5678", "email": "a@b.com",
              "zipcode": "03187", "address": "서울시 종로구", "addressDetail": "101호",
              "memo": "문 앞", "items": [ { "productId": 3, "quantity": 2 } ]
            }
            """;

    @Test
    @DisplayName("POST /api/orders — PENDING 생성, 서버 재계산 금액(100000*2)")
    void createOrder() throws Exception {
        mockMvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(ORDER_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andExpect(jsonPath("$.data.totalAmount").value(200000))
                .andExpect(jsonPath("$.data.orderNumber").exists());
    }

    @Test
    @DisplayName("POST /api/orders — 재고 초과 시 409 OUT_OF_STOCK")
    void outOfStock() throws Exception {
        String json = """
                { "ordererName": "홍길동", "phone": "010-1234-5678", "zipcode": "03187",
                  "address": "서울", "items": [ { "productId": 3, "quantity": 999 } ] }
                """;
        mockMvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("OUT_OF_STOCK"));
    }

    @Test
    @DisplayName("POST /api/orders — INQUIRY_ONLY 상품은 구매 불가 400")
    void notPurchasable() throws Exception {
        String json = """
                { "ordererName": "홍길동", "phone": "010-1234-5678", "zipcode": "03187",
                  "address": "서울", "items": [ { "productId": 5, "quantity": 1 } ] }
                """;
        mockMvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_INPUT"));
    }

    @Test
    @DisplayName("POST 후 GET — orderNumber+phone 일치 조회, 불일치는 404")
    void lookupOrder() throws Exception {
        String body = mockMvc.perform(
                        post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(ORDER_JSON))
                .andReturn().getResponse().getContentAsString();
        String orderNumber = JsonPath.read(body, "$.data.orderNumber");

        mockMvc.perform(get("/api/orders/{n}", orderNumber).param("phone", "010-1234-5678"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.ordererName").value("홍길동"))
                .andExpect(jsonPath("$.data.items[0].productName").value("미니 장구 오브제"))
                .andExpect(jsonPath("$.data.items[0].artisanName").value("윤종국"));

        mockMvc.perform(get("/api/orders/{n}", orderNumber).param("phone", "010-0000-0000"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error.code").value("ORDER_NOT_FOUND"));
    }

    @Test
    @DisplayName("POST /api/orders — 필수값 누락 시 400 INVALID_INPUT")
    void validation() throws Exception {
        String json = """
                { "ordererName": "", "phone": "010-1234-5678", "zipcode": "03187",
                  "address": "서울", "items": [] }
                """;
        mockMvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_INPUT"));
    }
}
