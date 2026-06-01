<template>
  <view class="container">
    <!-- 头部横幅 -->
    <view class="header-banner">
      <view class="banner-title">FeiTools 影视解析</view>
      <view class="banner-desc">支持多条优质解析通道，一键直达，极速播放</view>
    </view>

    <!-- A. 快速搜片卡片 -->
    <view class="card">
      <view class="title">🎬 快速搜片拿链接</view>
      
      <view class="search-row">
        <!-- 平台选择 -->
        <picker @change="onPlatformChange" :value="platformIndex" :range="platformNames" class="platform-picker">
          <view class="picker-val search-picker-val">
            {{ platformNames[platformIndex] || '加载平台...' }}
            <text class="arrow">▼</text>
          </view>
        </picker>
        
        <!-- 片名输入 -->
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="输入想看的视频或电视剧名称" 
          class="search-input"
          placeholder-style="color: #94a3b8; font-size: 28rpx;"
        />
      </view>

      <!-- 搜索按钮 -->
      <button class="btn-primary btn-search" @click="handleSearch">去搜片拿链接</button>
    </view>

    <!-- B. 解析表单卡片 -->
    <view class="card">
      <view class="title">🔗 视频链接解析</view>
      
      <!-- 链接输入框 -->
      <view class="input-box">
        <textarea 
          class="textarea-input" 
          v-model="videoUrl" 
          placeholder="在此粘贴刚才复制的视频网页播放链接（如：爱奇艺、腾讯、优酷、芒果等）"
          placeholder-style="color: #94a3b8; font-size: 28rpx;"
        />
      </view>

      <!-- 接口选择 -->
      <view class="picker-container">
        <text class="label">选择解析通道：</text>
        <picker @change="onPickerChange" :value="apiIndex" :range="apiNames">
          <view class="picker-val">
            {{ apiNames[apiIndex] || '加载解析接口中...' }}
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>

      <!-- 解析按钮 -->
      <button class="btn-primary" @click="handleResolve">一键开始解析</button>
      
      <!-- 清空按钮 -->
      <button class="btn-secondary" v-if="videoUrl" @click="videoUrl = ''">清空链接</button>
    </view>

    <!-- 说明声明 -->
    <view class="card declaration">
      <view class="title" style="color: #64748b; font-size: 28rpx;">💡 使用说明与免责声明</view>
      <view class="text-p">1. 本程序解析接口均来源于互联网，仅供学习与技术交流，本程序不存储任何音视频内容。</view>
      <view class="text-p">2. 微信小程序由于官方规则，无法在应用内直接打开第三方搜索及视频页面。搜片和解析时，程序会【自动复制】对应网址到您的剪贴板，请复制后在手机浏览器中粘贴访问即可。</view>
    </view>
  </view>
</template>

<script>
import { BASE_URL } from '../../config.js';

