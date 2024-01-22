package cn.lucasji.starry.edu.admin.repository;

import cn.lucasji.starry.edu.admin.entity.Category;
import cn.lucasji.starry.edu.admin.entity.StorageObj;
import cn.lucasji.starry.edu.admin.modal.StorageObjType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author lucas
 * @date 2023/12/16 11:22
 */
public interface StorageObjRepository extends JpaRepository<StorageObj, Long> {

  Optional<StorageObj> findByNameAndCategory(String name, Category category);

  Page<StorageObj> findAllByCategoryAndIsUploadedIsTrueAndNameLikeIgnoreCaseAndTypeIn(
    Category category, String name, List<StorageObjType> types, Pageable pageable);

  Page<StorageObj> findAllByCategoryIsNullAndIsUploadedIsTrueAndNameLikeIgnoreCaseAndTypeIn(
    String name, List<StorageObjType> types, Pageable pageable);

  Page<StorageObj> findAllByIsUploadedIsTrueAndNameLikeIgnoreCaseAndTypeIn(
    String name, List<StorageObjType> types, Pageable pageable);

  void findAllByIdIn(List<Long> ids);
}
