package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author lucas
 * @date 2023/8/31 14:52
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {}
