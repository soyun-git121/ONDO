/** Inquiry DTO — api.md §7과 1:1. type은 수익원 분류와 동일 유지(claude.md). */

export type InquiryType = "B2B_GIFT" | "COLLAB" | "EXPERIENCE" | "B2G" | "ETC";

export const INQUIRY_TYPE_LABEL: Record<InquiryType, string> = {
  B2B_GIFT: "기업 선물",
  COLLAB: "콜라보 제안",
  EXPERIENCE: "체험·강연",
  B2G: "공공·기관 협력",
  ETC: "기타 문의",
};

export interface InquiryCreateRequest {
  type: InquiryType;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
}

export interface InquiryCreateResponse {
  id: number;
  status: string;
}
