package kr.ondo.domain.admin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 관리자 계정. db_schema.md §12. password는 BCrypt 해시.
 */
@Entity
@Getter
@Table(name = "admin_user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUser extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password; // BCrypt

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    private AdminUser(String username, String password, String name, String role) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.role = role;
    }

    /** password는 반드시 인코딩된 값을 넘긴다. */
    public static AdminUser create(String username, String encodedPassword, String name, String role) {
        return new AdminUser(username, encodedPassword, name, role);
    }

    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }
}
