package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.entity.Department;
import cn.lucasji.starry.edu.admin.entity.DepartmentUser;
import cn.lucasji.starry.edu.admin.repository.DepartmentUserRepository;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author lucas
 * @date 2023/11/8 16:13
 */
@Service
@RequiredArgsConstructor
public class DepartmentUserService {

  private final DepartmentUserRepository departmentUserRepository;

  public List<DepartmentUser> findAllByDepartmentId(Long departmentId) {
    return departmentUserRepository.findAllByDepartmentId(departmentId);
  }

  public List<DepartmentUser> findAll() {
    return departmentUserRepository.findAll();
  }

  public void addMember(Long userId, Long departmentId) {
    departmentUserRepository.save(
      DepartmentUser.builder()
        .userId(userId)
        .department(Department.builder().id(departmentId).build())
        .build());
  }

  public List<DepartmentUser> findAllByUserIdIn(List<Long> userIds) {
    return departmentUserRepository.findAllByUserIdIn(userIds);
  }

  public List<DepartmentUser> findAllByUserId(Long userId) {
    return departmentUserRepository.findAllByUserId(userId);
  }

  public List<Long> findDepartmentIdsByUserId(Long userId) {
    return departmentUserRepository.findDepartmentIdsByUserId(userId);
  }

  public void updateDepartment(Long userId, Long newDepartmentId) {
    DepartmentUser byUserId = departmentUserRepository.findByUserId(userId);

    if (!Objects.equals(newDepartmentId, byUserId.getDepartment().getId())) {
      byUserId.setDepartment(Department.builder().id(newDepartmentId).build());
      departmentUserRepository.save(byUserId);
    }
  }

  public void deleteByUserId(Long id) {
    departmentUserRepository.deleteByUserId(id);
  }
}
