package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.mediate.DepartmentUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2023/11/8 15:44
 */
public interface DepartmentUserRepository extends JpaRepository<DepartmentUser, Long> {

  List<DepartmentUser> findAllByDepartmentId(Long departmentId);

  List<DepartmentUser> findAllByUserIdIn(List<Long> userIds);

  List<DepartmentUser> findAllByUserId(Long userId);

  @Query("select du.department.id from DepartmentUser du where du.userId = ?1")
  List<Long> findDepartmentIdsByUserId(Long userId);

  DepartmentUser findByUserId(Long userId);

  void deleteByUserId(Long userId);
}
