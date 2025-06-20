<template>
  <div class="aside-container">
    <el-aside width="220px" class="glass-aside">
      <div class="aside-header">
        <i class="el-icon-menu" style="color: #409EFF;"></i>
        <span style="color: #409EFF;">菜单</span>
      </div>
      <el-menu
          router
          :default-active="$route.path"
          class="glass-menu"
          active-text-color="#409EFF"
          text-color="#409EFF"
      >
        <div v-for="(item, index) in $router.options.routes" v-if="item.name === type" :index="index+''" :key="index">
          <el-submenu
              v-for="(item2, index2) in item.children"
              :index="item2.path"
              :key="item2.path"
              popper-class="glass-popper"
          >
            <template slot="title">
              <i :class="item2.icon || 'el-icon-folder-opened'" style="color: #409EFF;"></i>
              <span>{{ item2.name }}</span>
            </template>
            <el-menu-item
                v-for="(item3, index3) in item2.children"
                :index="item3.path"
                :key="item3.path"
                class="menu-item"
            >
              <i :class="item3.icon || 'el-icon-right'" style="color: #409EFF;"></i>
              <span>{{ item3.name }}</span>
            </el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  name: "r-aside",
  data() {
    return {
      type: null
    }
  },
  created() {
    this.type = sessionStorage.getItem("type")
  }
}
</script>

<style scoped>
.aside-container {
  height: 100%;
}

.glass-aside {
  height: 136vh;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(5px);
  border-right: 1px solid #e6e6e6 !important;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.aside-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #ebeef5;
}

.aside-header i {
  margin-right: 10px;
  font-size: 20px;
}

.glass-menu {
  background: transparent !important;
  border-right: none !important;
}

.glass-menu >>> .el-submenu__title,
.glass-menu >>> .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 4px 10px;
  border-radius: 8px;
  transition: all 0.3s;
  color: #409EFF;
}

.glass-menu >>> .el-submenu__title:hover,
.glass-menu >>> .el-menu-item:hover {
  background: #f5f7fa !important;
}

.glass-menu >>> .el-menu-item.is-active {
  background: #ecf5ff !important;
  color: #409EFF !important;
  border-left: 3px solid #409EFF;
}

.glass-menu >>> .el-submenu__title i,
.glass-menu >>> .el-menu-item i {
  margin-right: 10px;
}

.menu-item {
  padding-left: 50px !important;
}
</style>

<style>

.glass-popper {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(5px);
  border: 1px solid #e6e6e6 !important;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  overflow: hidden;
}

.glass-popper .el-menu {
  background: transparent !important;
}

.glass-popper .el-menu-item {
  color: #409EFF !important;
  transition: all 0.3s;
}

.glass-popper .el-menu-item:hover {
  background: #f5f7fa !important;
}

.glass-popper .el-menu-item.is-active {
  color: #409EFF !important;
  background: #ecf5ff !important;
}
</style>