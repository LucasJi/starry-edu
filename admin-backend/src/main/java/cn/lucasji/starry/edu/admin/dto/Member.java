package cn.lucasji.starry.edu.admin.dto;

import cn.lucasji.starry.idp.infrastructure.dto.UserDto;
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

  private UserDto user;
}
