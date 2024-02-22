package cn.lucasji.starry.edu.dto;

import cn.lucasji.starry.idp.infrastructure.dto.UserDto;
import lombok.Builder;
import lombok.Data;

/**
 * @author Lucas Ji
 * @date 2023/11/9 11:13
 */
@Data
@Builder
public class Member {

  private Long departmentId;

  private String departmentName;

  private UserDto user;
}
