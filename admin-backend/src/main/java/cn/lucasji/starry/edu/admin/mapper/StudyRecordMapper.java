package cn.lucasji.starry.edu.admin.mapper;

import cn.lucasji.starry.edu.admin.dto.StudyRecordDto;
import cn.lucasji.starry.edu.admin.entity.StudyRecord;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * @author Lucas Ji
 * @date 2024/2/6 13:54
 */
@Mapper(
  componentModel = "spring",
  unmappedSourcePolicy = ReportingPolicy.IGNORE,
  unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface StudyRecordMapper {

  StudyRecordDto convertToStudyRecordDto(StudyRecord sr);
}
