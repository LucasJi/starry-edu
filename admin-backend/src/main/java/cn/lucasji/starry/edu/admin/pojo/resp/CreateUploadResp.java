package cn.lucasji.starry.edu.admin.pojo.resp;

import cn.lucasji.starry.edu.admin.pojo.Part;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * @author lucas
 * @date 2023/12/7 13:56
 */
@Data
@Builder
public class CreateUploadResp implements Serializable {

  @Serial
  private static final long serialVersionUID = -5243497979496491400L;

  private Long objId;

  private boolean uploaded;

  private List<Part> partList;
}
