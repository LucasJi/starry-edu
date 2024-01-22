package cn.lucasji.starry.edu.admin.service;

import cn.lucas.starry.infrastructure.entity.idp.User;
import cn.lucas.starry.infrastructure.modal.Result;
import cn.lucasji.starry.edu.admin.entity.Department;
import cn.lucasji.starry.edu.admin.entity.DepartmentUser;
import cn.lucasji.starry.edu.admin.feign.IdpUserClient;
import cn.lucasji.starry.edu.admin.pojo.Member;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * @author lucas
 * @date 2023/11/8 16:14
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {
  private final DepartmentUserService departmentUserService;

  private final IdpUserClient idpUserClient;

  public Page<Member> findPageByDepartment(Department department, Pageable pageable) {
    List<DepartmentUser> departmentUsers =
        departmentUserService.findAllByDepartmentId(department.getId());
    if (Objects.isNull(department.getId())) {
      departmentUsers = departmentUserService.findAll();
    }

    List<Long> userIds =
        departmentUsers.stream().map(DepartmentUser::getUserId).collect(Collectors.toList());
    Page<User> userPage = idpUserClient.findPageByUserIdIn(userIds, pageable);
    log.info("user page: {}", userPage.getContent());
    List<User> users = userPage.getContent();
    List<DepartmentUser> departmentUsersByPageUsers =
        departmentUserService.findAllByUserIdIn(
            users.stream().map(User::getId).collect(Collectors.toList()));
    Map<Long, DepartmentUser> userIdDepartmentUserMap =
        departmentUsersByPageUsers.stream()
            .collect(Collectors.toMap(DepartmentUser::getUserId, e -> e));

    return userPage.map(
        user ->
            Member.builder()
                .departmentId(userIdDepartmentUserMap.get(user.getId()).getDepartment().getId())
                .departmentName(userIdDepartmentUserMap.get(user.getId()).getDepartment().getName())
                .user(user)
                .build());
  }

  public Result<String> addMember(Member member) {
    log.info("添加学员:{}", member);

    Result<User> result = idpUserClient.addUser(member.getUser());

    if (!result.getSuccess()) {
      return Result.error(result.getMessage());
    }

    User savedUser = result.getData();
    departmentUserService.addMember(savedUser.getId(), member.getDepartmentId());

    return Result.success("成功添加学院");
  }

  public void editMember(Member member) {
    idpUserClient.updateUser(member.getUser());
    departmentUserService.updateDepartment(member.getUser().getId(), member.getDepartmentId());
  }

  public void deleteMember(Long memberId) {
    idpUserClient.deleteUser(memberId);
    departmentUserService.deleteByUserId(memberId);
  }
}
