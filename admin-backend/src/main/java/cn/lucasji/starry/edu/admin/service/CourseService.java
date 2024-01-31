package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.entity.Category;
import cn.lucasji.starry.edu.admin.entity.Chapter;
import cn.lucasji.starry.edu.admin.entity.ChapterVideo;
import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.entity.CourseCourseware;
import cn.lucasji.starry.edu.admin.entity.CourseDepartment;
import cn.lucasji.starry.edu.admin.entity.Department;
import cn.lucasji.starry.edu.admin.entity.StorageObj;
import cn.lucasji.starry.edu.admin.pojo.req.AddCourseReq;
import cn.lucasji.starry.edu.admin.pojo.req.EditChapterReq;
import cn.lucasji.starry.edu.admin.pojo.req.EditCourseReq;
import cn.lucasji.starry.edu.admin.pojo.req.EditCoursewareReq;
import cn.lucasji.starry.edu.admin.pojo.req.FindCoursePageReq;
import cn.lucasji.starry.edu.admin.pojo.resp.FindCoursePageResp;
import cn.lucasji.starry.edu.admin.repository.CourseDepartmentRepository;
import cn.lucasji.starry.edu.admin.repository.CourseRepository;
import cn.lucasji.starry.idp.infrastructure.modal.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * @author lucas
 * @date 2023/12/21 14:49
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

  private final CourseRepository courseRepository;

  private final CourseDepartmentRepository courseDepartmentRepository;

  private final CourseDepartmentService courseDepartmentService;

  private final DepartmentService departmentService;

  private final CategoryService categoryService;

  private final ChapterService chapterService;

  private final CourseCoursewareService courseCoursewareService;

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
      courseDepartments = courseDepartmentRepository.findAll();
    } else {
      courseDepartments = courseDepartmentRepository.findAllByDepartmentId(departmentId);
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

  public Course findById(Long courseId) {
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

  public List<Chapter> findChaptersById(Long courseId) {
    return chapterService.findAllByCourse(Course.builder().id(courseId).build());
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
}
