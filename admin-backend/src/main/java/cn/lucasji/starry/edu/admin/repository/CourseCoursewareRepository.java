package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.entity.mediate.CourseCourseware;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/1/22 14:20
 */
public interface CourseCoursewareRepository extends JpaRepository<CourseCourseware, Long> {

  List<CourseCourseware> findAllByCourse(Course course);

  void deleteAllByCourse(Course course);
}
