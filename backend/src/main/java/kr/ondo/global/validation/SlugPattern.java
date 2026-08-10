package kr.ondo.global.validation;

/**
 * slug 형식 — Artisan·Product·Project 세 도메인이 똑같이 쓴다(URL 경로에 그대로 들어간다).
 *
 * <p>지금까지는 프론트 입력창의 HTML pattern 속성만 걸려 있고 서버는 @NotBlank로만 받았다.
 * 그 결과 실제 운영 데이터에 slug="불국사 한정판  "(한글·공백 포함)이 두 건 들어갔고,
 * 상세 페이지 링크가 그 값을 그대로 URL에 실어 보내 조회 시 404가 났다.
 * 클라이언트 검증은 우회될 수 있으므로(모바일 인앱 브라우저 등) 서버가 최종 방어선이 되어야 한다.
 */
public final class SlugPattern {

    /** 영문 소문자·숫자·하이픈만, 하이픈으로 시작/끝나거나 연속 금지. */
    public static final String REGEXP = "^[a-z0-9]+(-[a-z0-9]+)*$";

    public static final String MESSAGE = "영문 소문자·숫자·하이픈(-)만 사용할 수 있습니다. 예: bulguksa-limited";

    private SlugPattern() {
    }
}
