package cn.lucasji.starry.edu.mapper;

import cn.lucasji.starry.edu.dto.ChapterDto;
import cn.lucasji.starry.edu.entity.Chapter;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/2/5 10:41
 */
@Mapper(
  componentModel = "spring",
  unmappedSourcePolicy = ReportingPolicy.IGNORE,
  unmappedTargetPolicy = ReportingPolicy.IGNORE,
  uses = {ChapterVideoMapper.class})
public interface ChapterMapper {

  ChapterDto convertToChapterDto(Chapter chapter);

  List<ChapterDto> convertToChapterDtoList(List<Chapter> chapters);

}
