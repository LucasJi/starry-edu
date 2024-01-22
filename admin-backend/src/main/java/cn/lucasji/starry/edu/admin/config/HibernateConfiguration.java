package cn.lucasji.starry.edu.admin.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module.Feature;
import java.io.Serial;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.type.format.jackson.JacksonJsonFormatMapper;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author lucas
 * @date 2024/1/9 15:13
 */
@Configuration
public class HibernateConfiguration {

  @Bean
  public HibernateAwareObjectMapper hibernateAwareObjectMapper() {
    return new HibernateAwareObjectMapper();
  }

  @Bean
  public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(
      HibernateAwareObjectMapper objectMapper) {
    return hibernateProperties -> {
      hibernateProperties.put(
          AvailableSettings.JSON_FORMAT_MAPPER, new JacksonJsonFormatMapper(objectMapper));
    };
  }

  public static class HibernateAwareObjectMapper extends ObjectMapper {

    @Serial private static final long serialVersionUID = -8104466180562970076L;

    public HibernateAwareObjectMapper() {
      Hibernate6Module hibernate6Module = new Hibernate6Module();
      hibernate6Module.disable(Feature.USE_TRANSIENT_ANNOTATION);
      registerModule(hibernate6Module);
    }
  }
}
