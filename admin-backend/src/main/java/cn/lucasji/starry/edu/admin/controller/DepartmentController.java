package cn.lucasji.starry.edu.admin.controller;

import cn.lucasji.starry.edu.admin.entity.Department;
import cn.lucasji.starry.edu.admin.service.DepartmentService;
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
@RequestMapping("/department")
@RequiredArgsConstructor
public class DepartmentController {

  private final DepartmentService departmentService;

  @PostMapping
  public ResponseEntity<Void> add(@RequestBody Department department) {
    departmentService.add(department);

    return ResponseEntity.ok().build();
  }

  @GetMapping
  public ResponseEntity<List<Department>> findAll() {
    List<Department> all = departmentService.findAll();
    return ResponseEntity.ok(all);
  }

  @GetMapping("/tree")
  public ResponseEntity<List<Department>> getTree() {
    List<Department> tree = departmentService.getTree();
    return ResponseEntity.ok(tree);
  }

  @PatchMapping("/parentId")
  public ResponseEntity<List<Department>> updateParentId(@RequestBody Department department) {
    List<Department> departmentDtos = departmentService.updateParentId(department);
    return ResponseEntity.ok(departmentDtos);
  }

  @DeleteMapping("/{departmentId}")
  public ResponseEntity<Void> delete(@PathVariable Long departmentId) {
    departmentService.delete(departmentId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{departmentId}/deletable")
  public ResponseEntity<Department> deletable(@PathVariable Long departmentId) {
    Department result = departmentService.deletable(departmentId);
    return ResponseEntity.ok(result);
  }

  @PatchMapping
  public ResponseEntity<Boolean> update(@RequestBody Department department) {
    boolean result = departmentService.update(department);
    return ResponseEntity.ok(result);
  }

  @GetMapping("/isChild")
  public ResponseEntity<Boolean> isChild(
      @RequestParam("currentId") Long currentId,
      @RequestParam("comparedId") Long comparedId) {
    boolean result = departmentService.isChild(currentId, comparedId);
    return ResponseEntity.ok(result);
  }
}
