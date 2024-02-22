package cn.lucasji.starry.edu.service;

import cn.lucasji.starry.edu.entity.StudyRecord;
import cn.lucasji.starry.edu.repository.StudyRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * @author Lucas Ji
 * @date 2024/2/6 13:27
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StudyRecordService {

  private final StudyRecordRepository studyRecordRepository;

  public Optional<StudyRecord> findByChapterIdAndVideoIdAndUserId(Long chapterId, Long videoId,
    Long userId) {
    return studyRecordRepository.findByChapterIdAndVideoIdAndUserId(chapterId, videoId, userId);
  }

  public void save(StudyRecord entity) {
    studyRecordRepository.save(entity);
  }

  public Long countCompletedByUserIdAndChapterIdIn(Long userId, List<Long> chapterIds) {
    return studyRecordRepository.countByCompletedIsTrueAndUserIdAndChapterIdIn(userId, chapterIds);
  }

  public List<StudyRecord> findCompletedByUserIdAndChapterIdIn(Long userId,
    List<Long> chapterIds) {
    return studyRecordRepository.findAllByCompletedIsTrueAndUserIdAndChapterIdIn(userId,
      chapterIds);
  }
}
