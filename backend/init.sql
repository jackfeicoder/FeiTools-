-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `feitools_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `feitools_db`;

-- 1. 创建解析接口表
CREATE TABLE IF NOT EXISTS `analysis_apis` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '接口名称',
  `url` VARCHAR(255) NOT NULL COMMENT '解析接口地址',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `sort_order` INT DEFAULT 0 COMMENT '排序，越小越靠前',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='解析接口表';

-- 插入初始解析接口数据
INSERT INTO `analysis_apis` (`name`, `url`, `status`, `sort_order`) VALUES
('77解析', 'https://jx.77flv.cc/?url=', 1, 1),
('1907解析', 'https://im1907.top/?jx=', 1, 2),
('XM解析', 'https://jx.xmflv.com/?url=', 1, 3);


-- 2. 创建导航站点表
CREATE TABLE IF NOT EXISTS `navigation_sites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '站点名称',
  `url` VARCHAR(255) NOT NULL COMMENT '站点链接',
  `logo` VARCHAR(255) DEFAULT '' COMMENT 'LOGO图标',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `sort_order` INT DEFAULT 0 COMMENT '排序，越小越靠前',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='导航站点表';

-- 插入初始导航站点数据
INSERT INTO `navigation_sites` (`name`, `url`, `status`, `sort_order`) VALUES
('泥巴影院', 'https://www.nbyy.cc/', 1, 1),
('VPS影视', 'https://v.vps6.cn/', 1, 2);


-- 3. 创建视频搜索平台表
CREATE TABLE IF NOT EXISTS `search_platforms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '平台名称',
  `search_url` VARCHAR(255) NOT NULL COMMENT '搜索链接模板',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `sort_order` INT DEFAULT 0 COMMENT '排序，越小越靠前',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='视频搜索平台表';

-- 插入初始视频搜索平台数据
INSERT INTO `search_platforms` (`name`, `search_url`, `status`, `sort_order`) VALUES
('腾讯视频', 'https://v.qq.com/x/search/?q=', 1, 1),
('爱奇艺', 'https://so.iqiyi.com/so/q_', 1, 2),
('优酷视频', 'https://so.youku.com/search_video/q_', 1, 3),
('芒果TV', 'https://so.mgtv.com/so?k=', 1, 4);
