package cn.lucasji.starry.edu.admin.entity;

import cn.lucas.starry.infrastructure.entity.BaseEntityAudit;
import cn.lucasji.starry.edu.admin.modal.StorageObjType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.io.Serial;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * @author lucas
 * @date 2023/12/16 11:03
 */
@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "storage_obj", schema = "public")
public class StorageObj extends BaseEntityAudit {

  @Serial
  private static final long serialVersionUID = 8114872980692654283L;

  @Column(name = "name")
  private String name;

  @Column(name = "size")
  private Long size;

  @Column(name = "upload_id")
  private String uploadId;

  @Column(name = "is_uploaded")
  private boolean isUploaded;

  @Column(name = "creator_id")
  private Long creatorId;

  @Column(name = "md5")
  private String md5;

  @JoinColumn(name = "category_id")
  @ManyToOne(fetch = FetchType.EAGER)
  private Category category;

  @Column(name = "type")
  @Enumerated(EnumType.STRING)
  private StorageObjType type;

  @Transient
  private String creatorName;
}
