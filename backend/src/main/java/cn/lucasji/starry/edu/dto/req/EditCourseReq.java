package cn.lucasji.starry.edu.dto.req;

import cn.lucasji.starry.edu.entity.Category;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/1/10 16:35
 */
@Data
public class EditCourseReq implements Serializable {

  @Serial
  private static final long serialVersionUID = 5691503786590777613L;

  private Long id;

  private String name;

  private Category category;

  private Boolean mandatory;

  private String description;

  private List<Long> departmentIds;

  private Boolean assignToAllDepartments;
}
