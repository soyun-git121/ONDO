package kr.ondo.domain.inquiry.repository;

import kr.ondo.domain.inquiry.entity.Inquiry;
import kr.ondo.domain.inquiry.entity.InquiryStatus;
import kr.ondo.domain.inquiry.entity.InquiryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    /** admin 목록 — 상태·유형 필터(nullable). */
    @Query("""
            select i from Inquiry i
            where (:status is null or i.status = :status)
              and (:type is null or i.type = :type)
            """)
    Page<Inquiry> search(@Param("status") InquiryStatus status,
                        @Param("type") InquiryType type,
                        Pageable pageable);
}
