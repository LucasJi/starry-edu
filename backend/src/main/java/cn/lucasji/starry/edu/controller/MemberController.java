package cn.lucasji.starry.edu.controller;

import cn.lucasji.starry.edu.dto.Member;
import cn.lucasji.starry.edu.dto.req.AddMemberReq;
import cn.lucasji.starry.edu.dto.req.EditMemberReq;
import cn.lucasji.starry.edu.dto.req.FindMemberPageReq;
import cn.lucasji.starry.edu.service.MemberService;
import cn.lucasji.starry.idp.infrastructure.modal.Result;
import cn.lucasji.starry.idp.infrastructure.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Lucas Ji
 * @date 2023/11/8 16:07
 */
@RequestMapping("/member")
@RestController
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;

  @PostMapping("/findPage")
  public Page<Member> findPage(@RequestBody FindMemberPageReq body, Pageable pageable) {
    return memberService.findPage(body, pageable);
  }

  @PostMapping
  public Result<String> addMember(@RequestBody AddMemberReq body) {
    return memberService.addMember(body);
  }

  @PatchMapping
  public void editMember(@RequestBody EditMemberReq body) {
    memberService.editMember(body);
  }

  @DeleteMapping("/{memberId}")
  public Result<String> deleteMember(@PathVariable Long memberId) {
    memberService.deleteMember(memberId);
    return Result.success();
  }

  @GetMapping("/current")
  public Member current(@AuthenticationPrincipal Jwt jwt) {
    Long memberId = AuthUtil.getUserIdFromJwt(jwt);
    return memberService.findById(memberId);
  }
}
