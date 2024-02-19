package cn.lucasji.starry.edu.admin.config.interceptor;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

/**
 * @author Lucas Ji
 * @date 2023/10/31 13:16
 */
@Component
@Slf4j
public class FeignClientInterceptor implements RequestInterceptor {

  private static final String AUTHORIZATION_HEADER = "Authorization";
  private static final String TOKEN_TYPE = "Bearer";

  @Override
  public void apply(RequestTemplate requestTemplate) {
    JwtAuthenticationToken authentication =
        (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    String jwt = authentication.getToken().getTokenValue();
    log.info(
        "Apply bearer token {} to feign request path {} header {}",
        jwt,
        requestTemplate.path(),
        AUTHORIZATION_HEADER);
    requestTemplate.header(AUTHORIZATION_HEADER, String.format("%s %s", TOKEN_TYPE, jwt));
  }
}
