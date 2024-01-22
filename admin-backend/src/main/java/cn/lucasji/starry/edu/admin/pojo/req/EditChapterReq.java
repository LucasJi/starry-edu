package cn.lucasji.starry.edu.admin.pojo.req;

import cn.lucasji.starry.edu.admin.entity.Chapter;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * @author lucas
 * @date 2024/1/15 19:55
 */
@Data
public class EditChapterReq implements Serializable {

  @Serial private static final long serialVersionUID = 4437890171852981898L;

  private List<Chapter> chapters;
}
