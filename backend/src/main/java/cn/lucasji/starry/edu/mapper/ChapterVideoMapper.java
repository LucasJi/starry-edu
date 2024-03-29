package cn.lucasji.starry.edu.mapper;

import cn.lucasji.starry.edu.dto.ChapterVideoDto;
import cn.lucasji.starry.edu.entity.mediate.ChapterVideo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/2/5 10:45
 */
@Mapper(
  componentModel = "spring",
  unmappedSourcePolicy = ReportingPolicy.IGNORE,
  unmappedTargetPolicy = ReportingPolicy.IGNORE,
  uses = {StorageObjMapper.class})
public interface ChapterVideoMapper {

  @Mapping(target = "chapterId", source = "chapter.id")
  ChapterVideoDto convertToChapterVideoDto(ChapterVideo cv);

  List<ChapterVideo> convertToChapterVideoDtoList(List<ChapterVideo> cvs);
}
