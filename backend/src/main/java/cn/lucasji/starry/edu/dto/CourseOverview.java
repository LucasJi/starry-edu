package cn.lucasji.starry.edu.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author Lucas Ji
 * @date 2024/2/21 14:59
 */
@Getter
@Setter
public class CourseOverview implements Serializable {

  @Serial
  private static final long serialVersionUID = 8878927402083412458L;

  private Integer courseCount;

  private Integer completedCourseCount;

  private Integer dailyStudyDuration;

  private Integer studyDuration;
}
