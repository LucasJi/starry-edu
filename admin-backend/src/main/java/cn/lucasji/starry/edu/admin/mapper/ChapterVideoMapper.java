package cn.lucasji.starry.edu.admin.mapper;

import cn.lucasji.starry.edu.admin.dto.ChapterVideoDto;
import cn.lucasji.starry.edu.admin.entity.ChapterVideo;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * @author jiwh
 * @date 2024/2/5 10:45
 */
@Mapper(
  componentModel = "spring",
  unmappedSourcePolicy = ReportingPolicy.IGNORE,
  unmappedTargetPolicy = ReportingPolicy.IGNORE,
  uses = {StorageObjMapper.class})
public interface ChapterVideoMapper {

  ChapterVideoDto convertToChapterVideoDto(ChapterVideo cv);

  List<ChapterVideo> convertToChapterVideoDtoList(List<ChapterVideo> cvs);
}
