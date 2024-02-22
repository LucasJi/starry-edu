package cn.lucasji.starry.edu.repository;

import cn.lucasji.starry.edu.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Lucas Ji
 * @date 2023/8/31 14:52
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
