package cn.lucasji.starry.edu.entity;

import cn.lucasji.starry.edu.modal.StorageObjType;
import cn.lucasji.starry.idp.infrastructure.entity.BaseEntityAudit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serial;

/**
 * @author Lucas Ji
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
