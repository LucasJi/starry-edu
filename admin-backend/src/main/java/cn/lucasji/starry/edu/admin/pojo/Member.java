package cn.lucasji.starry.edu.admin.pojo;

import cn.lucas.starry.infrastructure.entity.idp.User;
import lombok.Builder;
import lombok.Data;

/**
 * @author lucas
 * @date 2023/11/9 11:13
 */
@Data
@Builder
public class Member {

  private Long departmentId;

  private String departmentName;

  private User user;
}
