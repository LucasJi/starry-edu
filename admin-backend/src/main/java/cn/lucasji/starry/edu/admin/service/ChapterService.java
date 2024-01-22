package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.entity.Chapter;
import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.repository.ChapterRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author jiwh
 * @date 2024/1/12 13:55
 */
@Service
@RequiredArgsConstructor
public class ChapterService {

  private final ChapterRepository chapterRepository;

  public List<Chapter> findAllByCourse(Course course) {
    return chapterRepository.findAllByCourse(course);
  }

  public void saveAll(List<Chapter> chapters) {
    chapterRepository.saveAll(chapters);
  }

  public void deleteAllByCourse(Course course) {
    chapterRepository.deleteAllByCourse(course);
  }
}
