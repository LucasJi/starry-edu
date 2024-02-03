package cn.lucasji.starry.edu.admin.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * @author lucas
 * @date 2024/2/3 21:10
 */
@Data
public class DropdownCategoryDto implements Serializable {

  @Serial
  private static final long serialVersionUID = 6130980991386071683L;

  private Long key;

  @JsonIgnore
  private Long parentId;

  private String label;

  private List<DropdownCategoryDto> children;
}
