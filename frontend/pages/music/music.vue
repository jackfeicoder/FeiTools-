<template>
  <view class="container music-page">
    <!-- 唱片机区域 -->
    <view class="player-container">
      <view class="record-wrapper" :class="{ 'rotate': isPlaying }">
        <view class="record-disk">
          <view class="record-center">
            <!-- 音符装饰 -->
            <text class="music-icon">🎵</text>
          </view>
        </view>
      </view>
      <!-- 指针/唱针 -->
      <view class="player-needle" :class="{ 'playing': isPlaying }"></view>
    </view>

    <!-- 歌曲信息 -->
    <view class="song-info">
      <view class="song-title">{{ currentTrack.title }}</view>
      <view class="song-artist">{{ currentTrack.artist }}</view>
    </view>

    <!-- 控制面板 -->
    <view class="control-panel">
      <!-- 上一首 -->
      <view class="control-btn prev" @click="playPrev">⏮</view>
      <!-- 播放/暂停 -->
      <view class="control-btn play-pause" @click="togglePlay">
        <text class="btn-symbol">{{ isPlaying ? '⏸' : '▶' }}</text>
      </view>
      <!-- 下一首 -->
      <view class="control-btn next" @click="playNext">⏭</view>
    </view>

    <!-- 播放列表卡片 -->
    <view class="card playlist-card">
      <view class="title">🎼 音乐驿站列表</view>
      <view 
        class="playlist-item" 
        v-for="(track, index) in playlist" 
        :key="index"
        :class="{ 'active': activeIndex === index }"
        @click="selectTrack(index)"
      >
        <text class="track-index">{{ index + 1 }}</text>
        <view class="track-info">
          <text class="track-title">{{ track.title }}</text>
          <text class="track-artist">{{ track.artist }}</text>
        </view>
        <text class="playing-indicator" v-if="activeIndex === index && isPlaying">🔊 播放中</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isPlaying: false,
      activeIndex: 0,
      audioCtx: null,
      playlist: [
        {
          title: '静心钢琴曲 - 晨曦',
          artist: '白噪音与疗愈音乐',
          url: 'https://music.163.com/song/media/outer/url?id=1384026889.mp3' // 示例可用公益直链
        },
        {
          title: '自然白噪音 - 森林细雨',
          artist: '疗愈白噪音',
          url: 'https://music.163.com/song/media/outer/url?id=436346833.mp3'
        },
        {
          title: '午后咖啡馆 - 爵士小调',
          artist: 'BGM 精选',
          url: 'https://music.163.com/song/media/outer/url?id=439142035.mp3'
        }
      ]
    };
  },
  computed: {
    currentTrack() {
      return this.playlist[this.activeIndex] || { title: '暂无音乐', artist: '未知' };
    }
  },
  onLoad() {
    this.initAudio();
  },
  onUnload() {
    if (this.audioCtx) {
      this.audioCtx.destroy();
    }
  },
  onHide() {
    // 离开页面时暂停音乐，防止后台打扰
    if (this.isPlaying) {
      this.pauseMusic();
    }
  },
  methods: {
    // 初始化音频组件
    initAudio() {
      this.audioCtx = uni.createInnerAudioContext();
      this.audioCtx.src = this.playlist[this.activeIndex].url;
      
      // 监听事件
      this.audioCtx.onPlay(() => {
        this.isPlaying = true;
      });
      this.audioCtx.onPause(() => {
        this.isPlaying = false;
      });
      this.audioCtx.onStop(() => {
        this.isPlaying = false;
      });
      this.audioCtx.onEnded(() => {
        this.playNext(); // 播完自动切歌
      });
      this.audioCtx.onError((res) => {
        console.error('音频播放错误', res);
        uni.showToast({
          title: '音频加载失败，自动播放下一首',
          icon: 'none'
        });
        this.playNext();
      });
    },

    // 播放/暂停切换
    togglePlay() {
      if (this.isPlaying) {
        this.pauseMusic();
      } else {
        this.playMusic();
      }
    },

    playMusic() {
      if (!this.audioCtx.src) {
        this.audioCtx.src = this.playlist[this.activeIndex].url;
      }
      this.audioCtx.play();
    },

    pauseMusic() {
      this.audioCtx.pause();
    },

    // 切歌
    selectTrack(index) {
      if (this.activeIndex === index) {
        this.togglePlay();
        return;
      }
      this.activeIndex = index;
      this.audioCtx.stop();
      this.audioCtx.src = this.playlist[index].url;
      this.playMusic();
    },

    playNext() {
      let nextIndex = this.activeIndex + 1;
      if (nextIndex >= this.playlist.length) {
        nextIndex = 0;
      }
      this.selectTrack(nextIndex);
    },

    playPrev() {
      let prevIndex = this.activeIndex - 1;
      if (prevIndex < 0) {
        prevIndex = this.playlist.length - 1;
      }
      this.selectTrack(prevIndex);
    }
  }
};
</script>

