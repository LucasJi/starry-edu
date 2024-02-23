package cn.lucasji.starry.edu.controller;

import cn.lucasji.starry.edu.dto.ChapterDto;
import cn.lucasji.starry.edu.dto.CourseDto;
import cn.lucasji.starry.edu.dto.req.AddCourseReq;
import cn.lucasji.starry.edu.dto.req.EditChapterReq;
import cn.lucasji.starry.edu.dto.req.EditCourseReq;
import cn.lucasji.starry.edu.dto.req.EditCoursewareReq;
import cn.lucasji.starry.edu.dto.req.FindCoursePageReq;
import cn.lucasji.starry.edu.dto.req.UpdateStudyRecordReq;
import cn.lucasji.starry.edu.dto.resp.FindCoursePageResp;
import cn.lucasji.starry.edu.entity.StorageObj;
import cn.lucasji.starry.edu.service.CourseService;
import cn.lucasji.starry.idp.infrastructure.modal.Result;
import cn.lucasji.starry.idp.infrastructure.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2023/12/21 14:50
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/course")
@Slf4j
public class CourseController {

  private final CourseService courseService;

  @PostMapping
  public void add(@RequestBody AddCourseReq body) {
    courseService.add(body);
  }

  @PostMapping("/findPage")
  public Page<FindCoursePageResp> findPage(@RequestBody FindCoursePageReq req, Pageable pageable) {
    return courseService.findPage(req, pageable);
  }

  @PatchMapping
  public Result<String> editCourse(@RequestBody EditCourseReq editCourseReq) {
    return courseService.editCourse(editCourseReq);
  }

  @PatchMapping("/chapters")
  public Result<String> editChapters(@RequestBody EditChapterReq editChapterReq) {
    return courseService.editChapters(editChapterReq);
  }

  @PatchMapping("/coursewares")
  public void editCoursewares(@RequestBody EditCoursewareReq req) {
    courseService.editCoursewares(req);
  }

  @GetMapping("/{courseId}/chapters")
  public List<ChapterDto> findChaptersById(@AuthenticationPrincipal Jwt jwt,
    @PathVariable Long courseId) {
    Long userId = AuthUtil.getUserIdFromJwt(jwt);
    return courseService.findChaptersById(userId, courseId);
  }

  @GetMapping("/{courseId}/coursewares")
  public List<StorageObj> findCoursewaresById(@PathVariable Long courseId) {
    return courseService.findCoursewaresById(courseId);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    courseService.delete(id);
  }

  @GetMapping("/{id}")
  public CourseDto findById(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
    Long userId = AuthUtil.getUserIdFromJwt(jwt);
    return courseService.findById(userId, id);
  }

  @GetMapping("/category/{categoryId}/member/current")
  public List<CourseDto> findLoginMemberCourses(@AuthenticationPrincipal Jwt jwt,
    @PathVariable Long categoryId) {
    Long memberId = AuthUtil.getUserIdFromJwt(jwt);
    log.info("find login member(id: {}) courses(category id: {})", memberId, categoryId);
    return courseService.findCoursesByUserIdAndCategoryId(memberId, categoryId);
  }

  @PatchMapping("/study")
  public void updateStudyRecord(@AuthenticationPrincipal Jwt jwt,
    @RequestBody UpdateStudyRecordReq body) {
    Long memberId = AuthUtil.getUserIdFromJwt(jwt);
    courseService.updateStudyRecord(memberId, body);
  }
}
