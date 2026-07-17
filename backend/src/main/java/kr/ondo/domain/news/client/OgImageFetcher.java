package kr.ondo.domain.news.client;

import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * 기사 원문 페이지의 Open Graph 이미지(og:image)를 가져오는 best-effort 클라이언트.
 * 네이버 뉴스 검색 API는 썸네일을 제공하지 않아, 임포트 시 원문에서 대표 이미지를 보충한다.
 * 타임아웃·404·og:image 없음 등 실패해도 예외를 던지지 않고 null 반환 — 임포트 전체를 막지 않는다.
 */
@Component
public class OgImageFetcher {

    // property/content 순서가 사이트마다 달라 두 패턴 모두 시도.
    private static final Pattern OG_IMAGE = Pattern.compile(
            "<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)[\"']",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern OG_IMAGE_REVERSED = Pattern.compile(
            "<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"']og:image[\"']",
            Pattern.CASE_INSENSITIVE);

    private final RestTemplate restTemplate;

    public OgImageFetcher(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .connectTimeout(Duration.ofSeconds(2))
                .readTimeout(Duration.ofSeconds(3))
                .build();
    }

    /** og:image URL을 찾으면 반환, 실패(타임아웃·차단·태그 없음 등)하면 null. */
    public String fetch(String pageUrl) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (compatible; OndoBot/1.0; +https://ondo.local)");
            String html = restTemplate
                    .exchange(pageUrl, HttpMethod.GET, new HttpEntity<>(headers), String.class)
                    .getBody();
            if (html == null || html.isBlank()) {
                return null;
            }
            Matcher matcher = OG_IMAGE.matcher(html);
            if (matcher.find()) {
                return matcher.group(1);
            }
            Matcher reversed = OG_IMAGE_REVERSED.matcher(html);
            if (reversed.find()) {
                return reversed.group(1);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
