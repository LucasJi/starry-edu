package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.dto.CategoryDto;
import cn.lucasji.starry.edu.admin.dto.req.UpdateCategoryParentIdReq;
import cn.lucasji.starry.edu.admin.entity.Category;
import cn.lucasji.starry.edu.admin.mapper.CategoryMapper;
import cn.lucasji.starry.edu.admin.repository.CategoryRepository;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

/**
 * @author Lucas Ji
 * @date 2023/8/31 14:55
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

  private final CategoryRepository categoryRepository;

  private final CategoryMapper categoryMapper;

  public void add(Category category) {
    categoryRepository.save(category);
  }

  public List<Category> findAll() {
    return categoryRepository.findAll();
  }

  public List<CategoryDto> getTree() {
    List<Category> all = findAll();
    List<CategoryDto> categoryDtos = categoryMapper.convertListToCategoryDtoList(all);

    List<CategoryDto> result = new ArrayList<>();
    Deque<CategoryDto> deque = new LinkedList<>(categoryDtos);
    while (!deque.isEmpty()) {
      CategoryDto last = deque.pollLast();

      CategoryDto found;
      if (Objects.isNull(last.getParentId())) {
        result.add(last);
      } else if (Objects.nonNull((found = dfs(result, last.getParentId())))) {
        List<CategoryDto> children = found.getChildren();
        children.add(last);
      } else {
        deque.addFirst(last);
      }
    }

    return result;
  }

  private CategoryDto dfs(List<CategoryDto> categoryDtos, Long id) {
    CategoryDto result;
    for (CategoryDto e : categoryDtos) {
      if (Objects.equals(e.getId(), id)) {
        return e;
      }

      if (CollectionUtils.isNotEmpty(e.getChildren())) {
        result = dfs(e.getChildren(), id);

        if (Objects.nonNull(result)) {
          return result;
        }
      }
    }

    return null;
  }

  public List<CategoryDto> updateParentId(UpdateCategoryParentIdReq body) {
    Optional<Category> optionalCategory = categoryRepository.findById(body.getId());
    if (optionalCategory.isEmpty()) {
      log.info("can not find category with id [{}]", body.getId());
      return getTree();
    }

    Category category = optionalCategory.get();

    log.info(
      "updateAll parent id of category [id:{}] from {} to {}",
      category.getId(),
      category.getParentId(),
      body.getParentId());

    category.setParentId(body.getParentId());
    Category saved = categoryRepository.saveAndFlush(category);

    log.info("updated category:{}", saved);

    return getTree();
  }

  public void delete(Long categoryId) {
    Integer subCount = deletable(categoryId);

    if (subCount > 0) {
      log.warn(
        "Category with id {} has {} sub categories, can not be deleted", categoryId, subCount);
      return;
    }

    categoryRepository.deleteById(categoryId);
  }

  public Integer deletable(Long categoryId) {
    long count =
      categoryRepository.count(Example.of(Category.builder().parentId(categoryId).build()));
    log.info("category {} contains {} sub-categories", categoryId, count);

    return Math.toIntExact(count);
  }

  public boolean update(Category categoryDto) {
    Optional<Category> byId = categoryRepository.findById(categoryDto.getId());
    if (byId.isEmpty()) {
      log.error("category {} doesn't exit", categoryDto);
      return false;
    }

    Category category = byId.get();

    category.setParentId(categoryDto.getParentId());
    category.setName(categoryDto.getName());

    categoryRepository.save(category);

    return true;
  }

  /**
   * Whether compared category is child of the current category.
   *
   * @param currentId  current category id
   * @param comparedId compared category id
   * @return true if current category belongs to the compared else false
   */
  public boolean isChild(Long currentId, Long comparedId) {
    if (Objects.equals(currentId, comparedId)) {
      return false;
    }

    List<CategoryDto> entireTree = getTree();
    CategoryDto currentCategory = dfs(entireTree, currentId);

    if (Objects.isNull(currentCategory)) {
      return false;
    }

    CategoryDto comparedCategory = dfs(currentCategory.getChildren(), comparedId);

    return Objects.nonNull(comparedCategory);
  }

  public Category findById(Long id) {
    return categoryRepository.findById(id).orElseThrow(() -> new NoSuchElementException(
      STR."No category present with id:\{id}"));
  }
}
