import { post } from "./client";
import type { InquiryCreateRequest, InquiryCreateResponse } from "../types/inquiry";

export function createInquiry(body: InquiryCreateRequest): Promise<InquiryCreateResponse> {
  return post<InquiryCreateResponse>("/inquiries", body);
}
