package cn.lucasji.starry.edu.service;

import cn.lucasji.starry.edu.entity.Department;
import cn.lucasji.starry.edu.entity.mediate.DepartmentUser;
import cn.lucasji.starry.edu.repository.DepartmentUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * @author Lucas Ji
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

  public Long findDepartmentIdByUserId(Long userId) {
    return findEntityByUserId(userId).getDepartment().getId();
  }

  public DepartmentUser findEntityByUserId(Long userId) {
    return departmentUserRepository.findByUserId(userId);
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
