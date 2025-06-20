<template>
  <div class="header-container">
    <!-- 用户信息区域 -->
    <div class="user-info">
      <el-tooltip content="当前用户" placement="bottom" effect="light">
        <div class="info-item">
          <el-avatar :size="36" :style="avatarStyle" class="user-avatar">
            {{ name.charAt(0) }}
          </el-avatar>
          <span class="user-name">{{ name }}</span>
        </div>
      </el-tooltip>

      <el-divider direction="vertical" class="divider-style"></el-divider>

      <el-tooltip :content="'当前学期: ' + currentTerm" placement="bottom" effect="light">
        <div class="info-item">
          <i class="el-icon-date calendar-icon"></i>
          <span class="term-text">{{ currentTerm }}</span>
        </div>
      </el-tooltip>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <el-tooltip content="消息通知" placement="bottom" effect="light">
        <el-button type="text" class="action-btn" @click="handleHelp">
          <i class="el-icon-question"></i>
        </el-button>
      </el-tooltip>

      <el-divider direction="vertical" class="divider-style"></el-divider>

      <el-tooltip content="退出登录" placement="bottom" effect="light">
        <el-button
            type="text"
            class="action-btn logout-btn"
            @click="handleLogout"
        >
          <i class="el-icon-switch-button"></i>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "RHeader",
  data() {
    return {
      name: null,
      currentTerm: null,
      avatarColors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
    }
  },
  computed: {
    avatarStyle() {
      const colorIndex = this.name ? this.name.charCodeAt(0) % this.avatarColors.length : 0;
      return {
        background: `linear-gradient(135deg, ${this.avatarColors[colorIndex]} 0%, ${this.darkenColor(this.avatarColors[colorIndex], 20)} 100%)`,
        color: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      };
    }
  },
  created() {
    this.name = sessionStorage.getItem("name") || '未登录用户';
    this.currentTerm = sessionStorage.getItem("currentTerm") || '未设置学期';
  },
  methods: {
    darkenColor(color, percent) {
      // 简单的颜色变暗函数
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) - amt;
      const G = (num >> 8 & 0x00FF) - amt;
      const B = (num & 0x0000FF) - amt;
      return `#${(
          0x1000000 +
          (R < 0 ? 0 : R) * 0x10000 +
          (G < 0 ? 0 : G) * 0x100 +
          (B < 0 ? 0 : B)
      ).toString(16).slice(1)}`;
    },
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'logout-confirm',
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cancel-btn'
      }).then(() => {
        sessionStorage.clear();
        this.$router.push('/login');
        this.$message({
          message: '退出成功',
          type: 'success',
          customClass: 'logout-message'
        });
      }).catch(() => {
        this.$message({
          message: '已取消退出',
          type: 'info',
          customClass: 'cancel-message'
        });
      });
    },
    handleHelp() {
      this.$message({
        message: '无消息通知',
        type: 'info'
      });
    }
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  width: 1530px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  cursor: default;
  padding: 0 12px;
  transition: all 0.3s;
  border-radius: 20px;
  height: 40px;
}

.info-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.user-avatar {
  margin-right: 12px;
  font-weight: bold;
  transition: all 0.3s;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.calendar-icon {
  font-size: 18px;
  margin-right: 8px;
  color: rgba(255,255,255,0.9);
}

.term-text {
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.action-buttons {
  display: flex;
  align-items: center;
}

.action-btn {
  font-size: 20px;
  color: rgba(255,255,255,0.8);
  padding: 8px 12px;
  transition: all 0.3s;
}

.action-btn:hover {
  color: white;
  transform: scale(1.15);
}

.logout-btn:hover {
  color: #ffcccc;
}

.divider-style {
  height: 1.5em;
  margin: 0 12px;
  background-color: rgba(255,255,255,0.3);
}
</style>

<style>
/* 全局样式覆盖 */
.logout-confirm {
  border-radius: 12px;
  background: linear-gradient(145deg, #f5f7fa 0%, #e4e8eb 100%);
}

.confirm-btn {
  background: linear-gradient(145deg, #F56C6C 0%, #d45f5f 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.4) !important;
}

.cancel-btn {
  background: linear-gradient(145deg, #f5f5f5 0%, #e0e0e0 100%) !important;
  border: none !important;
  color: #606266 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
}

.logout-message {
  background: linear-gradient(145deg, #f0f9eb 0%, #e1f3d8 100%);
  border: none;
  box-shadow: 0 2px 12px rgba(103, 194, 58, 0.2);
}

.cancel-message {
  background: linear-gradient(145deg, #f4f4f5 0%, #e9e9eb 100%);
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-message-box__title {
  color: #606266;
  font-weight: 600;
}

.el-message-box__content {
  color: #606266;
}
</style>