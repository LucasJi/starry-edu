package cn.lucasji.starry.edu.service;

import cn.lucasji.starry.edu.entity.Course;
import cn.lucasji.starry.edu.entity.mediate.CourseCourseware;
import cn.lucasji.starry.edu.repository.CourseCoursewareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/1/22 14:27
 */
@Service
@RequiredArgsConstructor
public class CourseCoursewareService {

  private final CourseCoursewareRepository courseCoursewareRepository;

  public void saveAll(List<CourseCourseware> all) {
    courseCoursewareRepository.saveAll(all);
  }

  public List<CourseCourseware> findAllByCourse(Course course) {
    return courseCoursewareRepository.findAllByCourse(course);
  }

  public void deleteAllByCourse(Course course) {
    courseCoursewareRepository.deleteAllByCourse(course);
  }
}
