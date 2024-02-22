package cn.lucasji.starry.edu.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author Lucas Ji
 * @date 2024/2/5 10:38
 */
@Data
public class ChapterVideoDto implements Serializable {

  @Serial
  private static final long serialVersionUID = -4084095277365343078L;

  private Long id;

  private Integer order;

  private StorageObjDto video;

  private Long chapterId;

  private Boolean completed;
}
