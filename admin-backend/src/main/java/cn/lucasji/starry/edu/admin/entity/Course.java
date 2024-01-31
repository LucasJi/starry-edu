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
 * @date 2023/12/21 10:52
 */
@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "course", schema = "public")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Course extends BaseEntityAudit {

  @Serial
  private static final long serialVersionUID = 1726734794855964657L;

  @Column(name = "name")
  private String name;

  @JoinColumn(name = "category_id", referencedColumnName = "id")
  @ManyToOne
  private Category category;

  @Column(name = "mandatory")
  private Boolean mandatory;

  @Column(name = "description")
  private String description;

  @Column(name = "assign_to_all_departments")
  private Boolean assignToAllDepartments;

  @Column(name = "has_chapters")
  private Boolean hasChapters;
}
