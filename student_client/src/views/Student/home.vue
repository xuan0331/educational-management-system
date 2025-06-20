<template>
  <BaseLayout
      footerText="学生面板"
      :bannerImages="bannerImages"
      :interval="4000"
  >
    <el-card class="card">
      <h2><i class="el-icon-user"></i> 学生信息</h2>
      <info-card></info-card>

      <!-- 添加功能导航区 -->

    </el-card>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout'
import InfoCard from "@/components/infoCard";

export default {
  name: "StudentHome",
  components: { BaseLayout, InfoCard },
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
  },
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

/* 响应式调整 */
@media (max-width: 768px) {
  .card {
    margin: 1rem;
    padding: 1rem;
  }

  h2 {
    font-size: 1.3rem;
  }

}
</style>