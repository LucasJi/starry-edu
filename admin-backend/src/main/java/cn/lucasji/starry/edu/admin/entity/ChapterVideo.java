package cn.lucasji.starry.edu.admin.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode.Exclude;
import lombok.ToString;

/**
 * @author lucas
 * @date 2024/1/15 21:34
 */
@Entity
@Table(name = "chapter_video")
@Data
public class ChapterVideo implements Serializable {

  @Serial
  private static final long serialVersionUID = 3789061344098342833L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "video_id", referencedColumnName = "id")
  private StorageObj video;

  @ManyToOne
  @JoinColumn(name = "chapter_id", referencedColumnName = "id")
  @JsonIgnoreProperties(value = {"chapterVideos"})
  @Exclude
  @ToString.Exclude
  private Chapter chapter;

  // order为保留词
  @Column(name = "\"order\"")
  private Integer order;
}
