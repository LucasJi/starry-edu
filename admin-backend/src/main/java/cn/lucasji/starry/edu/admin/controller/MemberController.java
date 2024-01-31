package cn.lucasji.starry.edu.admin.controller;

import cn.lucasji.starry.edu.admin.dto.Member;
import cn.lucasji.starry.edu.admin.dto.req.AddMemberReq;
import cn.lucasji.starry.edu.admin.dto.req.EditMemberReq;
import cn.lucasji.starry.edu.admin.entity.Department;
import cn.lucasji.starry.edu.admin.service.MemberService;
import cn.lucasji.starry.idp.infrastructure.modal.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author lucas
 * @date 2023/11/8 16:07
 */
@RequestMapping("/member")
@RestController
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;

  @PostMapping("/findPage")
  public Page<Member> findPage(@RequestBody Department department, Pageable pageable) {
    return memberService.findPage(department, pageable);
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
}
