package kr.ondo.domain.upload.storage;

import java.io.Closeable;
import java.io.IOException;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * Cloudflare R2(S3 호환) 저장. 운영용 — 재배포로 파일이 사라지지 않는다.
 *
 * <p>반환 URL은 버킷의 공개 주소(ondo.r2.public-base-url) 기준 절대 URL이라
 * 프론트 resolveImageUrl()이 그대로 통과시킨다.
 */
public class R2ImageStorage implements ImageStorage, Closeable {

    private static final Logger log = LoggerFactory.getLogger(R2ImageStorage.class);

    private final S3Client s3;
    private final String bucket;
    private final String publicBaseUrl;

    /** @param publicBaseUrl 끝 슬래시 없는 공개 주소 (예: https://pub-xxxx.r2.dev) */
    public R2ImageStorage(S3Client s3, String bucket, String publicBaseUrl) {
        this.s3 = s3;
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl;
    }

    @Override
    public String put(String key, String contentType, MultipartFile file) {
        try {
            // 업로드는 10MB 이하(multipart 설정)라 전체를 메모리에 올려도 안전하고,
            // 그래야 SDK가 실패 시 재시도할 수 있다(스트림은 되감기 불가).
            s3.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentType(contentType)
                            .build(),
                    RequestBody.fromBytes(file.getBytes()));
        } catch (IOException | SdkException e) {
            log.error("R2 업로드 실패 (bucket={}, key={})", bucket, key, e);
            throw new BusinessException(GlobalErrorCode.INTERNAL_ERROR, "파일 저장에 실패했습니다.");
        }
        return publicBaseUrl + "/" + key;
    }

    /** 스프링이 종료 시 자동 호출(@Bean 기본 destroyMethod 추론). */
    @Override
    public void close() {
        s3.close();
    }
}
