package cn.lucasji.starry.edu.service;

import cn.lucasji.starry.edu.dto.AdminOverview;
import cn.lucasji.starry.edu.dto.MemberOverview;
import cn.lucasji.starry.edu.entity.Chapter;
import cn.lucasji.starry.edu.entity.Course;
import cn.lucasji.starry.edu.entity.StudyRecord;
import cn.lucasji.starry.edu.entity.mediate.DepartmentUser;
import cn.lucasji.starry.edu.modal.StorageObjType;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author jiwh
 * @date 2024/2/23 13:30
 */
@Service
@RequiredArgsConstructor
public class OverviewService {

  private final DepartmentUserService departmentUserService;

  private final CourseDepartmentService courseDepartmentService;

  private final ChapterService chapterService;

  private final StudyRecordService studyRecordService;

  private final CourseService courseService;

  private final DepartmentService departmentService;

  private final CategoryService categoryService;

  private final StorageObjService storageObjService;

  public MemberOverview getMemberOverview(Long userId) {
    Long departmentId = departmentUserService.findDepartmentIdByUserId(userId);
    List<Long> courseIds = courseDepartmentService.findCourseIdsByDepartmentId(departmentId);
    List<Course> courses = courseService.findAllById(courseIds);
    MemberOverview memberOverview = new MemberOverview();
    LocalDate today = LocalDate.now();

    Integer courseCount = courses.size();
    int completedCourseCount = 0;
    double dailyStudyDuration = 0.0;
    double studyDuration = 0.0;
    for (Course course : courses) {
      List<Chapter> chapters = chapterService.findAllByCourse(course);
      long videoCountOfCourse = chapters.stream()
        .mapToLong(chapter -> chapter.getChapterVideos().size()).sum();
      long completedVideoCountOfCourse = 0L;
      List<Long> chapterIds = chapters.stream().map(Chapter::getId).toList();
      List<StudyRecord> studyRecords = studyRecordService.findCompletedByUserIdAndChapterIdIn(
        userId, chapterIds);

      for (StudyRecord studyRecord : studyRecords) {
        if (Boolean.TRUE.equals(studyRecord.getCompleted())) {
          completedVideoCountOfCourse++;
        }

        Double duration = studyRecord.getDuration();
        if (Objects.nonNull(duration)) {
          studyDuration += duration;

          Date updateTimestamp = studyRecord.getUpdateTimestamp();
          if (today.isEqual(
            LocalDate.ofInstant(updateTimestamp.toInstant(), ZoneId.systemDefault()))) {
            dailyStudyDuration += duration;
          }
        }
      }

      if (completedVideoCountOfCourse == videoCountOfCourse) {
        completedCourseCount++;
      }
    }

    memberOverview.setCompletedCourseCount(completedCourseCount);
    memberOverview.setCourseCount(courseCount);
    memberOverview.setDailyStudyDuration((int) dailyStudyDuration);
    memberOverview.setStudyDuration((int) studyDuration);

    return memberOverview;
  }

  public AdminOverview getAdminOverview() {
    AdminOverview adminOverview = new AdminOverview();
    LocalDate today = LocalDate.now();
    LocalDate yesterday = today.minusDays(1);

    // TODO 今日学习学员
    adminOverview.setTodayMemberCount(0);
    // TODO 今日学习学员较昨日增加
    adminOverview.setTmcCompareToYesterday(0);

    List<DepartmentUser> members = departmentUserService.findAll();
    // 总学员数
    adminOverview.setMemberCount(members.size());

    // 较昨日增加 = 今日学员数
    // 今日学员数
    Integer todayMemberCount = Math.toIntExact(members.stream().filter(
        m -> LocalDate.ofInstant(m.getCreationTimestamp().toInstant(), ZoneId.systemDefault())
          .isEqual(today))
      .count());
    adminOverview.setMcCompareToYesterday(todayMemberCount);

    // 线上课数
    long courseCount = courseService.count();
    adminOverview.setCourseCount((int) courseCount);

    // 部门数
    adminOverview.setDepartmentCount((int) departmentService.count());

    // 分类数
    adminOverview.setCategoryCount((int) categoryService.count());

    // TODO 管理员数量统计
    adminOverview.setAdminCount(1);

    // TODO rank
    adminOverview.setRank(Arrays.asList("Peter", "Sam", "Nick"));

    // 视频数量
    adminOverview.setVideoCount(
      (int) storageObjService.countByTypeIn(List.of(StorageObjType.VIDEO)));

    // 课件数量
    adminOverview.setCoursewareCount(
      (int) storageObjService.countByTypeIn(Arrays.stream(StorageObjType.values())
        .filter(type -> !type.equals(StorageObjType.VIDEO)).collect(
          Collectors.toList())));

    return adminOverview;
  }
}
