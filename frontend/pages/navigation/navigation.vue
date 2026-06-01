<template>
  <view class="container">
    <!-- 顶部提示 -->
    <view class="tip-banner">
      <text class="tip-icon">📢</text>
      <text class="tip-text">以下为您收集了全网优质好用的影视及资源网站，点击即可快速获取网址。</text>
    </view>

    <!-- 站点网格/列表 -->
    <view class="site-list" v-if="siteList.length > 0">
      <view 
        class="site-card" 
        v-for="site in siteList" 
        :key="site.id" 
        @click="handleSiteClick(site)"
      >
        <view class="site-logo-box">
          <!-- 提取首字母作为临时Logo -->
          <text class="site-logo-text">{{ getLogoText(site.name) }}</text>
        </view>
        <view class="site-info">
          <view class="site-name">{{ site.name }}</view>
          <view class="site-url">{{ site.url }}</view>
        </view>
        <view class="action-btn">
          <text class="btn-text">{{ isH5 ? '访问 ➔' : '复制' }}</text>
        </view>
      </view>
    </view>

    <!-- 空数据展示 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">📭</text>
      <text class="empty-tip">管理员暂未配置推荐站点，请稍后再来看看~</text>
    </view>
  </view>
</template>

<script>
import { BASE_URL } from '../../config.js';

export default {
  data() {
    return {
      siteList: [],
      isH5: false
    };
  },
  onShow() {
    // #ifdef H5
    this.isH5 = true;
    // #endif
    this.fetchSites();
  },
  methods: {
    // 获取网站列表
    fetchSites() {
      uni.request({
        url: `${BASE_URL}/api/client/sites`,
        method: 'GET',
        success: (res) => {
          if (res.data && res.data.code === 200) {
            this.siteList = res.data.data;
          } else {
            this.showToast('获取站点失败');
          }
        },
        fail: () => {
          this.showToast('无法连接服务器，请检查网络');
        }
      });
    },

    // 截取站名的首个字符作为默认Logo图
    getLogoText(name) {
      return name ? name.substring(0, 1).toUpperCase() : 'W';
    },

    // 站点点击逻辑
    handleSiteClick(site) {
      // #ifdef H5
      window.open(site.url, '_blank');
      // #endif

      // #ifndef H5
      uni.setClipboardData({
        data: site.url,
        success: () => {
          uni.showModal({
            title: '网址已复制',
            content: `已成功复制【${site.name}】的网址：\n${site.url}\n\n请在您的手机浏览器中粘贴访问。`,
            showCancel: false,
            confirmText: '我知道了'
          });
        }
      });
      // #endif
    },

    showToast(title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      });
    }
  }
};
</script>

<style scoped>
.tip-banner {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
  display: flex;
  align-items: flex-start;
  gap: 15rpx;
}

.tip-icon {
  font-size: 32rpx;
}

.tip-text {
  font-size: 26rpx;
  color: #1e3a8a;
  line-height: 1.4;
}

.site-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.site-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.site-card:active {
  transform: scale(0.98);
  background-color: #f8fafc;
}

.site-logo-box {
  width: 90rpx;
  height: 90rpx;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 25rpx;
  flex-shrink: 0;
}

.site-logo-text {
  font-size: 38rpx;
  font-weight: 800;
  color: #4f46e5;
}

.site-info {
  flex: 1;
  min-width: 0; /* 允许截断 */
}

.site-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8rpx;
}

.site-url {
  font-size: 22rpx;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-btn {
  background-color: #f1f5f9;
  border-radius: 30rpx;
  padding: 10rpx 24rpx;
  flex-shrink: 0;
  margin-left: 20rpx;
}

.btn-text {
  font-size: 24rpx;
  color: #4f46e5;
  font-weight: bold;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 150rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-tip {
  font-size: 26rpx;
  color: #94a3b8;
  text-align: center;
}
</style>
