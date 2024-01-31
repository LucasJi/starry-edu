package cn.lucasji.starry.edu.admin.dto.req;

import cn.lucasji.starry.idp.infrastructure.dto.req.FindUserPageReq;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author jiwh
 * @date 2024/1/31 16:29
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FindMemberPageReq extends FindUserPageReq implements Serializable {

  @Serial private static final long serialVersionUID = -2792874322398186056L;

  private Long departmentId;
}
