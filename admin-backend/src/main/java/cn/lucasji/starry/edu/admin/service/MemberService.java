package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.dto.Member;
import cn.lucasji.starry.edu.admin.dto.req.AddMemberReq;
import cn.lucasji.starry.edu.admin.dto.req.EditMemberReq;
import cn.lucasji.starry.edu.admin.entity.Department;
import cn.lucasji.starry.edu.admin.entity.DepartmentUser;
import cn.lucasji.starry.idp.infrastructure.api.UserClient;
import cn.lucasji.starry.idp.infrastructure.dto.UserDto;
import cn.lucasji.starry.idp.infrastructure.modal.Result;
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

  private final UserClient idpUserClient;

  public Page<Member> findPage(Department department, Pageable pageable) {
    List<DepartmentUser> departmentUsers =
        departmentUserService.findAllByDepartmentId(department.getId());
    if (Objects.isNull(department.getId())) {
      departmentUsers = departmentUserService.findAll();
    }

    List<Long> userIds =
        departmentUsers.stream().map(DepartmentUser::getUserId).collect(Collectors.toList());
    Page<UserDto> userPage = idpUserClient.findPageByUserIdIn(userIds, pageable);
    log.info("user page: {}", userPage.getContent());
    List<UserDto> users = userPage.getContent();
    List<DepartmentUser> departmentUsersByPageUsers =
        departmentUserService.findAllByUserIdIn(
            users.stream().map(UserDto::getId).collect(Collectors.toList()));
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

  public Result<String> addMember(AddMemberReq body) {
    log.info("添加学员:{}", body);

    Result<Long> result = idpUserClient.addUser(body);

    if (!result.getSuccess()) {
      return Result.error(result.getMessage());
    }

    departmentUserService.addMember(result.getData(), body.getDepartmentId());

    return Result.success("成功添加学院");
  }

  public void editMember(EditMemberReq body) {
    idpUserClient.updateUser(body);
    departmentUserService.updateDepartment(body.getId(), body.getDepartmentId());
  }

  public void deleteMember(Long memberId) {
    idpUserClient.deleteUser(memberId);
    departmentUserService.deleteByUserId(memberId);
  }
}
