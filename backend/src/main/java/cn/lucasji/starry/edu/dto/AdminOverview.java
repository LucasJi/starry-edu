package cn.lucasji.starry.edu.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @author jiwh
 * @date 2024/2/23 13:42
 */
@Getter
@Setter
public class AdminOverview implements Serializable {

  @Serial
  private static final long serialVersionUID = -705649409922533624L;

  private Integer todayMemberCount;

  private Integer tmcCompareToYesterday;

  private Integer memberCount;

  private Integer mcCompareToYesterday;

  private Integer courseCount;

  private Integer departmentCount;

  private Integer categoryCount;

  private Integer adminCount;

  private Integer videoCount;

  private Integer coursewareCount;

  private List<String> rank;
}
