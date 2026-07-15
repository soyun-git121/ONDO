package kr.ondo.domain.inquiry.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 협업문의 (B2B 리드). db_schema.md §11 / api.md §7.
 * type은 수익원 분류와 동일하게 유지 → 리드 관리 데이터로 활용.
 */
@Entity
@Getter
@Table(name = "inquiry", indexes = {
        @Index(name = "idx_inquiry_status", columnList = "status, created_at"),
        @Index(name = "idx_inquiry_type", columnList = "type")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inquiry extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InquiryType type;

    @Column(name = "company_name", length = 100)
    private String companyName; // 개인 문의면 null

    @Column(name = "contact_name", nullable = false, length = 50)
    private String contactName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InquiryStatus status;

    @Column(name = "admin_note", length = 500)
    private String adminNote; // 내부 메모

    private Inquiry(InquiryType type, String companyName, String contactName, String email,
                    String phone, String message) {
        this.type = type;
        this.companyName = companyName;
        this.contactName = contactName;
        this.email = email;
        this.phone = phone;
        this.message = message;
        this.status = InquiryStatus.NEW;
    }

    /** 신규 문의 접수(NEW). */
    public static Inquiry create(InquiryType type, String companyName, String contactName,
                                 String email, String phone, String message) {
        return new Inquiry(type, companyName, contactName, email, phone, message);
    }

    /** admin 처리 — 상태 변경 + 내부 메모. */
    public void updateStatus(InquiryStatus status, String adminNote) {
        this.status = status;
        this.adminNote = adminNote;
    }
}
