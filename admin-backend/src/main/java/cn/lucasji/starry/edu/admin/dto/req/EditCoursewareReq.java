package cn.lucasji.starry.edu.admin.dto.req;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * @author Lucas Ji
 * @date 2024/1/22 15:41
 */
@Data
public class EditCoursewareReq implements Serializable {

  @Serial private static final long serialVersionUID = 4376091122066202669L;

  List<Long> coursewareIds;

  Long courseId;
}
