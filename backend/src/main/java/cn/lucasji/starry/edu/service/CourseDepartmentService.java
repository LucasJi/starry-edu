package cn.lucasji.starry.edu.service;

import cn.lucasji.starry.edu.entity.Course;
import cn.lucasji.starry.edu.entity.mediate.CourseDepartment;
import cn.lucasji.starry.edu.repository.CourseDepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Lucas Ji
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
