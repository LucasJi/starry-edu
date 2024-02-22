package cn.lucasji.starry.edu.mapper;

import cn.lucasji.starry.edu.dto.CategoryDto;
import cn.lucasji.starry.edu.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/2/3 21:14
 */
@Mapper(
  componentModel = "spring",
  unmappedSourcePolicy = ReportingPolicy.IGNORE,
  unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

  CategoryDto convertToCategoryDto(Category category);

  List<CategoryDto> convertListToCategoryDtoList(List<Category> categories);
}