<style scoped>
.music-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 唱片机样式 */
.player-container {
  position: relative;
  width: 380rpx;
  height: 380rpx;
  margin-top: 50rpx;
  margin-bottom: 60rpx;
}

.record-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #0f172a;
  border: 12rpx solid #334155;
  box-shadow: 0 20rpx 40rpx rgba(15, 23, 42, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.record-disk {
  width: 90%;
  height: 90%;
  border-radius: 50%;
  border: 4rpx dashed #1e293b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.record-center {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 10rpx rgba(0, 0, 0, 0.3);
}

.music-icon {
  font-size: 40rpx;
  color: #ffffff;
}

/* 唱片旋转动画 */
.rotate {
  animation: rotateDisk 15s linear infinite;
}

@keyframes rotateDisk {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 唱针 */
.player-needle {
  position: absolute;
  top: -20rpx;
  right: 80rpx;
  width: 30rpx;
  height: 120rpx;
  background-color: #94a3b8;
  border-radius: 10rpx;
  transform-origin: top center;
  transform: rotate(-30deg);
  transition: transform 0.5s ease;
  box-shadow: 2rpx 2rpx 10rpx rgba(0,0,0,0.1);
}

.player-needle::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30rpx;
  height: 30rpx;
  background-color: #64748b;
  border-radius: 50%;
}

.player-needle.playing {
  transform: rotate(0deg);
}

/* 歌名与作者 */
.song-info {
  text-align: center;
  margin-bottom: 50rpx;
}

.song-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 12rpx;
}

.song-artist {
  font-size: 24rpx;
  color: #94a3b8;
}

/* 控制台 */
.control-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60rpx;
  margin-bottom: 60rpx;
}

.control-btn {
  font-size: 45rpx;
  color: #475569;
  cursor: pointer;
}

.control-btn:active {
  opacity: 0.7;
}

.play-pause {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10rpx 25rpx rgba(79, 70, 229, 0.3);
  color: #ffffff;
}

.btn-symbol {
  font-size: 40rpx;
  margin-left: 4rpx; /* 微调三角位置 */
}

/* 播放列表 */
.playlist-card {
  width: 100%;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 24rpx 10rpx;
  border-bottom: 1px solid #f1f5f9;
}

.playlist-item:last-child {
  border-bottom: none;
}

.playlist-item.active {
  background-color: #f8fafc;
}

.track-index {
  font-size: 26rpx;
  color: #94a3b8;
  width: 50rpx;
}

.track-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.track-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #334155;
  margin-bottom: 6rpx;
}

.playlist-item.active .track-title {
  color: #4f46e5;
}

.track-artist {
  font-size: 22rpx;
  color: #94a3b8;
}

.playing-indicator {
  font-size: 22rpx;
  color: #4f46e5;
  font-weight: bold;
}
</style>
