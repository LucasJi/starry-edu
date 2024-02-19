package cn.lucasji.starry.edu.admin.mapper;

import cn.lucasji.starry.edu.admin.dto.StorageObjDto;
import cn.lucasji.starry.edu.admin.entity.StorageObj;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/2/5 10:44
 */
@Mapper(
  componentModel = "spring",
  unmappedSourcePolicy = ReportingPolicy.IGNORE,
  unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StorageObjMapper {

  StorageObjDto convertToStorageObjDto(StorageObj storageObj);

  List<StorageObjDto> convertToStorageObjDtoList(List<StorageObj> storageObjs);
}
