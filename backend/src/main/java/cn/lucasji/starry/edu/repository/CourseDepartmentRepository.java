package cn.lucasji.starry.edu.repository;

import cn.lucasji.starry.edu.entity.Course;
import cn.lucasji.starry.edu.entity.mediate.CourseDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/1/9 17:10
 */
@Repository
public interface CourseDepartmentRepository extends JpaRepository<CourseDepartment, Long> {

  List<CourseDepartment> findAllByDepartmentId(Long departmentId);

  @Query("select cd.course.id from CourseDepartment cd where cd.department.id = ?1")
  List<Long> findCourseIdsByDepartmentId(Long departmentId);

  void deleteAllByCourse(Course course);
}
