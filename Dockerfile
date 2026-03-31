# ############################
# # builder
# ############################
FROM node:20.11.1-alpine as builder
WORKDIR /app
COPY package*.json ./
# parameter
ARG ENV

# 생성된 전역 및 액세스 토큰을 사용
RUN npm install

#ADD . . // [20250617]SonarQube대응.COPY로 변경@sss    
COPY . . 
# RUN npm run build-dev
RUN npm run build-$ENV

# ############################
# # production stage
# ############################
FROM nginx:1.25.4-alpine as production-stage

# timezone
RUN apk add -U tzdata
ENV TZ=Asia/Seoul
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime
# log dir (default.conf 위치와 관련)
#RUN mkdir -p /logs
# logrotate (60개 로그)
RUN apk add logrotate
ARG NGINX_LOG_ROTATE=60
RUN sed -i 's/rotate 52/rotate '${NGINX_LOG_ROTATE}'/g' /etc/logrotate.d/nginx \
    && sed -i 's/create 640 nginx adm/create 644 root root/g' /etc/logrotate.d/nginx

# nginx
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# 정적 리소스 이미지 테스트
# RUN mkdir -p /app/cf-apiserver/upload

# non-root User처리
# RUN addgroup --system --gid 1001 appgroup && \
#     adduser --system --uid 1001 --ingroup appgroup appuser
# RUN chown -R appuser:appgroup /app

# volume
VOLUME ["/var/log/nginx/"]

EXPOSE 8087
CMD ["nginx", "-g", "daemon off;"]
