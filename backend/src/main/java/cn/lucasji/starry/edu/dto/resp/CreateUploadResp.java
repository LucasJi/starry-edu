package cn.lucasji.starry.edu.dto.resp;

import cn.lucasji.starry.edu.dto.Part;
import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @author Lucas Ji
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
