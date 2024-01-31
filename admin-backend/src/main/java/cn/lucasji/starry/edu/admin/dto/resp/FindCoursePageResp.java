package cn.lucasji.starry.edu.admin.dto.resp;

import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.entity.Department;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author lucas
 * @date 2024/1/20 13:31
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FindCoursePageResp implements Serializable {

  @Serial
  private static final long serialVersionUID = -1738314550484395248L;

  private Course course;

  private List<Department> departments;
}
