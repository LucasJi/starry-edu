package cn.lucasji.starry.edu.repository;

import cn.lucasji.starry.edu.entity.StudyRecord;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Lucas Ji
 * @date 2024/2/6 9:56
 */
public interface StudyRecordRepository extends JpaRepository<StudyRecord, Long> {

  Optional<StudyRecord> findByChapterIdAndVideoIdAndUserId(Long chapterId, Long videoId,
    Long userId);

  Long countByCompletedIsTrueAndUserIdAndChapterIdIn(Long userId, List<Long> chapterIds);

  List<StudyRecord> findAllByCompletedIsTrueAndUserIdAndChapterIdIn(Long userId,
    List<Long> chapterIds);

  long countDistinctUserIdByCreationTimestampBetween(Date start, Date end);
}
