package cn.lucasji.starry.edu.repository;

import cn.lucasji.starry.edu.entity.Category;
import cn.lucasji.starry.edu.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

/**
 * @author Lucas Ji
 * @date 2023/12/21 14:49
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

  Page<Course> findAllByNameLikeAndCategoryInAndIdIn(
    String name, Set<Category> categories, Set<Long> ids, Pageable pageable);

  List<Course> findAllByIdInAndCategory(List<Long> ids, Category category);
}
