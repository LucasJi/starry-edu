package cn.lucasji.starry.edu.admin.pojo;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.ToString;

/**
 * @author lucas
 * @date 2023/12/10 10:24
 */
@Getter
@ToString
public class Part implements Serializable {

  @Serial private static final long serialVersionUID = -353763450154457320L;

  private final int partNumber;

  private final String etag;

  private final LocalDateTime lastModified;

  private final Long size;

  public Part(io.minio.messages.Part part) {
    partNumber = part.partNumber();
    etag = part.etag();
    size = part.partSize();
    lastModified = part.lastModified().toLocalDateTime();
  }
}
