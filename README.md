# Starry Edu

## 系统介绍

StarryEdu
是一款开源的在线培训系统，功能以及页面布局灵感来源于 [PlayEdu](https://github.com/PlayEdu/PlayEdu)。

## 系统架构

StarryEdu 基于 Java + PostgreSQL 开发，采用前后端分离模式。

### 前端

- Next.js
- antd
- Next Auth
- tailwindcss
- TypeScript

### 后端

- SpringBoot 3
- PostgreSQL
- Minio
- Redis

### 运维

- 阿里云+腾讯云轻量服务器（趁着新人优惠搞了两台便宜服务器搭的 k3s 集群）
- k3s

**TODO**: 使用 Github Actions 实现自动化部署

## 系统功能

### 已实现

- 学员端： PC 端
- 学员： 关联部门、学员信息、课程播放、课件下载
- 线上课： 关联分类、关联部门、章节课/无章节课
- 后台管理： 分类管理(多级)、部门管理(多级)、视频资源管理、课程管理
- 数据统计： 学习进度明细(任务进度/课程进度/课时进度)、资源明细统计、学员每日学习时长统计、学员总学习时长统计

### 未实现

- 学员端： 移动端、批量导入、学习记录
- 播放管理： 记忆续播、防录屏跑马灯
- 其他： 权限管理、网站管理
- 数据统计： 每日学习排名统计

## 说明

### 对比 PlayEdu

- 搭建了一个独立的身份认证平台 [Starry Idp](https://github.com/LucasJi/starry-idp)
  用于用户管理。该平台设想中将会开发成 [keycloak](https://www.keycloak.org/)
  这种项目。后续如果有其他项目需要用户认证和授权功能，可以通过 idp 快速接入并方便管理。现阶段该项目仅实现了
  OpenID Connect 1.0 的基本功能。
- 由于个人精力有限，此项目仅支持 PC 端

### 后续规划

1. 尽快实现一个稳定的 MVP 版本
2. PlayEdu 的企业版部分功能在 MVP 版本稳定之后会视情况加上
