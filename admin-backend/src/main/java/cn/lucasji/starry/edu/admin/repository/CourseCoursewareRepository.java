package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.entity.CourseCourseware;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author jiwh
 * @date 2024/1/22 14:20
 */
public interface CourseCoursewareRepository extends JpaRepository<CourseCourseware, Long> {

  List<CourseCourseware> findAllByCourse(Course course);

  void deleteAllByCourse(Course course);
}
