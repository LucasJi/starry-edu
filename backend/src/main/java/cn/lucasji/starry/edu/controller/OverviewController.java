package cn.lucasji.starry.edu.controller;

import cn.lucasji.starry.edu.dto.AdminOverview;
import cn.lucasji.starry.edu.dto.MemberOverview;
import cn.lucasji.starry.edu.service.OverviewService;
import cn.lucasji.starry.idp.infrastructure.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author jiwh
 * @date 2024/2/23 13:27
 */
@RestController
@RequestMapping("/overview")
@RequiredArgsConstructor
public class OverviewController {

  private final OverviewService overviewService;

  @GetMapping("/admin")
  public AdminOverview getAdminOverview() {
    return overviewService.getAdminOverview();
  }

  @GetMapping("/member")
  public MemberOverview getMemberOverView(@AuthenticationPrincipal Jwt jwt) {
    Long memberId = AuthUtil.getUserIdFromJwt(jwt);
    return overviewService.getMemberOverview(memberId);
  }
}
