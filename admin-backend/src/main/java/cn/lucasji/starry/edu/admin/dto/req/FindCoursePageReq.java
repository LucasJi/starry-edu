package cn.lucasji.starry.edu.admin.dto.req;

import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * @author Lucas Ji
 * @date 2024/1/9 16:50
 */
@Data
public class FindCoursePageReq implements Serializable {

  @Serial private static final long serialVersionUID = -3065231995164015047L;

  private Long categoryId;

  private String name = "";

  private Long departmentId;
}
