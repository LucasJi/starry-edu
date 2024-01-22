package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.Chapter;
import cn.lucasji.starry.edu.admin.entity.Course;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author lucas
 * @date 2024/1/7 20:45
 */
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

  List<Chapter> findAllByCourse(Course course);

  void deleteAllByCourse(Course course);
}
