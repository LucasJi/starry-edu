FROM eclipse-temurin:21-jre
VOLUME /tmp
COPY target/*.jar starry-edu.jar

# 以下参数在k8s Deployment配置文件中配置
ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE=""
ENV SPRING_DATASOURCE_PASSWORD=""
ENV SPRING_DATA_REDIS_PASSWORD=""

ENTRYPOINT exec java $JAVA_OPTS \
 -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE \
 -Duser.timezone=Asia/Shanghai \
 -Dspring.datasource.password=$SPRING_DATASOURCE_PASSWORD \
 -Dspring.data.redis.password=$SPRING_DATA_REDIS_PASSWORD \
 --enable-preview \
 -jar starry-edu.jar
