package kr.ondo.domain.inquiry.entity;

/** 협업문의 유형 = 수익원 분류. api.md Enum / db_schema.md §11. */
public enum InquiryType {
    B2B_GIFT,    // 기업 선물
    COLLAB,      // 콜라보
    EXPERIENCE,  // 체험·강연
    B2G,         // 공공·기관
    ETC          // 기타
}
