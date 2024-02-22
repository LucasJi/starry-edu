package cn.lucasji.starry.edu.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author Lucas Ji
 * @date 2024/2/4 15:34
 */
@Data
public class CourseDto implements Serializable {

  @Serial
  private static final long serialVersionUID = -6922663937155868954L;
  private Long id;

  private String name;

  private CategoryDto category;

  private Boolean mandatory;

  private String description;

  private Boolean hasChapters;

  private Long videoCount;

  private Long completedVideoCount;
}
