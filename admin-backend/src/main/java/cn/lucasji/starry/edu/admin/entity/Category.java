package cn.lucasji.starry.edu.admin.entity;

import cn.lucas.starry.infrastructure.entity.BaseEntityAudit;
import com.fasterxml.jackson.annotation.JsonProperty;
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

  @Transient
  @JsonProperty
  private List<Category> children = new ArrayList<>();

  @Transient
  @JsonProperty
  private long subCategoryCount;

  /**
   * @return <code>true</code> if current category doesn't have any sub categories otherwise <code>
   * false</code>
   */
  public boolean isDeletable() {
    return subCategoryCount <= 0;
  }
}
