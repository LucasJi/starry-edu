package cn.lucasji.starry.edu.admin.dto.req;

import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * @author Lucas Ji
 * @date 2024/2/3 21:23
 */
@Data
public class UpdateCategoryParentIdReq implements Serializable {

  @Serial
  private static final long serialVersionUID = 4609015517620761144L;

  private Long id;

  private Long parentId;
}
