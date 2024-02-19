package cn.lucasji.starry.edu.admin.entity.mediate;

import cn.lucasji.starry.edu.admin.entity.Course;
import cn.lucasji.starry.edu.admin.entity.StorageObj;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author lucas
 * @date 2024/1/19 10:58
 */
@Entity
@Table(name = "course_courseware")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseCourseware {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "course_id", referencedColumnName = "id")
  private Course course;

  @ManyToOne
  @JoinColumn(name = "courseware_id", referencedColumnName = "id")
  private StorageObj storageObj;

  // order为保留词
  @Column(name = "\"order\"")
  private Integer order;
}
