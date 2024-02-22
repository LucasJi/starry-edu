package cn.lucasji.starry.edu.service;

import cn.lucasji.starry.edu.entity.Chapter;
import cn.lucasji.starry.edu.entity.Course;
import cn.lucasji.starry.edu.repository.ChapterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Lucas Ji
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
