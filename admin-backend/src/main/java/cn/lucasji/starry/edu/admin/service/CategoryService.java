package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.entity.Category;
import cn.lucasji.starry.edu.admin.repository.CategoryRepository;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

/**
 * @author lucas
 * @date 2023/8/31 14:55
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
  private final CategoryRepository categoryRepository;

  public void add(Category category) {
    categoryRepository.save(category);
  }

  public List<Category> findAll() {
    return categoryRepository.findAll();
  }

  public List<Category> getTree() {
    List<Category> all = findAll();
    List<Category> result = new ArrayList<>();

    Deque<Category> deque = new LinkedList<>(all);
    while (!deque.isEmpty()) {
      Category last = deque.pollLast();

      Category found;
      if (Objects.isNull(last.getParentId())) {
        result.add(last);
      } else if (Objects.nonNull((found = dfs(result, last.getParentId())))) {
        List<Category> children = found.getChildren();
        children.add(last);
      } else {
        deque.addFirst(last);
      }
    }

    return result;
  }

  private Category dfs(List<Category> categoryDtos, Long id) {
    Category result;
    for (Category e : categoryDtos) {
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

  public List<Category> updateParentId(Category categoryDto) {
    Optional<Category> optionalCategory = categoryRepository.findById(categoryDto.getId());
    if (optionalCategory.isEmpty()) {
      log.info("can not find category with id [{}]", categoryDto.getId());
      return getTree();
    }

    Category category = optionalCategory.get();

    log.info(
        "updateAll parent id of category [id:{}] from {} to {}",
        category.getId(),
        category.getParentId(),
        categoryDto.getParentId());

    category.setParentId(categoryDto.getParentId());
    Category saved = categoryRepository.saveAndFlush(category);

    log.info("updated category:{}", saved);

    return getTree();
  }

  public void delete(Long categoryId) {
    Category category = deletable(categoryId);

    if (!category.isDeletable()) {
      return;
    }

    categoryRepository.deleteById(categoryId);
  }

  public Category deletable(Long categoryId) {
    long count =
        categoryRepository.count(Example.of(Category.builder().parentId(categoryId).build()));
    log.info("category {} contains {} sub-categories", categoryId, count);

    return Category.builder().subCategoryCount(count).build();
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
   * @param currentId current category id
   * @param comparedId compared category id
   * @return true if current category belongs to the compared else false
   */
  public boolean isChild(Long currentId, Long comparedId) {
    if (Objects.equals(currentId, comparedId)) {
      return false;
    }

    List<Category> entireTree = getTree();
    Category currentCategory = dfs(entireTree, currentId);

    if (Objects.isNull(currentCategory)) {
      return false;
    }

    Category comparedCategory = dfs(currentCategory.getChildren(), comparedId);

    return Objects.nonNull(comparedCategory);
  }
}
