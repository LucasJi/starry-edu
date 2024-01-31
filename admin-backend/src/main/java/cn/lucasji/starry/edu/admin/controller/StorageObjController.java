package cn.lucasji.starry.edu.admin.controller;

import cn.lucas.starry.infrastructure.util.AuthUtil;
import cn.lucasji.starry.edu.admin.dto.req.FindStorageObjPageReq;
import cn.lucasji.starry.edu.admin.dto.resp.CreateUploadResp;
import cn.lucasji.starry.edu.admin.entity.StorageObj;
import cn.lucasji.starry.edu.admin.modal.StorageObjType;
import cn.lucasji.starry.edu.admin.service.StorageObjService;
import cn.lucasji.starry.idp.infrastructure.modal.Result;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author lucas
 * @date 2023/12/16 12:52
 */
@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
@Slf4j
public class StorageObjController {

  private final StorageObjService storageObjService;

  @PostMapping("/createUpload")
  public ResponseEntity<Result<CreateUploadResp>> createUpload(
      @AuthenticationPrincipal Jwt jwt, @RequestBody StorageObj storageObj) {
    if (StringUtils.isEmpty(storageObj.getName()) || StringUtils.isEmpty(storageObj.getMd5())) {
      return ResponseEntity.badRequest().body(Result.error("video name or md5 is empty"));
    }

    storageObj.setCreatorId(AuthUtil.getUserIdFromJwt(jwt));

    CreateUploadResp createUploadResp = storageObjService.createUpload(storageObj);

    return ResponseEntity.ok(Result.success(createUploadResp));
  }

  @GetMapping("/getStorageObjTypeFromFileType")
  public StorageObjType getStorageObjTypeFromFileType(@RequestParam String fileType) {
    return storageObjService.getStorageObjTypeFromFileType(fileType);
  }

  @PostMapping("/upload")
  public void upload(Long objId, MultipartFile file, int partNumber) {
    storageObjService.upload(objId, file, partNumber);
  }

  @PutMapping("/completeMultipartUpload")
  public void completeMultipartUpload(@RequestParam Long objId) {
    storageObjService.completeMultipartUpload(objId);
  }

  @PostMapping("/findPageByCategoryAndNameAndTypeIn")
  public Page<StorageObj> findPageByCategoryAndNameAndTypeIn(
      @RequestBody FindStorageObjPageReq body, Pageable pageable) {
    return storageObjService.findPageByCategoryAndNameAndTypeIn(
        body.getCategory(), body.getName(), body.getTypes(), pageable);
  }

  @DeleteMapping("/deleteAllByIdsInBatch")
  public void deleteAllByIdInBatch(@RequestParam("ids") Long[] ids) {
    storageObjService.deleteAllByIdInBatch(Arrays.asList(ids));
  }

  @PatchMapping("/updateCategoryAndName")
  public void updateCategoryAndName(@RequestBody StorageObj obj) {
    storageObjService.updateCategoryAndName(obj);
  }

  @GetMapping("/getPreviewUrl/{objectId}")
  public String getPreviewUrl(@PathVariable Long objectId) {
    return storageObjService.getPreviewUrl(objectId);
  }

  @GetMapping("/download/{objId}")
  public void download(@PathVariable Long objId, HttpServletResponse response) {
    storageObjService.download(objId, response);
  }
}
