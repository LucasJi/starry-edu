package cn.lucasji.starry.edu.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

/**
 * @author Lucas Ji
 * @date 2023/8/29 13:46
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsFilter corsFilter)
      throws Exception {
    return http.addFilter(corsFilter)
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
        .oauth2ResourceServer(configurer -> configurer.jwt(Customizer.withDefaults()))
        .build();
  }
}
