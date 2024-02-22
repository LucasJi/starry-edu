package cn.lucasji.starry.edu.dto.req;

import cn.lucasji.starry.edu.entity.Category;
import cn.lucasji.starry.edu.modal.StorageObjType;
import lombok.Data;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2023/12/16 13:01
 */
@Data
public class FindStorageObjPageReq {

  private Category category;
  private String name;
  private List<StorageObjType> types;
}
