package cn.lucasji.starry.edu.config.props;

import cn.lucasji.starry.edu.modal.StorageObjType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

/**
 * @author Lucas Ji
 * @date 2023/12/15 10:51
 */
@Configuration
@ConfigurationProperties(prefix = "storage-obj")
@Getter
@Setter
public class StorageObjProps {

  private Map<StorageObjType, List<String>> objTypeFileTypes;
}
