package cn.lucasji.starry.edu.admin.mapper;

import cn.lucasji.starry.edu.admin.dto.CategoryDto;
import cn.lucasji.starry.edu.admin.entity.Category;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * @author lucas
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
