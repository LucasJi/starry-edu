package cn.lucasji.starry.edu.admin.dto.req;

import cn.lucasji.starry.edu.admin.entity.Chapter;
import cn.lucasji.starry.edu.admin.entity.Course;
import java.util.List;
import lombok.Data;

/**
 * @author lucas
 * @date 2024/1/18 17:00
 */
@Data
public class AddCourseReq {

  private Course course;

  private List<Chapter> chapters;

  private List<Long> departmentIds;

  private List<Long> coursewareIds;
}
