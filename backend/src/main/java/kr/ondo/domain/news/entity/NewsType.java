package kr.ondo.domain.news.entity;

/** 뉴스 유형. api.md Enum / db_schema.md §7. */
public enum NewsType {
    ORIGINAL,  // 자체 작성 (상세 페이지 있음)
    CURATED    // 외부 기사 링크 (상세 없음, external_url로 이동)
}
