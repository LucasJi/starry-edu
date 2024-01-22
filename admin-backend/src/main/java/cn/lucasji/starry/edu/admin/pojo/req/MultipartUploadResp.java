package cn.lucasji.starry.edu.admin.pojo.req;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author lucas
 * @date 2023/12/8 16:31
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MultipartUploadResp {

  private int part;
  private String url;
}
