package kr.ondo.global.config;

import java.io.IOException;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * 정적 리소스 서빙.
 * - /uploads/**  : 업로드된 이미지(ondo.upload.dir)
 * - /**          : 번들된 React 빌드(classpath:/static). SPA라서 파일이 없는 경로는
 *                  index.html로 폴백해 React Router가 처리하게 한다.
 * 운영에서는 프론트 dist가 static에 들어가 한 서버가 사이트+API를 모두 제공(같은 origin, CORS 불필요).
 * dev는 프론트를 vite로 따로 띄우므로 이 폴백이 쓰이지 않는다.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${ondo.upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Paths.get(uploadDir).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/uploads/**").addResourceLocations(location);

        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location)
                            throws IOException {
                        // API·업로드는 정적 폴백 대상이 아니다 — 컨트롤러/전용 핸들러가 처리(없으면 404 JSON).
                        if (resourcePath.startsWith("api/") || resourcePath.startsWith("uploads/")) {
                            return null;
                        }
                        Resource requested = location.createRelative(resourcePath);
                        if (requested.exists() && requested.isReadable()) {
                            return requested;
                        }
                        // 클라이언트 라우트(/admin, /shop/{slug} 등)는 index.html로 폴백.
                        Resource index = new ClassPathResource("/static/index.html");
                        return index.exists() ? index : null;
                    }
                });
    }
}
