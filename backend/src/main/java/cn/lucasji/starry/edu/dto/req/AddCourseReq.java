package cn.lucasji.starry.edu.dto.req;

import cn.lucasji.starry.edu.entity.Chapter;
import cn.lucasji.starry.edu.entity.Course;
import lombok.Data;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/1/18 17:00
 */
@Data
public class AddCourseReq {

  private Course course;

  private List<Chapter> chapters;

  private List<Long> departmentIds;

  private List<Long> coursewareIds;
}
