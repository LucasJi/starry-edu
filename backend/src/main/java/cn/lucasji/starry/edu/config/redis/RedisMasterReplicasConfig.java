package cn.lucasji.starry.edu.config.redis;

import io.lettuce.core.ReadFrom;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisStaticMasterReplicaConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

/**
 * @author lucas
 * @date 2024/3/4 22:11
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "redis")
@Profile("prod")
public class RedisMasterReplicasConfig {

  private RedisProperties master;
  private List<RedisProperties> replicas;
  @Value("${spring.data.redis.password}")
  private String redisPassword;

  @Bean
  public LettuceConnectionFactory redisConnectionFactory() {
    LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
      .readFrom(ReadFrom.REPLICA_PREFERRED)
      .build();
    RedisStaticMasterReplicaConfiguration staticMasterReplicaConfiguration =
      new RedisStaticMasterReplicaConfiguration(master.getHost(), master.getPort());
    getReplicas().forEach(
      replica -> staticMasterReplicaConfiguration.addNode(replica.getHost(), replica.getPort()));
    staticMasterReplicaConfiguration.setPassword(redisPassword);
    return new LettuceConnectionFactory(staticMasterReplicaConfiguration, clientConfig);
  }

  @Getter
  @Setter
  private static class RedisProperties {

    private String host;
    private int port;
  }
}
