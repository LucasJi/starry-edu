package cn.lucasji.starry.edu.admin.entity;

import cn.lucas.starry.infrastructure.entity.BaseEntityAudit;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.io.Serial;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.EqualsAndHashCode.Exclude;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;

/**
 * @author lucas
 * @date 2023/12/21 13:41
 */
@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "chapter", schema = "public")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class Chapter extends BaseEntityAudit {

  @Serial private static final long serialVersionUID = 9197928578158095839L;

  @Column(name = "name")
  private String name;

  // order为保留词
  @Column(name = "\"order\"")
  private Integer order;

  @OneToMany(
      mappedBy = "chapter",
      fetch = FetchType.EAGER,
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      targetEntity = ChapterVideo.class)
  @JsonIgnoreProperties(value = {"chapter"})
  @Access(AccessType.PROPERTY)
  @Exclude
  @ToString.Exclude
  private List<ChapterVideo> chapterVideos;

  @ManyToOne
  @JoinColumn(name = "course_id", referencedColumnName = "id")
  private Course course;

  public void setChapterVideos(List<ChapterVideo> chapterVideos) {
    if (Objects.nonNull(chapterVideos)) {
      chapterVideos.forEach(chapterVideo -> chapterVideo.setChapter(this));
    }
    this.chapterVideos = chapterVideos;
  }

  public List<ChapterVideo> getChapterVideos() {
    if (Objects.nonNull(chapterVideos)) {
      chapterVideos.sort(Comparator.comparing(ChapterVideo::getOrder));
    }
    return chapterVideos;
  }
}
