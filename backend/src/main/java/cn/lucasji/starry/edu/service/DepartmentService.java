package cn.lucasji.starry.edu.service;

import cn.lucasji.starry.edu.entity.Department;
import cn.lucasji.starry.edu.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * @author Lucas Ji
 * @date 2023/8/31 14:55
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentService {

  private final DepartmentRepository departmentRepository;

  public void add(Department department) {
    departmentRepository.save(department);
  }

  public List<Department> findAll() {
    return departmentRepository.findAll();
  }

  public List<Department> findAllByIdIn(Set<Long> ids) {
    return departmentRepository.findAllByIdIn(ids);
  }

  public List<Department> getTree() {
    List<Department> all = findAll();
    List<Department> result = new ArrayList<>();

    Deque<Department> deque = new LinkedList<>(all);
    while (!deque.isEmpty()) {
      Department last = deque.pollLast();

      Department found;
      if (Objects.isNull(last.getParentId())) {
        result.add(last);
      } else if (Objects.nonNull((found = dfs(result, last.getParentId())))) {
        List<Department> children = found.getChildren();
        children.add(last);
      } else {
        deque.addFirst(last);
      }
    }

    return result;
  }

  private Department dfs(List<Department> departmentDtos, Long id) {
    Department result;
    for (Department e : departmentDtos) {
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

  public List<Department> updateParentId(Department departmentDto) {
    Optional<Department> optionalDepartment =
      departmentRepository.findById(departmentDto.getId());
    if (optionalDepartment.isEmpty()) {
      log.info("can not find department with id [{}]", departmentDto.getId());
      return getTree();
    }

    Department department = optionalDepartment.get();

    log.info(
      "updateAll parent id of department [id:{}] from {} to {}",
      department.getId(),
      department.getParentId(),
      departmentDto.getParentId());

    department.setParentId(departmentDto.getParentId());
    Department saved = departmentRepository.saveAndFlush(department);

    log.info("updated department:{}", saved);

    return getTree();
  }

  public void delete(Long departmentId) {
    Department department = deletable(departmentId);

    if (!department.isDeletable()) {
      return;
    }

    departmentRepository.deleteById(departmentId);
  }

  public Department deletable(Long departmentId) {
    long count =
      departmentRepository.count(Example.of(Department.builder().parentId(departmentId).build()));
    log.info("department {} contains {} sub-categories", departmentId, count);

    return Department.builder().subDepartmentCount(count).build();
  }

  public boolean update(Department departmentDto) {
    Optional<Department> byId = departmentRepository.findById(departmentDto.getId());
    if (byId.isEmpty()) {
      log.error("department {} doesn't exit", departmentDto);
      return false;
    }

    Department department = byId.get();

    department.setParentId(departmentDto.getParentId());
    department.setName(departmentDto.getName());

    departmentRepository.save(department);

    return true;
  }

  /**
   * Whether compared department is child of the current department.
   *
   * @param currentId  current department id
   * @param comparedId compared department id
   * @return true if current department belongs to the compared else false
   */
  public boolean isChild(Long currentId, Long comparedId) {
    if (Objects.equals(currentId, comparedId)) {
      return false;
    }

    List<Department> entireTree = getTree();
    Department currentDepartment = dfs(entireTree, currentId);

    if (Objects.isNull(currentDepartment)) {
      return false;
    }

    Department comparedDepartment = dfs(currentDepartment.getChildren(), comparedId);

    return Objects.nonNull(comparedDepartment);
  }

  public long count() {
    return departmentRepository.count();
  }
}
