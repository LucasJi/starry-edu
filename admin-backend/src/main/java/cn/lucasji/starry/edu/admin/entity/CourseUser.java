package cn.lucasji.starry.edu.admin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author lucas
 * @date 2024/2/4 22:03
 */
@Entity
@Table(name = "course_user")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseUser {

  @Id
  @GeneratedValue(
    strategy = GenerationType.IDENTITY
  )
  private Long id;

  @Column(name = "user_id")
  private Long userId;

  @Column(name = "course_id")
  private Long courseId;
}
