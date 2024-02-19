package cn.lucasji.starry.edu.admin.dto.req;

import cn.lucasji.starry.idp.infrastructure.dto.req.AddUserReq;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Lucas Ji
 * @date 2024/1/31 14:21
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AddMemberReq extends AddUserReq implements Serializable {

  @Serial private static final long serialVersionUID = 4925322856884592935L;

  private Long departmentId;
}
