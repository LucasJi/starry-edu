package cn.lucasji.starry.edu.admin.entity;

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
 * @date 2024/1/9 17:03
 */
@Entity
@Table(name = "course_department")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseDepartment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "course_id", referencedColumnName = "id")
  private Course course;

  @ManyToOne
  @JoinColumn(name = "department_id", referencedColumnName = "id")
  private Department department;
}
