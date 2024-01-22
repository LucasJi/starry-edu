package cn.lucasji.starry.edu.admin.entity;

import cn.lucas.starry.infrastructure.entity.BaseEntityAudit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.io.Serial;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * @author lucas
 * @date 2023/11/6 21:53
 */
@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "department", schema = "public")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Department extends BaseEntityAudit {

  @Serial private static final long serialVersionUID = -1078672229963927561L;

  @Column(name = "parent_id")
  private Long parentId;

  @Column(name = "name")
  private String name;

  @Transient private final List<Department> children = new ArrayList<>();

  @Transient private long subDepartmentCount;

  /**
   * @return <code>true</code> if current department doesn't have any sub departments otherwise
   *     <code>
   * false</code>
   */
  public boolean isDeletable() {
    return subDepartmentCount <= 0;
  }
}
