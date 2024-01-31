package cn.lucasji.starry.edu.admin.entity;

import cn.lucasji.starry.idp.infrastructure.entity.BaseEntityAudit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serial;

/**
 * @author lucas
 * @date 2023/11/8 15:41
 */
@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "department_user", schema = "public")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentUser extends BaseEntityAudit {

  @Serial
  private static final long serialVersionUID = 3239055807918056843L;

  @ManyToOne
  @JoinColumn(name = "department_id")
  private Department department;

  @Column(name = "user_id")
  private Long userId;
}
