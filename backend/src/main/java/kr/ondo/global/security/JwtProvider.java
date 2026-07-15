package kr.ondo.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * JWT 액세스 토큰 발급·검증. 설정은 application.yml ondo.jwt.* (architecture.md §2).
 */
@Component
public class JwtProvider {

    private final SecretKey key;
    private final long accessValiditySeconds;

    public JwtProvider(
            @Value("${ondo.jwt.secret}") String secret,
            @Value("${ondo.jwt.access-token-validity}") long accessValiditySeconds) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessValiditySeconds = accessValiditySeconds;
    }

    public String createAccessToken(String username, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessValiditySeconds * 1000);
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public String getUsername(String token) {
        return parse(token).getSubject();
    }

    public boolean validate(String token) {
        try {
            parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public long getAccessValiditySeconds() {
        return accessValiditySeconds;
    }

    private Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
