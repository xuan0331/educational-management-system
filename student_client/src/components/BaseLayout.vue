<template>
  <div class="parallax-container">
    <!-- 头部图片区域 - 优化后的轮播功能 -->
    <section class="parallax-section img-section">
      <div class="banner-container">
        <transition-group name="fade" tag="div">
          <div
              v-for="(image, index) in bannerImages"
              :key="image"
              v-show="currentIndex === index"
              class="banner-image"
              :style="{ backgroundImage: `url(${getImageUrl(image)})` }"
          >
            <h1>长沙理工大学教务系统</h1>
          </div>
        </transition-group>

        <!-- 添加导航指示器 -->
        <div class="banner-indicators" v-if="bannerImages.length > 1">
          <span
              v-for="(item, index) in bannerImages"
              :key="'indicator-'+index"
              :class="{ active: currentIndex === index }"
              @click="goToSlide(index)"
          ></span>
        </div>

        <!-- 添加导航箭头 -->

      </div>
    </section>

    <!-- 内容区域插槽 -->
    <section class="content-section">
      <div class="text-box">
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </section>

    <!-- 页脚区域 -->
    <section class="footer-section">
      <p>©2025 长沙理工大学教务系统平台 - {{ footerText }}</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "BaseLayout",
  props: {
    footerText: {
      type: String,
      required: true
    },
    bannerImages: {
      type: Array,
      default: () => ['csust.jpg'] // 默认图片
    },
    interval: {
      type: Number,
      default: 5000 // 默认5秒切换
    }
  },
  data() {
    return {
      currentIndex: 0,
      timer: null,
      isHovering: false
    }
  },
  mounted() {
    this.startRotation()
  },
  beforeDestroy() {
    this.stopRotation()
  },
  methods: {
    getImageUrl(image) {
      try {
        return require(`@/assets/${image}`)
      } catch (e) {
        console.error('Image load failed:', e)
        return require('@/assets/images/csust.jpg')
      }
    },
    startRotation() {
      if (this.bannerImages.length <= 1) return

      this.stopRotation()
      this.timer = setInterval(() => {
        if (!this.isHovering) {
          this.nextSlide()
        }
      }, this.interval)
    },
    stopRotation() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.bannerImages.length
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.bannerImages.length) % this.bannerImages.length
    },
    goToSlide(index) {
      this.currentIndex = index
    }
  }
}
</script>

<style scoped>
/* 轮播容器样式 */
.banner-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.banner-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-image 0.5s ease;
}


/* 过渡动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 导航指示器 */
.banner-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 10;
}

.banner-indicators span {
  width: 12px;
  height: 12px;
  margin: 0 5px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-indicators span.active {
  background-color: rgba(255, 255, 255, 0.9);
  transform: scale(1.2);
}

/* 导航箭头 */


/* 原有样式调整 */
.img-section {
  height: 40vh;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 4rem;
  user-select: none;
  position: relative;
}

.img-section h1 {
  position: relative;
  z-index: 5;
}

@media (max-width: 768px) {
  .img-section h1 {
    font-size: 2.5rem;
  }



  .banner-indicators span {
    width: 8px;
    height: 8px;
  }
}
</style>

<style src="@/assets/layout.css"></style>