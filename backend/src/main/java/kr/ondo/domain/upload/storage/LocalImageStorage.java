package kr.ondo.domain.upload.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import org.springframework.web.multipart.MultipartFile;

/**
 * 로컬 디스크 저장 (ondo.upload.dir). 개발 환경 기본값.
 * 반환 경로 "/uploads/..."는 WebConfig의 정적 리소스 핸들러가 서빙한다.
 *
 * <p>운영(Render 무료 티어)에서는 재배포마다 디스크가 초기화되므로 쓰지 않는다 — R2를 설정할 것.
 */
public class LocalImageStorage implements ImageStorage {

    private final Path baseDir;

    public LocalImageStorage(String dir) {
        this.baseDir = Paths.get(dir).toAbsolutePath().normalize();
    }

    @Override
    public String put(String key, String contentType, MultipartFile file) {
        try {
            Path target = baseDir.resolve(key).normalize();
            Files.createDirectories(target.getParent());
            file.transferTo(target);
        } catch (IOException e) {
            throw new BusinessException(GlobalErrorCode.INTERNAL_ERROR, "파일 저장에 실패했습니다.");
        }
        return "/uploads/" + key;
    }
}
