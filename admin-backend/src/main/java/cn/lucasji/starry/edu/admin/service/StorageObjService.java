package cn.lucasji.starry.edu.admin.service;

import cn.lucasji.starry.edu.admin.config.props.StorageObjProps;
import cn.lucasji.starry.edu.admin.entity.Category;
import cn.lucasji.starry.edu.admin.entity.StorageObj;
import cn.lucasji.starry.edu.admin.modal.StarryMinioClient;
import cn.lucasji.starry.edu.admin.modal.StorageObjType;
import cn.lucasji.starry.edu.admin.dto.Part;
import cn.lucasji.starry.edu.admin.dto.resp.CreateUploadResp;
import cn.lucasji.starry.edu.admin.repository.StorageObjRepository;
import cn.lucasji.starry.idp.infrastructure.api.UserClient;
import cn.lucasji.starry.idp.infrastructure.dto.UserDto;
import cn.lucasji.starry.idp.infrastructure.util.JsonUtils;
import io.minio.GetObjectResponse;
import io.minio.ObjectWriteResponse;
import io.minio.StatObjectResponse;
import io.minio.messages.ListPartsResult;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author lucas
 * @date 2023/12/16 11:22
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class StorageObjService {

  private final StarryMinioClient minioClient;
  private final RedissonClient redissonClient;
  private final StorageObjRepository storageObjRepository;
  private final UserClient idpUserClient;
  private final StorageObjProps storageObjProps;

  public CreateUploadResp createUpload(StorageObj storageObj) {
    StorageObj record;
    // 尝试从数据库中获取上传记录
    Optional<StorageObj> optionalStorageObj =
      storageObjRepository.findByNameAndCategory(storageObj.getName(), storageObj.getCategory());
    record = optionalStorageObj.orElseGet(() -> storageObjRepository.save(storageObj));

    if (record.isUploaded()) {
      log.info("Object {} is already uploaded, skip uploading", record);
      return CreateUploadResp.builder().uploaded(true).build();
    }

    Optional<StatObjectResponse> statObjectResponse = minioClient.statObject(
      getObjectName(record));
    if (statObjectResponse.isPresent()) {
      record.setUploaded(true);
      storageObjRepository.save(record);
      log.info(
        "Object already exists in minio, mark object {} as uploaded, skip uploading", record);
      return CreateUploadResp.builder().uploaded(true).build();
    }

    if (StringUtils.isEmpty(record.getUploadId())) {
      String uploadId = minioClient.createMultipartUpload(getObjectName(record));
      record.setUploadId(uploadId);
      storageObjRepository.save(record);
      log.info("Create multipart upload id {} for object {}", uploadId, record);
    }

    ListPartsResult result =
      minioClient.listParts(getObjectName(record), record.getUploadId()).result();
    log.info("已上传parts:{}", result.partList());

    return CreateUploadResp.builder()
      .uploaded(false)
      .objId(record.getId())
      .partList(result.partList().stream().map(Part::new).collect(Collectors.toList()))
      .build();
  }

  public void upload(Long objId, MultipartFile part, int partNumber) {
    StorageObj storageObj = findById(objId);
    minioClient.uploadPart(getObjectName(storageObj), part, storageObj.getUploadId(), partNumber);
  }

  public void completeMultipartUpload(Long objId) {
    StorageObj storageObj = findById(objId);
    ListPartsResult result =
      minioClient.listParts(getObjectName(storageObj), storageObj.getUploadId()).result();
    log.info("已上传parts:{}", JsonUtils.objectCovertToJson(result.partList()));
    ObjectWriteResponse objectWriteResponse =
      minioClient.completeMultipartUpload(
        getObjectName(storageObj),
        storageObj.getUploadId(),
        result.partList().toArray(new io.minio.messages.Part[0]));
    log.info("Complete multipart upload resp:{}", objectWriteResponse);

    storageObj.setUploaded(true);
    storageObjRepository.save(storageObj);
  }

  private String getObjectName(Long objId) {
    return getObjectName(findById(objId));
  }

  private String getObjectName(StorageObj obj) {
    String name = obj.getName();
    int dotIdx = name.lastIndexOf(".");
    String extension = name.substring(dotIdx);
    return STR."\{obj.getType()}/\{obj.getMd5()}\{extension}";
  }

  public StorageObj findById(Long id) {
    return storageObjRepository
      .findById(id)
      .orElseThrow(() -> new NoSuchElementException(STR."Could not find object with id \{id}"));
  }

  private void applyCreatorNameToObjects(List<StorageObj> storageObjs) {
    List<Long> creatorIds =
      storageObjs.stream().map(StorageObj::getCreatorId).collect(Collectors.toList());
    Map<Long, UserDto> idUserMap = idpUserClient.getIdUserMapByUserIds(creatorIds);
    for (StorageObj obj : storageObjs) {
      obj.setCreatorName(idUserMap.get(obj.getCreatorId()).getUsername());
    }
  }

  public Page<StorageObj> findPageByCategoryAndNameAndTypeIn(
    Category category, String name, List<StorageObjType> types, Pageable pageable) {
    Page<StorageObj> result;
    String like = STR."%\{name}%";
    // Find all videos by name
    if (Objects.isNull(category.getId())) {
      result =
        storageObjRepository.findAllByIsUploadedIsTrueAndNameLikeIgnoreCaseAndTypeIn(
          like, types, pageable);
      // Find all uncategorized videos by name
    } else if (category.getId() < 0) {
      result =
        storageObjRepository
          .findAllByCategoryIsNullAndIsUploadedIsTrueAndNameLikeIgnoreCaseAndTypeIn(
            like, types, pageable);
      // Find videos by category by name
    } else {
      result =
        storageObjRepository.findAllByCategoryAndIsUploadedIsTrueAndNameLikeIgnoreCaseAndTypeIn(
          category, like, types, pageable);
    }

    applyCreatorNameToObjects(result.getContent());

    return result;
  }

  public void deleteAllByIdInBatch(List<Long> ids) {
    storageObjRepository.deleteAllByIdInBatch(ids);
  }

  public void updateCategoryAndName(StorageObj storageObj) {
    StorageObj entity = findById(storageObj.getId());
    entity.setName(storageObj.getName());
    entity.setCategory(storageObj.getCategory());
    storageObjRepository.save(storageObj);
  }

  public String getPreviewUrl(Long objId) {
    StorageObj object = findById(objId);
    String objectName = getObjectName(object);
    RBucket<String> bucket = redissonClient.getBucket(STR."previewUrl:\{objectName}");
    if (bucket.isExists()) {
      log.info("Get preview url of object {} from cache", objectName);
      return bucket.get();
    }

    String previewUrl = minioClient.getPreviewUrl(objectName);
    bucket.set(previewUrl);
    bucket.expire(Duration.ofDays(1));
    return previewUrl;
  }

  public StorageObjType getStorageObjTypeFromFileType(String fileType) {
    for (Entry<StorageObjType, List<String>> entry :
      storageObjProps.getObjTypeFileTypes().entrySet()) {
      if (entry.getValue().contains(fileType)) {
        return entry.getKey();
      }
    }

    return null;
  }

  public void download(Long objId, HttpServletResponse response) {
    StorageObj storageObj = findById(objId);
    String objectName = getObjectName(storageObj);
    GetObjectResponse object = minioClient.getObject(objectName);
    byte[] buf = new byte[1024];
    int length;

    response.setHeader(
      "Content-Disposition",
      STR."attachment;filename=\{URLEncoder.encode(storageObj.getName(), StandardCharsets.UTF_8)}");
    response.setContentType("application/octet-stream");
    response.setCharacterEncoding(StandardCharsets.UTF_8.name());

    try {
      while ((length = object.read(buf)) != -1) {
        response.getOutputStream().write(buf, 0, length);
      }
    } catch (Exception e) {
      log.error("Download object {} failed", objectName, e);
    }
  }

  public List<StorageObj> findAllByIdIn(List<Long> ids) {
    return storageObjRepository.findAllById(ids);
  }
}
