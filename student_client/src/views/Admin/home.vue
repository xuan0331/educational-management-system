<template>
  <BaseLayout
      footerText="管理员面板"
      :bannerImages="bannerImages"
      :interval="4000"
  >
    <el-card class="card">
      <h2><i class="el-icon-s-home"></i> 系统信息</h2>
      <div class="info-item">
        <i class="el-icon-s-opportunity"></i>
        <span>项目名：长沙理工大学教务系统</span>
      </div>
      <div class="info-item">
        <i class="el-icon-user-solid"></i>
        <span>开发人员：胡宇煊</span>
      </div>
      <div class="info-item">
        <i class="el-icon-location"></i>
        <span>学校：长沙理工大学</span>
      </div>
      <div class="info-item">
        <i class="el-icon-tickets"></i>
        <span>学号：202308050109</span>
      </div>
    </el-card>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'

export default {
  name: "AdminHome",
  components: { BaseLayout },
  data() {
    return {
      bannerImages: [
        'images/csust.jpg',
        'images/csust1.jpg',
        'images/csust2.jpg',
        'images/csust3.jpg',
        'images/csust4.jpg',
        'images/csust5.jpg',
        'images/csust6.jpg'
      ]
    }
  }
}
</script>

<style scoped>
.card {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h2 {
  color: #303133;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #EBEEF5;
  display: flex;
  align-items: center;
}

h2 i {
  margin-right: 10px;
  color: #409EFF;
}

.info-item {
  margin: 1.2rem 0;
  font-size: 1.1rem;
  color: #606266;
  display: flex;
  align-items: center;
}

.info-item i {
  margin-right: 15px;
  font-size: 1.3rem;
  color: #409EFF;
}

@media (max-width: 768px) {
  .card {
    margin: 1rem;
    padding: 1rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .info-item {
    font-size: 1rem;
  }
}
</style>