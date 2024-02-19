package cn.lucasji.starry.edu.admin.modal;

import static cn.lucasji.starry.edu.admin.config.MinioConfiguration.EDU_BUCKET;

import cn.lucasji.starry.idp.infrastructure.util.JsonUtils;
import io.minio.CreateMultipartUploadResponse;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.ListPartsResponse;
import io.minio.MinioAsyncClient;
import io.minio.ObjectWriteResponse;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import io.minio.UploadPartResponse;
import io.minio.http.Method;
import io.minio.messages.InitiateMultipartUploadResult;
import io.minio.messages.Part;
import java.time.Duration;
import java.util.Optional;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Lucas Ji
 * @date 2023/12/12 20:36
 */
@Slf4j
public class StarryMinioClient extends MinioAsyncClient {
  public StarryMinioClient(MinioAsyncClient client) {
    super(client);
  }

  @SneakyThrows
  public String createMultipartUpload(String objectName) {
    String uploadId;
    // 创建分片上传任务
    CreateMultipartUploadResponse createMultipartUploadResponse =
        super.createMultipartUploadAsync(EDU_BUCKET, null, objectName, null, null).get();

    InitiateMultipartUploadResult uploadResult = createMultipartUploadResponse.result();
    uploadId = uploadResult.uploadId();
    log.info("文件上传任务: {}", JsonUtils.objectCovertToJson(uploadResult));

    return uploadId;
  }

  @SneakyThrows
  public ObjectWriteResponse completeMultipartUpload(
      String objectName, String uploadId, Part[] parts) {
    return super.completeMultipartUploadAsync(
            EDU_BUCKET, null, objectName, uploadId, parts, null, null)
        .get();
  }

  @SneakyThrows
  public ListPartsResponse listParts(String objectName, String uploadId) {
    return super.listPartsAsync(EDU_BUCKET, null, objectName, null, null, uploadId, null, null)
        .get();
  }

  @SneakyThrows
  public UploadPartResponse uploadPart(
      String objectName, MultipartFile part, String uploadId, int partNumber) {
    return super.uploadPartAsync(
            EDU_BUCKET,
            null,
            objectName,
            part.getInputStream(),
            part.getSize(),
            uploadId,
            partNumber,
            null,
            null)
        .get();
  }

  @SneakyThrows
  public void abortMultipartUpload(String objectName, String uploadId) {
    super.abortMultipartUploadAsync(EDU_BUCKET, null, objectName, uploadId, null, null);
  }

  @SneakyThrows
  public String getPreviewUrl(String objectName) {
    return super.getPresignedObjectUrl(
        GetPresignedObjectUrlArgs.builder()
            .bucket(EDU_BUCKET)
            .object(objectName)
            .method(Method.GET)
            .expiry((int) Duration.ofDays(1).toSeconds())
            .build());
  }

  public Optional<StatObjectResponse> statObject(String objectName) {
    try {
      return Optional.of(
          super.statObject(StatObjectArgs.builder().bucket(EDU_BUCKET).object(objectName).build())
              .get());
    } catch (Exception e) {
      return Optional.empty();
    }
  }

  @SneakyThrows
  public GetObjectResponse getObject(String objectName) {
    return super.getObject(GetObjectArgs.builder().bucket(EDU_BUCKET).object(objectName).build())
        .get();
  }
}
