package cn.lucasji.starry.edu.admin.dto;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

/**
 * @author lucas
 * @date 2024/2/3 21:10
 */
@Data
public class CategoryDto implements Serializable {

  @Serial
  private static final long serialVersionUID = -6640074856001278511L;

  private Long id;

  private Long parentId;

  private String name;

  private List<CategoryDto> children = new ArrayList<>();

  private long subCategoryCount;
}
