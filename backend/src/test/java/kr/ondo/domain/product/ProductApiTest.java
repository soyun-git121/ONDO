package kr.ondo.domain.product;

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
 * 상품 공개 API 통합 테스트. dev H2 + data.sql(mini-buk, jeontong-buk) 기준. api.md §3.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ProductApiTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/products — 목록에 id·보유자명 포함, HIDDEN 제외")
    void listProducts() throws Exception {
        mockMvc.perform(get("/api/products").param("sort", "priceAsc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(2))
                .andExpect(jsonPath("$.data.content[0].id").exists())
                .andExpect(jsonPath("$.data.content[0].artisanName").value("윤종국"));
    }

    @Test
    @DisplayName("GET /api/products?artisan=slug — 보유자 필터")
    void filterByArtisan() throws Exception {
        mockMvc.perform(get("/api/products").param("artisan", "yoon-jongguk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements").value(2));
    }

    @Test
    @DisplayName("GET /api/products/{slug} — 상세에 id·재고·보유자 블록 포함")
    void getProductDetail() throws Exception {
        mockMvc.perform(get("/api/products/mini-buk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.name").value("미니어처 전통 북"))
                .andExpect(jsonPath("$.data.price").value(45000))
                .andExpect(jsonPath("$.data.status").value("ON_SALE"))
                .andExpect(jsonPath("$.data.artisan.slug").value("yoon-jongguk"))
                .andExpect(jsonPath("$.data.images.length()").value(1));
    }

    @Test
    @DisplayName("GET /api/products/{slug} — 없는 slug는 404 PRODUCT_NOT_FOUND")
    void getProductNotFound() throws Exception {
        mockMvc.perform(get("/api/products/no-such-product"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error.code").value("PRODUCT_NOT_FOUND"));
    }
}
