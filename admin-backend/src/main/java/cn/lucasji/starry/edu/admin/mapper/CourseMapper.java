package cn.lucasji.starry.edu.admin.mapper;

import cn.lucasji.starry.edu.admin.dto.CourseDto;
import cn.lucasji.starry.edu.admin.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * @author jiwh
 * @date 2024/2/4 15:35
 */
@Mapper(
  componentModel = "spring",
  unmappedSourcePolicy = ReportingPolicy.IGNORE,
  unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CourseMapper {

  CourseDto convertToCourseDto(Course course);

  List<CourseDto> convertToCourseDtoList(List<Course> courses);
}
