package cn.lucasji.starry.edu.entity;

import cn.lucasji.starry.idp.infrastructure.entity.BaseEntityAudit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serial;

/**
 * @author Lucas Ji
 * @date 2023/8/31 14:50
 */
@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "category", schema = "public")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Category extends BaseEntityAudit {

  @Serial
  private static final long serialVersionUID = 3153424192750365448L;

  @Column(name = "parent_id")
  private Long parentId;

  @Column(name = "name")
  private String name;
}
