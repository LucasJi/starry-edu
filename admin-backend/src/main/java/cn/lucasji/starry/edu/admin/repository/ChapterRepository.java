package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.Chapter;
import cn.lucasji.starry.edu.admin.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/1/7 20:45
 */
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

  List<Chapter> findAllByCourse(Course course);

  void deleteAllByCourse(Course course);
}
