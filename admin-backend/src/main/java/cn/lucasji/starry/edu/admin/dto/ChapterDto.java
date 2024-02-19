package cn.lucasji.starry.edu.admin.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @author Lucas Ji
 * @date 2024/2/5 10:22
 */
@Data
public class ChapterDto implements Serializable {

  @Serial
  private static final long serialVersionUID = 5690917535730619756L;

  private Long id;

  private String name;

  private Integer order;

  private List<ChapterVideoDto> chapterVideos;
}
