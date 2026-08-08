package kr.ondo.domain.upload.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * 업로드 이미지 저장소. 구현은 두 가지 —
 * {@link LocalImageStorage}(로컬 디스크, 개발용) / {@link R2ImageStorage}(Cloudflare R2, 운영용).
 * 어느 쪽을 쓸지는 {@link ImageStorageConfig}가 R2 설정 유무로 결정한다.
 */
public interface ImageStorage {

    /**
     * @param key         저장 키. "yyyy/MM/{uuid}.{ext}" 형식 (구분자는 항상 '/').
     * @param contentType 이미지 MIME 타입 (image/png 등)
     * @return 프론트가 그대로 표시에 쓰는 URL. 로컬은 "/uploads/..."(상대), R2는 "https://..."(절대).
     */
    String put(String key, String contentType, MultipartFile file);
}
