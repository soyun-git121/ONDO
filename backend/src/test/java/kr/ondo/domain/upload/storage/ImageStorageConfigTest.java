package kr.ondo.domain.upload.storage;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.Closeable;
import java.io.IOException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * 저장소 선택 로직. R2 설정이 온전할 때만 R2를 쓰고, 아니면 로컬로 떨어져야 한다
 * (로컬 개발이 설정 없이 동작하는 근거).
 */
class ImageStorageConfigTest {

    private final ImageStorageConfig config = new ImageStorageConfig();

    private ImageStorage build(String endpoint, String accessKey, String secretKey,
                               String bucket, String publicBaseUrl) {
        return config.imageStorage("./build/test-uploads",
                endpoint, accessKey, secretKey, bucket, publicBaseUrl);
    }

    @Test
    @DisplayName("R2 설정이 비어 있으면 로컬 디스크 저장소")
    void fallsBackToLocal() {
        assertThat(build("", "", "", "", "")).isInstanceOf(LocalImageStorage.class);
    }

    @Test
    @DisplayName("R2 설정이 하나라도 비면 로컬 디스크 저장소")
    void partialConfigFallsBackToLocal() {
        ImageStorage storage = build("https://acct.r2.cloudflarestorage.com",
                "key", "secret", "ondo-uploads", "   ");
        assertThat(storage).isInstanceOf(LocalImageStorage.class);
    }

    @Test
    @DisplayName("R2 설정이 모두 있으면 R2 저장소 — S3 클라이언트가 정상 조립된다")
    void buildsR2Storage() throws IOException {
        ImageStorage storage = build("https://acct.r2.cloudflarestorage.com",
                "key", "secret", "ondo-uploads", "https://pub-xxxx.r2.dev/");
        assertThat(storage).isInstanceOf(R2ImageStorage.class);
        ((Closeable) storage).close();
    }
}
