package kr.ondo.domain.inquiry.service;

import kr.ondo.domain.inquiry.dto.InquiryCreateRequest;
import kr.ondo.domain.inquiry.dto.InquiryCreateResponse;
import kr.ondo.domain.inquiry.entity.Inquiry;
import kr.ondo.domain.inquiry.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 협업문의 접수. api.md §7.
 * 스팸 방지: honeypot은 프론트에서 처리. rate limit(동일 IP 1분 3회)은
 * TODO — 필터/인터셉터로 추가 예정(현재 미적용).
 */
@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    @Transactional
    public InquiryCreateResponse create(InquiryCreateRequest request) {
        Inquiry inquiry = Inquiry.create(
                request.type(), request.companyName(), request.contactName(),
                request.email(), request.phone(), request.message()
        );
        return InquiryCreateResponse.from(inquiryRepository.save(inquiry));
    }
}
