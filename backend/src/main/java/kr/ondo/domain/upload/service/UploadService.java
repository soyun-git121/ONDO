package kr.ondo.domain.upload.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;
import kr.ondo.domain.upload.storage.ImageStorage;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 이미지 업로드 검증 + 저장 키 생성. api.md §8 (jpg/png/webp, 최대 10MB).
 * 실제 저장은 {@link ImageStorage} 구현이 담당 — 로컬 디스크 또는 Cloudflare R2 (architecture.md §2).
 */
@Service
public class UploadService {

    /** 허용 확장자 → 저장 시 붙일 Content-Type. */
    private static final Map<String, String> CONTENT_TYPES = Map.of(
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg",
            "png", "image/png",
            "webp", "image/webp");

    private static final DateTimeFormatter DATE_PATH = DateTimeFormatter.ofPattern("yyyy/MM");

    private final ImageStorage storage;

    public UploadService(ImageStorage storage) {
        this.storage = storage;
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "업로드할 파일이 없습니다.");
        }
        String ext = extractExtension(file.getOriginalFilename());
        String contentType = CONTENT_TYPES.get(ext);
        if (contentType == null) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT,
                    "지원하지 않는 형식입니다 (jpg/png/webp만 허용).");
        }

        String key = LocalDate.now().format(DATE_PATH) + "/"
                + UUID.randomUUID().toString().replace("-", "") + "." + ext;
        return storage.put(key, contentType, file);
    }

    private String extractExtension(String originalName) {
        if (originalName == null || !originalName.contains(".")) {
            return "";
        }
        return originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase();
    }
}
