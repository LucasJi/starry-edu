package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.DepartmentUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author lucas
 * @date 2023/11/8 15:44
 */
public interface DepartmentUserRepository extends JpaRepository<DepartmentUser, Long> {
  List<DepartmentUser> findAllByDepartmentId(Long departmentId);

  List<DepartmentUser> findAllByUserIdIn(List<Long> userIds);

  DepartmentUser findByUserId(Long userId);

  void deleteByUserId(Long userId);
}
