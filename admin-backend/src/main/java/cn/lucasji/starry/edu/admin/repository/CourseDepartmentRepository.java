package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.entity.CourseDepartment;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author lucas
 * @date 2024/1/9 17:10
 */
@Repository
public interface CourseDepartmentRepository extends JpaRepository<CourseDepartment, Long> {

  List<CourseDepartment> findAllByDepartmentIdIn(Set<Long> departmentIds);

  List<CourseDepartment> findAllByDepartmentId(Long departmentId);

  void deleteAllByCourse(Course course);
}
