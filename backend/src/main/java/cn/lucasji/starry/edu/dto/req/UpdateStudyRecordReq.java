package cn.lucasji.starry.edu.dto.req;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author Lucas Ji
 * @date 2024/2/6 11:04
 */
@Data
public class UpdateStudyRecordReq implements Serializable {

  @Serial
  private static final long serialVersionUID = -8741048568569945904L;

  private Long chapterId;

  private Long videoId;

  private Boolean completed;

  private Double duration;
}
