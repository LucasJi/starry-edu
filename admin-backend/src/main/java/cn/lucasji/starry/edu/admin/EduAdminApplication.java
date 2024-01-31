package cn.lucasji.starry.edu.admin;

import cn.lucasji.starry.idp.infrastructure.api.UserClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @author lucas
 * @date 2023/8/25 15:59
 */
@SpringBootApplication
@EnableFeignClients(clients = {UserClient.class})
public class EduAdminApplication {

  public static void main(String[] args) {
    SpringApplication.run(EduAdminApplication.class, args);
  }
}
