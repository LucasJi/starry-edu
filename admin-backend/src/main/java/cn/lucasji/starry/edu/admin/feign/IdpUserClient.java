package cn.lucasji.starry.edu.admin.feign;

import cn.lucas.starry.infrastructure.entity.idp.User;
import cn.lucas.starry.infrastructure.modal.Result;
import java.util.List;
import java.util.Map;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * @author lucas
 * @date 2023/10/31 01:06
 */
@FeignClient(name = "idp", url = "${local.idp.url:}", path = "/user")
public interface IdpUserClient {

  @GetMapping(path = "/{id}")
  User findById(@PathVariable Long id);

  @PostMapping("/idUserMap")
  Map<Long, User> getIdUserMapByUserIds(@RequestBody List<Long> ids);

  @PostMapping("/findPageByUserIdIn")
  Page<User> findPageByUserIdIn(@RequestBody List<Long> userIds, Pageable pageable);

  @PostMapping("/addUser")
  Result<User> addUser(@RequestBody User user);

  @PostMapping("/updateUser")
  Result<String> updateUser(@RequestBody User user);

  @DeleteMapping("/deleteUser/{id}")
  Result<String> deleteUser(@PathVariable Long id);
}
