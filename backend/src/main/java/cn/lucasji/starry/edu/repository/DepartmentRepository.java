package cn.lucasji.starry.edu.repository;

import cn.lucasji.starry.edu.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

/**
 * @author Lucas Ji
 * @date 2023/8/31 14:52
 */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

  List<Department> findAllByIdIn(Set<Long> ids);
}
