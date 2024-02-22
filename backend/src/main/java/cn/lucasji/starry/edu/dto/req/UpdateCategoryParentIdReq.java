package cn.lucasji.starry.edu.dto.req;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

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
