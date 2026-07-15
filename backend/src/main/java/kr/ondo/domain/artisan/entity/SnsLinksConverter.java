package kr.ondo.domain.artisan.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Map;

/**
 * snsLinks(JSON) ↔ DB 컬럼(TEXT) 변환. db_schema.md §1: sns_links JSON.
 * 예: {"instagram": "...", "youtube": "..."}
 */
@Converter
public class SnsLinksConverter implements AttributeConverter<Map<String, String>, String> {

    private static final ObjectMapper OM = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, String> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return null;
        }
        try {
            return OM.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new IllegalArgumentException("snsLinks 직렬화 실패", e);
        }
    }

    @Override
    public Map<String, String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Map.of();
        }
        try {
            return OM.readValue(dbData, new TypeReference<Map<String, String>>() {
            });
        } catch (Exception e) {
            throw new IllegalArgumentException("snsLinks 역직렬화 실패", e);
        }
    }
}
