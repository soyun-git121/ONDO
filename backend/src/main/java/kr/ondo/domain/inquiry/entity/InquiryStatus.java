package kr.ondo.domain.inquiry.entity;

/** 협업문의 처리 상태. api.md Enum / db_schema.md §11. */
public enum InquiryStatus {
    NEW,
    IN_REVIEW,
    REPLIED,
    CLOSED
}
