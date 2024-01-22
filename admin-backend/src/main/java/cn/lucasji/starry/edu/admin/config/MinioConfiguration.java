package cn.lucasji.starry.edu.admin.config;

import cn.lucasji.starry.edu.admin.modal.StarryMinioClient;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioAsyncClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author lucas
 * @date 2023/10/24 13:17
 */
@Configuration
@Slf4j
public class MinioConfiguration {

  public static final String EDU_BUCKET = "edu";

  @Value("${minio.accessKey}")
  private String accessKey;

  @Value("${minio.secretKey}")
  private String secretKey;

  @Value("${minio.endpoint}")
  private String endpoint;

  @Bean
  public StarryMinioClient starryMinioClient() {
    try {
      MinioAsyncClient minioClient =
          MinioAsyncClient.builder().credentials(accessKey, secretKey).endpoint(endpoint).build();
      BucketExistsArgs bucketExistsArgs =
          BucketExistsArgs.builder().bucket(EDU_BUCKET).build();
      log.info("minio region:{}", bucketExistsArgs.region());
      boolean found = minioClient.bucketExists(bucketExistsArgs).get();
      if (!found) {
        log.info("Bucket {} not found, creating it", EDU_BUCKET);
        minioClient.makeBucket(MakeBucketArgs.builder().bucket(EDU_BUCKET).build());
      } else {
        log.info("Bucket {} already exists", EDU_BUCKET);
      }

      return new StarryMinioClient(minioClient);
    } catch (Exception e) {
      final String errorMsg = "MinioClient init error";
      log.error(errorMsg, e);
      throw new BeanCreationException(errorMsg, e);
    }
  }
}
