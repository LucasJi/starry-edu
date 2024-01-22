package cn.lucasji.starry.edu.admin.pojo.req;

import cn.lucasji.starry.edu.admin.entity.Category;
import cn.lucasji.starry.edu.admin.modal.StorageObjType;
import java.util.List;
import lombok.Data;

/**
 * @author lucas
 * @date 2023/12/16 13:01
 */
@Data
public class FindStorageObjPageReq {

  private Category category;
  private String name;
  private List<StorageObjType> types;
}
