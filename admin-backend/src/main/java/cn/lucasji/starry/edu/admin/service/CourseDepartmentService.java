package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.entity.CourseDepartment;
import cn.lucasji.starry.edu.admin.repository.CourseDepartmentRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * @author lucas
 * @date 2024/1/20 13:00
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CourseDepartmentService {

  private final CourseDepartmentRepository courseDepartmentRepository;

  public void saveAll(List<CourseDepartment> all) {
    courseDepartmentRepository.saveAll(all);
  }

  public void deleteAllByCourse(Course course) {
    courseDepartmentRepository.deleteAllByCourse(course);
  }
}
