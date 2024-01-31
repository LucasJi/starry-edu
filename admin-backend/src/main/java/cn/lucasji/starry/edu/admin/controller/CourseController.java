package cn.lucasji.starry.edu.admin.controller;

import cn.lucasji.starry.edu.admin.dto.req.AddCourseReq;
import cn.lucasji.starry.edu.admin.dto.req.EditChapterReq;
import cn.lucasji.starry.edu.admin.dto.req.EditCourseReq;
import cn.lucasji.starry.edu.admin.dto.req.EditCoursewareReq;
import cn.lucasji.starry.edu.admin.dto.req.FindCoursePageReq;
import cn.lucasji.starry.edu.admin.dto.resp.FindCoursePageResp;
import cn.lucasji.starry.edu.admin.entity.Chapter;
import cn.lucasji.starry.edu.admin.entity.StorageObj;
import cn.lucasji.starry.edu.admin.service.CourseService;
import cn.lucasji.starry.idp.infrastructure.modal.Result;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author lucas
 * @date 2023/12/21 14:50
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/course")
public class CourseController {

  private final CourseService courseService;

  @PostMapping("/add")
  public void add(@RequestBody AddCourseReq body) {
    courseService.add(body);
  }

  @PostMapping("/findPage")
  public Page<FindCoursePageResp> findPage(
    @RequestBody FindCoursePageReq req, Pageable pageable) {
    return courseService.findPage(req, pageable);
  }

  @PatchMapping("/editCourse")
  public Result<String> editCourse(@RequestBody EditCourseReq editCourseReq) {
    return courseService.editCourse(editCourseReq);
  }

  @PatchMapping("/editChapters")
  public Result<String> editChapters(@RequestBody EditChapterReq editChapterReq) {
    return courseService.editChapters(editChapterReq);
  }

  @PatchMapping("/editCoursewares")
  public void editCoursewares(@RequestBody EditCoursewareReq req) {
    courseService.editCoursewares(req);
  }

  @GetMapping("/findChaptersById/{courseId}")
  public List<Chapter> findChaptersById(@PathVariable Long courseId) {
    return courseService.findChaptersById(courseId);
  }

  @GetMapping("/findCoursewaresById/{courseId}")
  public List<StorageObj> findCoursewaresById(@PathVariable Long courseId) {
    return courseService.findCoursewaresById(courseId);
  }

  @DeleteMapping("/delete/{id}")
  public void delete(@PathVariable Long id) {
    courseService.delete(id);
  }
}
