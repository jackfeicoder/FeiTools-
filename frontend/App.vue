<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 每个页面公共css */
page {
  background-color: #f5f7fb;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft Yahei', sans-serif;
  box-sizing: border-box;
}

/* 全局工具样式 */
.container {
  padding: 30rpx;
}

.card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 20rpx;
}
</style>
