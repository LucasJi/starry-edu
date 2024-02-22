package cn.lucasji.starry.edu.service;

import cn.lucasji.starry.edu.dto.ChapterDto;
import cn.lucasji.starry.edu.dto.ChapterVideoDto;
import cn.lucasji.starry.edu.dto.CourseDto;
import cn.lucasji.starry.edu.dto.CourseOverview;
import cn.lucasji.starry.edu.dto.req.AddCourseReq;
import cn.lucasji.starry.edu.dto.req.EditChapterReq;
import cn.lucasji.starry.edu.dto.req.EditCourseReq;
import cn.lucasji.starry.edu.dto.req.EditCoursewareReq;
import cn.lucasji.starry.edu.dto.req.FindCoursePageReq;
import cn.lucasji.starry.edu.dto.req.UpdateStudyRecordReq;
import cn.lucasji.starry.edu.dto.resp.FindCoursePageResp;
import cn.lucasji.starry.edu.entity.Category;
import cn.lucasji.starry.edu.entity.Chapter;
import cn.lucasji.starry.edu.entity.Course;
import cn.lucasji.starry.edu.entity.Department;
import cn.lucasji.starry.edu.entity.StorageObj;
import cn.lucasji.starry.edu.entity.StudyRecord;
import cn.lucasji.starry.edu.entity.mediate.ChapterVideo;
import cn.lucasji.starry.edu.entity.mediate.CourseCourseware;
import cn.lucasji.starry.edu.entity.mediate.CourseDepartment;
import cn.lucasji.starry.edu.mapper.ChapterMapper;
import cn.lucasji.starry.edu.mapper.CourseMapper;
import cn.lucasji.starry.edu.repository.CourseRepository;
import cn.lucasji.starry.idp.infrastructure.modal.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * @author Lucas Ji
 * @date 2023/12/21 14:49
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

  private final CourseRepository courseRepository;

  private final CourseDepartmentService courseDepartmentService;

  private final DepartmentService departmentService;

  private final CategoryService categoryService;

  private final ChapterService chapterService;

  private final CourseCoursewareService courseCoursewareService;

  private final DepartmentUserService departmentUserService;

  private final StudyRecordService studyRecordService;

  private final CourseMapper courseMapper;

  private final ChapterMapper chapterMapper;

  @Transactional(rollbackFor = Exception.class)
  public void add(AddCourseReq body) {
    Course course = body.getCourse();
    List<Chapter> chapters = body.getChapters();
    List<Long> departmentIds = body.getDepartmentIds();
    List<Long> coursewareIds = body.getCoursewareIds();

    // save course
    Course savedCourse = courseRepository.save(course);

    // save chapters
    chapters.forEach(chapter -> chapter.setCourse(savedCourse));
    chapterService.saveAll(chapters);

    // save departments
    if (Boolean.TRUE.equals(course.getAssignToAllDepartments())) {
      List<Department> departments = departmentService.findAll();
      departmentIds = departments.stream().map(Department::getId).toList();
    }
    List<CourseDepartment> courseDepartments =
      departmentIds.stream().map(departmentId -> CourseDepartment.builder().course(course)
        .department(Department.builder().id(departmentId).build()).build()).collect(
        Collectors.toList());
    courseDepartmentService.saveAll(courseDepartments);

    // save coursewares
    List<CourseCourseware> courseCoursewares = IntStream.range(0, coursewareIds.size())
      .mapToObj(i -> CourseCourseware.builder().course(course).order(i)
        .storageObj(StorageObj.builder().id(coursewareIds.get(i)).build()).build()).collect(
        Collectors.toList());
    courseCoursewareService.saveAll(courseCoursewares);
  }

  public Page<FindCoursePageResp> findPage(FindCoursePageReq req, Pageable pageable) {
    Long categoryId = req.getCategoryId();
    Set<Category> categories = new HashSet<>();
    if (Objects.isNull(categoryId)) {
      List<Category> all = categoryService.findAll();
      categories.addAll(all);
    } else {
      Category category = new Category();
      category.setId(categoryId);
      categories.add(category);
    }

    List<CourseDepartment> courseDepartments;
    Long departmentId = req.getDepartmentId();
    if (Objects.isNull(departmentId)) {
      courseDepartments = courseDepartmentService.findAll();
    } else {
      courseDepartments = courseDepartmentService.findAllByDepartmentId(departmentId);
    }

    Map<Long, List<CourseDepartment>> courseIdDepartmentsMap = courseDepartments.stream()
      .collect(Collectors.groupingBy(courseDepartment -> courseDepartment.getCourse().getId()));

    Page<Course> coursePage =
      courseRepository.findAllByNameLikeAndCategoryInAndIdIn(STR."%\{req.getName()}%",
        categories, courseIdDepartmentsMap.keySet(), pageable);

    return coursePage.map(
      course -> FindCoursePageResp.builder().course(course).departments(
        courseIdDepartmentsMap.get(course.getId()).stream().map(CourseDepartment::getDepartment)
          .sorted(
            Comparator.comparing(Department::getName))
          .collect(
            Collectors.toList())).build());
  }

  @Transactional(rollbackFor = Exception.class)
  public Result<String> editCourse(EditCourseReq course) {
    Optional<Course> optionalCourse = courseRepository.findById(course.getId());
    if (optionalCourse.isEmpty()) {
      return Result.error(STR."course with id \{course.getId()} is not present");
    }

    Course saved = optionalCourse.get();
    saved.setCategory(course.getCategory());
    saved.setAssignToAllDepartments(course.getAssignToAllDepartments());
    saved.setDescription(course.getDescription());
    saved.setMandatory(course.getMandatory());
    saved.setName(course.getName());
    courseRepository.save(saved);

    List<Long> departmentIds = course.getDepartmentIds();
    if (Boolean.TRUE.equals(course.getAssignToAllDepartments())) {
      List<Department> departments = departmentService.findAll();
      departmentIds = departments.stream().map(Department::getId).toList();
    }

    courseDepartmentService.deleteAllByCourse(saved);
    List<CourseDepartment> courseDepartments =
      departmentIds.stream().map(departmentId -> CourseDepartment.builder().course(saved)
        .department(Department.builder().id(departmentId).build()).build()).collect(
        Collectors.toList());
    courseDepartmentService.saveAll(courseDepartments);

    return Result.success("edit course successfully!");
  }

  public Course findEntityById(Long courseId) {
    return courseRepository.findById(courseId).orElseThrow();
  }

  @Transactional(rollbackFor = Exception.class)
  public Result<String> editChapters(EditChapterReq editChapterReq) {
    List<Chapter> chapters = editChapterReq.getChapters();
    chapters.forEach(chapter -> {
      List<ChapterVideo> chapterVideos = chapter.getChapterVideos();
      chapterVideos.forEach(cv -> cv.setId(null));
    });
    chapterService.deleteAllByCourse(chapters.getFirst().getCourse());
    chapterService.saveAll(chapters);
    return Result.success("edit chapters successfully!");
  }

  public List<ChapterDto> findChaptersById(Long userId, Long courseId) {
    List<Chapter> chapters = chapterService.findAllByCourse(
      Course.builder().id(courseId).build());
    List<Long> chapterIds = chapters.stream().map(Chapter::getId).toList();

    List<StudyRecord> studyRecords = studyRecordService.findCompletedByUserIdAndChapterIdIn(
      userId, chapterIds);
    Map<Long, List<StudyRecord>> chapterIdRecordMap = studyRecords.stream()
      .collect(Collectors.groupingBy(StudyRecord::getChapterId));

    List<ChapterDto> result = chapterMapper.convertToChapterDtoList(chapters);
    for (ChapterDto chapterDto : result) {
      List<StudyRecord> chapterSrs = chapterIdRecordMap.get(chapterDto.getId());
      if (Objects.isNull(chapterSrs)) {
        chapterSrs = new ArrayList<>();
      }
      Set<Long> videoIds = chapterSrs.stream().map(StudyRecord::getVideoId)
        .collect(Collectors.toSet());
      for (ChapterVideoDto chapterVideo : chapterDto.getChapterVideos()) {
        chapterVideo.setCompleted(videoIds.contains(chapterVideo.getVideo().getId()));
      }
    }

    return result;
  }

  public List<StorageObj> findCoursewaresById(Long courseId) {
    List<CourseCourseware> allByCourse = courseCoursewareService.findAllByCourse(
      Course.builder().id(courseId).build());
    return allByCourse.stream().map(CourseCourseware::getStorageObj).collect(Collectors.toList());
  }

  public void delete(Long id) {
    courseRepository.deleteById(id);
  }

  @Transactional(rollbackFor = Exception.class)
  public void editCoursewares(EditCoursewareReq req) {
    Long courseId = req.getCourseId();
    List<Long> coursewareIds = req.getCoursewareIds();
    Course course = Course.builder().id(courseId).build();

    courseCoursewareService.deleteAllByCourse(course);
    List<CourseCourseware> courseCoursewares = IntStream.range(0, coursewareIds.size())
      .mapToObj(i -> CourseCourseware.builder().course(course).order(i)
        .storageObj(StorageObj.builder().id(coursewareIds.get(i)).build()).build()).collect(
        Collectors.toList());
    courseCoursewareService.saveAll(courseCoursewares);
  }

  public List<CourseDto> findCoursesByUserIdAndCategoryId(Long userId, Long categoryId) {
    Long departmentId = departmentUserService.findDepartmentIdByUserId(userId);
    List<Long> courseIds = courseDepartmentService.findCourseIdsByDepartmentId(departmentId);

    List<Course> courses;
    if (categoryId < 0) {
      courses = courseRepository.findAllById(courseIds);
    } else {
      courses = courseRepository.findAllByIdInAndCategory(courseIds,
        Category.builder().id(categoryId).build());
    }

    List<CourseDto> result = courseMapper.convertToCourseDtoList(courses);
    result.forEach(courseDto -> applyCourseStudyDetails(userId, courseDto));

    return result;
  }

  public CourseOverview getOverview(Long userId) {
    Long departmentId = departmentUserService.findDepartmentIdByUserId(userId);
    List<Long> courseIds = courseDepartmentService.findCourseIdsByDepartmentId(departmentId);
    List<Course> courses = courseRepository.findAllById(courseIds);
    CourseOverview courseOverview = new CourseOverview();
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

    courseOverview.setCompletedCourseCount(completedCourseCount);
    courseOverview.setCourseCount(courseCount);
    courseOverview.setDailyStudyDuration((int) dailyStudyDuration);
    courseOverview.setStudyDuration((int) studyDuration);

    return courseOverview;
  }

  public CourseDto findById(Long userId, Long courseId) {
    Course course = findEntityById(courseId);
    CourseDto result = courseMapper.convertToCourseDto(course);
    applyCourseStudyDetails(userId, result);
    return result;
  }

  private void applyCourseStudyDetails(Long userId, CourseDto course) {
    List<Chapter> chapters = chapterService.findAllByCourse(
      Course.builder().id(course.getId()).build());
    Long videoCount = chapters.stream()
      .mapToLong(chapter -> chapter.getChapterVideos().size()).sum();

    List<Long> chapterIds = chapters.stream().map(Chapter::getId).toList();
    Long completedVideoCount = studyRecordService.countCompletedByUserIdAndChapterIdIn(userId,
      chapterIds);
    course.setVideoCount(videoCount);
    course.setCompletedVideoCount(completedVideoCount);
  }

  public void updateStudyRecord(Long userId, UpdateStudyRecordReq body) {
    Optional<StudyRecord> optionalStudyRecord = studyRecordService.findByChapterIdAndVideoIdAndUserId(
      body.getChapterId(), body.getVideoId(), userId);
    StudyRecord sr = optionalStudyRecord.orElseGet(
      () -> StudyRecord.builder().userId(userId).videoId(body.getVideoId())
        .chapterId(body.getChapterId()).build());

    sr.setCompleted(body.getCompleted());
    sr.setDuration(body.getDuration());

    studyRecordService.save(sr);
  }
}
