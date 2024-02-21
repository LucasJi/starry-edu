package cn.lucasji.starry.edu.admin.entity;

import cn.lucasji.starry.idp.infrastructure.entity.BaseEntityAudit;
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
 * @date 2024/2/6 9:21
 */
@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "study_record", schema = "public")
public class StudyRecord extends BaseEntityAudit {

  @Serial
  private static final long serialVersionUID = 6375270682833547648L;

  private Long userId;

  private Long chapterId;

  private Long videoId;

  private Boolean completed;

  private Double duration;
}
