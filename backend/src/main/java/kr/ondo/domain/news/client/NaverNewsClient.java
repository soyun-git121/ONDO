package kr.ondo.domain.news.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import kr.ondo.domain.news.exception.NewsErrorCode;
import kr.ondo.global.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * 네이버 검색(뉴스) Open API 클라이언트. https://developers.naver.com/docs/serviceapi/search/news/news.md
 * 응답은 byte[]로 받아 ObjectMapper로 직접 UTF-8 파싱한다 — RestTemplate의 메시지 컨버터가
 * 플랫폼 기본 인코딩(Windows 등)에 의존해 한글이 깨지는 문제를 피하기 위함.
 */
@Component
public class NaverNewsClient {

    private static final String SEARCH_URL = "https://openapi.naver.com/v1/search/news.json";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String clientId;
    private final String clientSecret;

    public NaverNewsClient(RestTemplate restTemplate,
                            ObjectMapper objectMapper,
                            @Value("${ondo.naver.client-id:}") String clientId,
                            @Value("${ondo.naver.client-secret:}") String clientSecret) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public List<NaverNewsItem> search(String query, int display) {
        if (clientId.isBlank() || clientSecret.isBlank()) {
            // 어디에 넣어야 하는지까지 알려준다 — 이 메시지가 admin 화면에 그대로 뜬다.
            throw new BusinessException(NewsErrorCode.NEWS_IMPORT_FAILED,
                    "네이버 API 키가 설정되지 않았습니다. 배포 환경은 Render → Environment에, "
                            + "로컬은 backend/.env에 NAVER_CLIENT_ID·NAVER_CLIENT_SECRET을 넣어 주세요. "
                            + "(발급: developers.naver.com/apps — 사용 API '검색' 선택)");
        }

        URI uri = UriComponentsBuilder.fromUriString(SEARCH_URL)
                .queryParam("query", query)
                .queryParam("display", Math.max(1, Math.min(display, 100)))
                .queryParam("sort", "date")
                .build()
                .encode()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);

        try {
            byte[] body = restTemplate
                    .exchange(uri, HttpMethod.GET, new HttpEntity<>(headers), byte[].class)
                    .getBody();
            if (body == null || body.length == 0) {
                return List.of();
            }
            String json = new String(body, StandardCharsets.UTF_8);
            NaverNewsSearchResponse response = objectMapper.readValue(json, NaverNewsSearchResponse.class);
            return response.items() != null ? response.items() : List.of();
        } catch (RestClientException | java.io.IOException e) {
            throw new BusinessException(NewsErrorCode.NEWS_IMPORT_FAILED, "네이버 뉴스 API 호출 실패: " + e.getMessage());
        }
    }
}
