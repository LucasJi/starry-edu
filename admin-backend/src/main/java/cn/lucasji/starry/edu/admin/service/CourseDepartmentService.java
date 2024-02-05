package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.entity.CourseDepartment;
import cn.lucasji.starry.edu.admin.repository.CourseDepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

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

  public List<Long> findCourseIdsByDepartmentId(Long departmentId) {
    return courseDepartmentRepository.findCourseIdsByDepartmentId(departmentId);
  }

  public List<CourseDepartment> findAllByDepartmentId(Long departmentId) {
    return courseDepartmentRepository.findAllByDepartmentId(departmentId);
  }

  public List<CourseDepartment> findAll() {
    return courseDepartmentRepository.findAll();
  }

}