export default {
  data() {
    return {
      videoUrl: '',
      apiList: [], // 完整的接口列表
      apiNames: [], // picker 展示的名字列表
      apiIndex: 0, // 当前选中的接口下标
      
      // 视频搜索配置
      searchKeyword: '',
      platformList: [], // 搜索平台列表
      platformNames: [], // 平台名称列表
      platformIndex: 0
    };
  },
  onShow() {
    this.fetchApis();
    this.fetchPlatforms();
  },
  methods: {
    // 获取可用的解析接口
    async fetchApis() {
      uni.request({
        url: `${BASE_URL}/api/client/apis`,
        method: 'GET',
        success: (res) => {
          if (res.data && res.data.code === 200) {
            this.apiList = res.data.data;
            this.apiNames = this.apiList.map(item => item.name);
            if (this.apiList.length > 0) {
              this.apiIndex = 0;
            }
          }
        }
      });
    },

    // 获取搜索平台
    async fetchPlatforms() {
      uni.request({
        url: `${BASE_URL}/api/client/platforms`,
        method: 'GET',
        success: (res) => {
          if (res.data && res.data.code === 200) {
            this.platformList = res.data.data;
            this.platformNames = this.platformList.map(item => item.name);
            if (this.platformList.length > 0) {
              this.platformIndex = 0;
            }
          }
        }
      });
    },

    // 切换解析接口
    onPickerChange(e) {
      this.apiIndex = e.detail.value;
    },

    // 切换搜索平台
    onPlatformChange(e) {
      this.platformIndex = e.detail.value;
    },

    // 快速搜片直达逻辑
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        this.showToast('请输入视频名称');
        return;
      }
      if (this.platformList.length === 0) {
        this.showToast('暂无可用搜索平台');
        return;
      }

      const activePlatform = this.platformList[this.platformIndex];
      // 拼接搜索地址
      const searchUrl = `${activePlatform.search_url}${encodeURIComponent(this.searchKeyword.trim())}`;

      // 判断运行平台 (H5 还是 微信小程序)
      // #ifdef H5
      window.open(searchUrl, '_blank');
      // #endif

      // #ifndef H5
      uni.setClipboardData({
        data: searchUrl,
        success: () => {
          uni.showModal({
            title: '搜索链接已复制',
            content: `已为您复制【${activePlatform.name}】的搜片地址。请打开手机浏览器粘贴访问，找到播放页面后，复制视频播放地址回来解析！`,
            showCancel: false,
            confirmText: '我知道了'
          });
        }
      });
      // #endif
    },

    // 解析按钮逻辑
    handleResolve() {
      if (!this.videoUrl.trim()) {
        this.showToast('请输入视频链接');
        return;
      }
      if (this.apiList.length === 0) {
        this.showToast('暂无可用接口');
        return;
      }

      const activeApi = this.apiList[this.apiIndex];
      // 拼接解析地址
      const finalUrl = `${activeApi.url}${encodeURIComponent(this.videoUrl.trim())}`;

      // 判断运行平台 (H5 还是 微信小程序)
      // #ifdef H5
      window.open(finalUrl, '_blank');
      // #endif

      // #ifndef H5
      uni.setClipboardData({
        data: finalUrl,
        success: () => {
          uni.showModal({
            title: '解析链接已复制',
            content: '由于微信小程序限制，请打开您的手机浏览器，粘贴刚才复制的链接，即可免费播放视频！',
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
.header-banner {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  color: #ffffff;
}

.banner-title {
  font-size: 38rpx;
  font-weight: 800;
  margin-bottom: 12rpx;
  letter-spacing: 1px;
}

.banner-desc {
  font-size: 24rpx;
  opacity: 0.85;
  line-height: 1.4;
}

/* 快速搜片行 */
.search-row {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 25rpx;
}

.platform-picker {
  flex-shrink: 0;
}

.search-picker-val {
  padding: 18rpx 24rpx !important;
  font-size: 26rpx;
  background-color: #f1f5f9 !important;
  color: #334155 !important;
  border-radius: 12rpx !important;
  border: 1px solid #cbd5e1;
}

.search-input {
  flex: 1;
  height: 80rpx;
  background-color: #f1f5f9;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #334155;
  border: 1px solid #cbd5e1;
  box-sizing: border-box;
}

.btn-search {
  height: 80rpx !important;
  line-height: 80rpx !important;
  font-size: 28rpx !important;
  box-shadow: 0 6rpx 15rpx rgba(79, 70, 229, 0.2) !important;
  margin-bottom: 10rpx;
}

.input-box {
  background-color: #f1f5f9;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.textarea-input {
  width: 100%;
  height: 150rpx;
  font-size: 28rpx;
  color: #334155;
  line-height: 1.5;
}

.picker-container {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  font-size: 28rpx;
}

.label {
  color: #475569;
  flex-shrink: 0;
}

.picker-val {
  background-color: #e2e8f0;
  color: #1e293b;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-weight: bold;
}

.arrow {
  font-size: 20rpx;
  color: #64748b;
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #ffffff;
  border: none;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: bold;
  height: 90rpx;
  line-height: 90rpx;
  box-shadow: 0 8rpx 20rpx rgba(79, 70, 229, 0.3);
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 50rpx;
  font-size: 28rpx;
  height: 80rpx;
  line-height: 80rpx;
  margin-top: 20rpx;
}

.declaration {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.text-p {
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 12rpx;
}
</style>
