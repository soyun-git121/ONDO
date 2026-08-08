package kr.ondo.domain.upload.storage;

import java.net.URI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * 이미지 저장소 선택. ondo.r2.* 설정이 모두 채워져 있으면 R2, 하나라도 비면 로컬 디스크.
 * 덕분에 로컬 개발은 아무 설정 없이 그대로 동작하고, 운영은 Render 환경변수만 넣으면 R2로 바뀐다.
 */
@Configuration
public class ImageStorageConfig {

    private static final Logger log = LoggerFactory.getLogger(ImageStorageConfig.class);

    @Bean
    ImageStorage imageStorage(
            @Value("${ondo.upload.dir:./uploads}") String uploadDir,
            @Value("${ondo.r2.endpoint:}") String endpoint,
            @Value("${ondo.r2.access-key:}") String accessKey,
            @Value("${ondo.r2.secret-key:}") String secretKey,
            @Value("${ondo.r2.bucket:}") String bucket,
            @Value("${ondo.r2.public-base-url:}") String publicBaseUrl) {

        if (isBlank(endpoint) || isBlank(accessKey) || isBlank(secretKey)
                || isBlank(bucket) || isBlank(publicBaseUrl)) {
            log.info("R2 설정이 없어 이미지를 로컬 디스크에 저장합니다 (dir={}). "
                    + "운영에서는 R2_* 환경변수를 넣어야 재배포 후에도 이미지가 유지됩니다.", uploadDir);
            return new LocalImageStorage(uploadDir);
        }

        S3Client s3 = S3Client.builder()
                .endpointOverride(URI.create(endpoint.trim()))
                .region(Region.of("auto"))          // R2는 리전 개념이 없어 "auto" 고정
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey.trim(), secretKey.trim())))
                .forcePathStyle(true)               // endpoint/{bucket}/{key} 형식
                // SDK 2.30+ 기본값(WHEN_SUPPORTED)은 R2가 거부하는 체크섬 헤더를 붙인다.
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .httpClient(UrlConnectionHttpClient.create())  // netty/apache 대신 경량 클라이언트
                .build();

        String base = publicBaseUrl.trim().replaceAll("/+$", "");
        log.info("이미지 저장소: Cloudflare R2 (bucket={}, public={})", bucket.trim(), base);
        return new R2ImageStorage(s3, bucket.trim(), base);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
