<template>
  <div id="app" :class="{ 'font-loaded': fontLoaded }">
    <router-view :key="$route.fullPath" v-slot="{ Component }">
      <transition
          :enter-active-class="`animate__animated ${currentTransition.enter}`"
          :leave-active-class="`animate__animated ${currentTransition.leave}`"
          mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      fontLoaded: false
    }
  },
  computed: {
    currentTransition() {
      const defaultTransition = {
        enter: 'animate__jackInTheBox',
        leave: 'animate__rollOut'
      }


      return this.$route.meta.transition || defaultTransition
    }
  },
  mounted() {
    this.checkFontLoaded();
  },
  methods: {
    checkFontLoaded() {
      if (document.fonts) {
        const font = new FontFace(
            'AlimamaDongFangDaKai',
            `url("${require('@/assets/fonts/AlimamaDongFangDaKai-Regular.woff2')}") format('woff2')`
        );

        font.load()
            .then(() => {
              document.fonts.add(font);
              this.fontLoaded = true;
            })
            .catch(() => {
              this.fontLoaded = true;
            });
      } else {
        this.fontLoaded = true;
      }
    }
  }
}
</script>

<style>
@font-face {
  font-family: 'AlimamaDongFangDaKai';
  src: url('~@/assets/fonts/AlimamaDongFangDaKai-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

#app {
  font-family: 'AlimamaDongFangDaKai', 'PingFang SC', 'Microsoft YaHei', 'KaiTi', 'STKaiti', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
}

#app:not(.font-loaded) {
  visibility: hidden;
}

#app.font-loaded {
  visibility: visible;
  transition: visibility 0.3s ease;
}

.animate__animated {
  --animate-duration: 1s;
  animation-duration: 1s;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .animate__animated {
    animation: none !important;
    transition: none !important;
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.5);
}
.el-button,
.el-input,
.el-select,
.el-option,
.el-menu-item,
.el-tabs__item {
  font-family: 'AlimamaDongFangDaKai', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

[class^="el-icon-"],
[class*=" el-icon-"],
.el-icon {
  font-family: element-icons, "AlimamaDongFangDaKai", "PingFang SC", "Microsoft YaHei", "KaiTi", "STKaiti", sans-serif !important;
}

@media screen and (max-width: 768px) {
  body {
    font-size: 16px;
  }
}
</style>