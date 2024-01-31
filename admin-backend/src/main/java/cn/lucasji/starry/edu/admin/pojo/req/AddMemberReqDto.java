package cn.lucasji.starry.edu.admin.pojo.req;

import cn.lucasji.starry.idp.infrastructure.dto.AddUserDto;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author jiwh
 * @date 2024/1/31 14:21
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AddMemberReqDto extends AddUserDto implements Serializable {

  @Serial private static final long serialVersionUID = 4925322856884592935L;

  private Long departmentId;
}
