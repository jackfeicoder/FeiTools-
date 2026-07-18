<template>
  <view class="container">
    <!-- 用户个人名片卡 -->
    <view class="card profile-card">
      <view class="profile-main">
        <view class="avatar-box">
          <text class="avatar-icon">👤</text>
        </view>
        <view class="user-info" v-if="isLoggedIn">
          <view class="username">微信用户 ({{ openid.substring(0, 12) }}...)</view>
          <view class="tag">黄金会员 (永久免广告)</view>
        </view>
        <view class="user-info" v-else>
          <view class="username">未登录</view>
          <view class="user-tip">登录后解锁更多专属工具</view>
        </view>
      </view>

      <!-- 微信登录按钮（限小程序端显示） -->
      <!-- #ifndef H5 -->
      <button 
        v-if="!isLoggedIn" 
        class="login-btn" 
        :loading="loginLoading" 
        @click="handleWxLogin"
      >
        💬 微信一键登录
      </button>
      <!-- #endif -->
      
      <!-- H5端登录按钮 -->
      <!-- #ifdef H5 -->
      <button 
        v-if="!isLoggedIn" 
        class="login-btn" 
        @click="handleH5Login"
      >
        👋 一键游客登录
      </button>
      <!-- #endif -->

      <button 
        v-if="isLoggedIn" 
        class="logout-btn" 
        @click="handleLogout"
      >
        退出登录
      </button>
    </view>

    <!-- 工具与关于列表 -->
    <view class="card menu-card">
      <view class="menu-item" @click="showAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-label">关于 FeiTools</text>
        <text class="menu-arrow">➔</text>
      </view>
      
      <view class="menu-item" @click="showNotice">
        <text class="menu-icon">📢</text>
        <text class="menu-label">系统公告</text>
        <text class="menu-arrow">➔</text>
      </view>
      
      <view class="menu-item" @click="showContact">
        <text class="menu-icon">✉️</text>
        <text class="menu-label">联系作者 & 商务合作</text>
        <text class="menu-arrow">➔</text>
      </view>
    </view>

    <!-- 版权与版本信息 -->
    <view class="version-info">
      <view class="v-text">FeiTools v1.0.0 (Beta)</view>
      <view class="v-copyright">© 2026 FeiTools. All Rights Reserved.</view>
    </view>
  </view>
</template>

<script>
import { BASE_URL } from '../../config.js';

export default {
  data() {
    return {
      isLoggedIn: false,
      loginLoading: false,
      openid: '',
      token: ''
    };
  },
  onShow() {
    this.checkLoginStatus();
  },
  methods: {
    // 检查本地存储中的登录状态
    checkLoginStatus() {
      const storedToken = uni.getStorageSync('client_token');
      const storedOpenid = uni.getStorageSync('client_openid');
      if (storedToken && storedOpenid) {
        this.isLoggedIn = true;
        this.token = storedToken;
        this.openid = storedOpenid;
      } else {
        this.isLoggedIn = false;
        this.token = '';
        this.openid = '';
      }
    },

    // 微信静默一键登录
    handleWxLogin() {
      this.loginLoading = true;
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          if (loginRes.code) {
            // 将 code 发送到 Node.js 后端换取 OpenID
            uni.request({
              url: `${BASE_URL}/api/client/wx-login`,
              method: 'POST',
              data: {
                code: loginRes.code
              },
              success: (res) => {
                if (res.data && res.data.code === 200) {
                  const { openid, token } = res.data.data;
                  uni.setStorageSync('client_token', token);
                  uni.setStorageSync('client_openid', openid);
                  this.isLoggedIn = true;
                  this.openid = openid;
                  this.token = token;
                  uni.showToast({
                    title: '登录成功！',
                    icon: 'success'
                  });
                } else {
                  this.showToast('后端换取登录态失败');
                }
              },
              fail: () => {
                this.showToast('无法连接服务器，请检查网络');
              },
              complete: () => {
                this.loginLoading = false;
              }
            });
          } else {
            this.showToast('获取微信Code失败');
            this.loginLoading = false;
          }
        },
        fail: (err) => {
          console.error('uni.login 失败', err);
          this.showToast('微信登录调用失败');
          this.loginLoading = false;
        }
      });
    },

    // H5网页端的游客登录
    handleH5Login() {
      const mockOpenid = 'your-openid-' + Math.random().toString(36).substr(2, 9);
      const mockToken = 'your-client-token-' + mockOpenid;
      uni.setStorageSync('client_token', mockToken);
      uni.setStorageSync('client_openid', mockOpenid);
      this.isLoggedIn = true;
      this.openid = mockOpenid;
      this.token = mockToken;
      uni.showToast({
        title: '以游客身份登录',
        icon: 'success'
      });
    },

    // 退出登录
    handleLogout() {
      uni.removeStorageSync('client_token');
      uni.removeStorageSync('client_openid');
      this.isLoggedIn = false;
      this.openid = '';
      this.token = '';
      uni.showToast({
        title: '已安全退出',
        icon: 'none'
      });
    },

    // 底部菜单跳转弹窗提示
    showAbout() {
      uni.showModal({
        title: '关于 FeiTools',
        content: 'FeiTools 是一套专为极速娱乐及便利工作设计的多端工具箱。当前支持影视链接快捷解析、推荐优质导航以及解压音乐。后续会逐步丰富功能！',
        showCancel: false
      });
    },
    
    showNotice() {
      uni.showModal({
        title: '系统公告',
        content: '🎉 FeiTools v1.0.0 震撼上线！欢迎体验多端影视解析及音乐空间。如有任何问题或建议，欢迎联系作者反馈！',
        showCancel: false
      });
    },
    
    showContact() {
      uni.showModal({
        title: '联系作者',
        content: '作者微信：[请在后台或配置文件中自定义]\n邮箱：[您的邮箱]\n期待您的优质建议与项目定制合作！',
        showCancel: false
      });
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
.profile-card {
  padding: 40rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #f1f5f9;
}

.profile-main {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar-box {
  width: 110rpx;
  height: 110rpx;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.05);
}

.avatar-icon {
  font-size: 50rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 32rpx;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8rpx;
}

.tag {
  font-size: 20rpx;
  background-color: #fef3c7;
  color: #d97706;
  padding: 4rpx 14rpx;
  border-radius: 20rpx;
  align-self: flex-start;
  font-weight: bold;
}

.user-tip {
  font-size: 24rpx;
  color: #94a3b8;
}

.login-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #ffffff;
  border: none;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: bold;
  height: 80rpx;
  line-height: 80rpx;
  box-shadow: 0 6rpx 15rpx rgba(79, 70, 229, 0.25);
}

.login-btn:active {
  opacity: 0.9;
}

.logout-btn {
  background-color: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  border-radius: 50rpx;
  font-size: 26rpx;
  height: 76rpx;
  line-height: 76rpx;
}

/* 菜单项 */
.menu-card {
  padding: 10rpx 30rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1px solid #f1f5f9;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #fafafa;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-label {
  font-size: 28rpx;
  color: #334155;
  flex: 1;
}

.menu-arrow {
  font-size: 24rpx;
  color: #cbd5e1;
}

/* 版本版权 */
.version-info {
  margin-top: 80rpx;
  text-align: center;
}

.v-text {
  font-size: 24rpx;
  color: #94a3b8;
  margin-bottom: 10rpx;
}

.v-copyright {
  font-size: 20rpx;
  color: #cbd5e1;
}
</style>
