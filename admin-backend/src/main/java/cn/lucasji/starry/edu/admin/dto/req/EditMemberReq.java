package cn.lucasji.starry.edu.admin.dto.req;

import cn.lucasji.starry.idp.infrastructure.dto.req.EditUserReq;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Lucas Ji
 * @date 2024/1/31 14:17
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class EditMemberReq extends EditUserReq implements Serializable {

  @Serial private static final long serialVersionUID = -2353204959686959839L;

  private Long departmentId;
}
