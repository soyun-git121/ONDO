package kr.ondo.domain.upload.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Set;
import java.util.UUID;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 이미지 업로드 저장. api.md §8 (jpg/png/webp, 최대 10MB).
 * 초기: 로컬 디렉토리(ondo.upload.dir) → 확장 시 S3 호환 스토리지로 교체 (architecture.md §2).
 */
@Service
public class UploadService {

    private static final Set<String> ALLOWED_EXT = Set.of("jpg", "jpeg", "png", "webp");
    private static final DateTimeFormatter DATE_PATH = DateTimeFormatter.ofPattern("yyyy/MM");

    private final Path baseDir;

    public UploadService(@Value("${ondo.upload.dir:./uploads}") String dir) {
        this.baseDir = Paths.get(dir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "업로드할 파일이 없습니다.");
        }
        String ext = extractExtension(file.getOriginalFilename());
        if (!ALLOWED_EXT.contains(ext)) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT,
                    "지원하지 않는 형식입니다 (jpg/png/webp만 허용).");
        }

        String datePath = LocalDate.now().format(DATE_PATH);
        String filename = UUID.randomUUID().toString().replace("-", "") + "." + ext;
        try {
            Path dir = baseDir.resolve(datePath);
            Files.createDirectories(dir);
            file.transferTo(dir.resolve(filename));
        } catch (IOException e) {
            throw new BusinessException(GlobalErrorCode.INTERNAL_ERROR, "파일 저장에 실패했습니다.");
        }
        return "/uploads/" + datePath + "/" + filename;
    }

    private String extractExtension(String originalName) {
        if (originalName == null || !originalName.contains(".")) {
            return "";
        }
        return originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase();
    }
}
