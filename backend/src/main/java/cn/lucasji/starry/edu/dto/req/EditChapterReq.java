package cn.lucasji.starry.edu.dto.req;

import cn.lucasji.starry.edu.entity.Chapter;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/1/15 19:55
 */
@Data
public class EditChapterReq implements Serializable {

  @Serial
  private static final long serialVersionUID = 4437890171852981898L;

  private List<Chapter> chapters;
}
