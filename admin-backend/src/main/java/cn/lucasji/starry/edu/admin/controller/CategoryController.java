package cn.lucasji.starry.edu.admin.controller;

import cn.lucasji.starry.edu.admin.entity.Category;
import cn.lucasji.starry.edu.admin.service.CategoryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author lucas
 * @date 2023/8/31 15:13
 */
@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryService categoryService;

  @PostMapping
  public ResponseEntity<Void> add(@RequestBody Category category) {
    categoryService.add(category);

    return ResponseEntity.ok().build();
  }

  @GetMapping
  public ResponseEntity<List<Category>> findAll() {
    List<Category> all = categoryService.findAll();
    return ResponseEntity.ok(all);
  }

  @GetMapping("/tree")
  public ResponseEntity<List<Category>> getTree() {
    List<Category> tree = categoryService.getTree();
    return ResponseEntity.ok(tree);
  }

  @PatchMapping("/parentId")
  public ResponseEntity<List<Category>> updateParentId(@RequestBody Category category) {
    List<Category> categoryDtos = categoryService.updateParentId(category);
    return ResponseEntity.ok(categoryDtos);
  }

  @DeleteMapping("/{categoryId}")
  public ResponseEntity<Void> delete(@PathVariable Long categoryId) {
    categoryService.delete(categoryId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{categoryId}/deletable")
  public ResponseEntity<Category> deletable(@PathVariable Long categoryId) {
    Category result = categoryService.deletable(categoryId);
    return ResponseEntity.ok(result);
  }

  @PatchMapping
  public ResponseEntity<Boolean> update(@RequestBody Category category) {
    boolean result = categoryService.update(category);
    return ResponseEntity.ok(result);
  }

  @GetMapping("/isChild")
  public ResponseEntity<Boolean> isChild(
      @RequestParam("currentId") Long currentId,
      @RequestParam("comparedId") Long comparedId) {
    boolean result = categoryService.isChild(currentId, comparedId);
    return ResponseEntity.ok(result);
  }
}
