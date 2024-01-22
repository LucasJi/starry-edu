package cn.lucasji.starry.edu.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @author lucas
 * @date 2023/8/25 15:59
 */
@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class EduAdminApplication {

  public static void main(String[] args) {
    SpringApplication.run(EduAdminApplication.class, args);
  }
}
