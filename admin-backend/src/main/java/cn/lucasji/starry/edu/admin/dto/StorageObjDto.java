package cn.lucasji.starry.edu.admin.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author Lucas Ji
 * @date 2024/2/5 10:39
 */
@Data
public class StorageObjDto implements Serializable {

  @Serial
  private static final long serialVersionUID = -7825553878014224858L;

  private Long id;

  private String name;
}
