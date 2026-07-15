package kr.ondo.domain.artisan.entity;

/**
 * 보유자 지정 구분. api.md Enum / db_schema.md §1 참조.
 */
public enum Designation {
    HOLDER,      // 국가무형문화재 보유자
    SUCCESSOR,   // 이수자
    MASTER       // 명장
}
