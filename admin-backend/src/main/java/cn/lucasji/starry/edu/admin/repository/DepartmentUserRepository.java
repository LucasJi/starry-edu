package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.DepartmentUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author lucas
 * @date 2023/11/8 15:44
 */
public interface DepartmentUserRepository extends JpaRepository<DepartmentUser, Long> {

  List<DepartmentUser> findAllByDepartmentId(Long departmentId);

  List<DepartmentUser> findAllByUserIdIn(List<Long> userIds);

  List<DepartmentUser> findAllByUserId(Long userId);

  DepartmentUser findByUserId(Long userId);

  void deleteByUserId(Long userId);
}
