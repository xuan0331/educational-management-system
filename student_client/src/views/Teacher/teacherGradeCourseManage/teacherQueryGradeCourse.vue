<template>
  <div>
    <el-container>
      <el-main>
        <el-card>
          <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="学号" prop="sid">
              <el-input v-model.number="ruleForm.sid"></el-input>
            </el-form-item>
            <el-form-item label="学生名" prop="sname">
              <el-input v-model="ruleForm.sname"></el-input>
            </el-form-item>
            <el-form-item label="模糊查询" prop="sFuzzy">
              <el-switch v-model="ruleForm.sFuzzy"></el-switch>
            </el-form-item>
            <el-form-item label="课程号" prop="cid">
              <el-input v-model.number="ruleForm.cid"></el-input>
            </el-form-item>
            <el-form-item label="课程名" prop="cname">
              <el-input v-model="ruleForm.cname"></el-input>
            </el-form-item>
            <el-form-item label="模糊查询" prop="cFuzzy">
              <el-switch v-model="ruleForm.cFuzzy"></el-switch>
            </el-form-item>
            <el-form-item label="成绩下限" prop="lowBound">
              <el-input v-model.number="ruleForm.lowBound"></el-input>
            </el-form-item>
            <el-form-item label="成绩上限" prop="highBound">
              <el-input v-model.number="ruleForm.highBound"></el-input>
            </el-form-item>
            <el-form-item label="选择学期">
              <el-select v-model="ruleForm.term" placeholder="请选择学期">
                <el-option v-for="(item, index) in termList" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card style="margin-top: 10px">
          <div class="chart-container">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card>
                  <div ref="gradeDistributionChart" style="width: 100%; height: 400px;"></div>
                  <el-empty v-if="!hasData" description="暂无成绩数据"></el-empty>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card>
                  <div ref="courseAvgChart" style="width: 100%; height: 400px;"></div>
                  <el-empty v-if="!hasData" description="暂无成绩数据"></el-empty>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <el-card style="margin-top: 10px">
          <teacher-grade-course-list
              :rule-form="ruleForm"
              @data-loaded="handleDataLoaded"
              ref="gradeList">
          </teacher-grade-course-list>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import TeacherGradeCourseList from "@/views/Teacher/teacherGradeCourseManage/teacherGradeCourseList";

export default {
  name: 'TeacherGradeCourseManage',
  components: { TeacherGradeCourseList },
  data() {
    return {
      termList: [],
      ruleForm: {
        sid: null,
        sname: null,
        sFuzzy: true,
        tid: sessionStorage.getItem('tid'),
        tname: null,
        tFuzzy: true,
        cid: null,
        cname: null,
        cFuzzy: true,
        lowBound: null,
        highBound: null,
        term: sessionStorage.getItem('currentTerm')
      },
      rules: {
        cid: [{ type: 'number', message: '必须是数字类型' }],
        tid: [{ type: 'number', message: '必须是数字类型' }],
        sid: [{ type: 'number', message: '必须是数字类型' }],
        lowBound: [{ type: 'number', message: '必须是数字类型' }],
        highBound: [{ type: 'number', message: '必须是数字类型' }]
      },
      hasData: false,
      gradeChart: null,
      courseChart: null
    };
  },
  created() {
    this.fetchTermList();
  },
  mounted() {
    this.initCharts();
  },
  beforeDestroy() {
    this.disposeCharts();
  },
  methods: {
    fetchTermList() {
      axios.get('http://localhost:10086/SCT/findAllTerm')
          .then(resp => {
            this.termList = resp.data;
          })
          .catch(error => {
            console.error('获取学期列表失败:', error);
          });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.gradeList.loadData();
    },

    initCharts() {
      this.$nextTick(() => {
        if (this.$refs.gradeDistributionChart) {
          this.gradeChart = echarts.init(this.$refs.gradeDistributionChart);
        }
        if (this.$refs.courseAvgChart) {
          this.courseChart = echarts.init(this.$refs.courseAvgChart);
        }
      });
    },

    disposeCharts() {
      if (this.gradeChart) {
        this.gradeChart.dispose();
        this.gradeChart = null;
      }
      if (this.courseChart) {
        this.courseChart.dispose();
        this.courseChart = null;
      }
    },

    handleDataLoaded(data) {
      this.hasData = data && data.length > 0;

      if (this.hasData) {
        this.$nextTick(() => {
          this.disposeCharts();
          this.initCharts();
          setTimeout(() => {
            this.renderGradeDistributionChart(data);
            this.renderCourseAvgChart(data);
          }, 100);
        });
      } else {
        this.disposeCharts();
      }
    },

    renderGradeDistributionChart(data) {
      if (!this.gradeChart || !this.$refs.gradeDistributionChart) return;

      const gradeDistribution = [0, 0, 0, 0, 0];
      data.forEach(item => {
        const grade = item.grade || 0;
        if (grade >= 90) gradeDistribution[0]++;
        else if (grade >= 80) gradeDistribution[1]++;
        else if (grade >= 70) gradeDistribution[2]++;
        else if (grade >= 60) gradeDistribution[3]++;
        else gradeDistribution[4]++;
      });

      const option = {
        title: {
          text: '学生成绩分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}: {c}人 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['优秀(90-100)', '良好(80-89)', '中等(70-79)', '及格(60-69)', '不及格(0-59)']
        },
        series: [{
          name: '成绩分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          label: {
            show: true,
            formatter: '{b}: {c}人 ({d}%)'
          },
          data: [
            { value: gradeDistribution[0], name: '优秀(90-100)' },
            { value: gradeDistribution[1], name: '良好(80-89)' },
            { value: gradeDistribution[2], name: '中等(70-79)' },
            { value: gradeDistribution[3], name: '及格(60-69)' },
            { value: gradeDistribution[4], name: '不及格(0-59)' }
          ],
          itemStyle: {
            color: function(params) {
              const colorList = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];
              return colorList[params.dataIndex];
            }
          }
        }]
      };

      this.gradeChart.setOption(option);
      window.addEventListener('resize', () => this.gradeChart.resize());
    },

    renderCourseAvgChart(data) {
      if (!this.courseChart || !this.$refs.courseAvgChart) return;

      const courseMap = {};
      data.forEach(item => {
        if (!courseMap[item.cid]) {
          courseMap[item.cid] = {
            name: item.cname,
            total: 0,
            count: 0
          };
        }
        courseMap[item.cid].total += item.grade || 0;
        courseMap[item.cid].count++;
      });

      const courses = Object.values(courseMap).map(course => ({
        name: course.name,
        avg: course.count > 0 ? Math.round((course.total / course.count) * 100) / 100 : 0
      }));

      const option = {
        title: {
          text: '课程平均成绩',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>平均成绩: {c}分'
        },
        xAxis: {
          type: 'category',
          data: courses.map(item => item.name),
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '平均成绩',
          min: 0,
          max: 100
        },
        series: [{
          name: '平均成绩',
          type: 'bar',
          data: courses.map(item => ({
            value: item.avg,
            name: item.name
          })),
          itemStyle: {
            color: function(params) {
              const value = params.value;
              if (value >= 90) return '#4CAF50';
              if (value >= 80) return '#8BC34A';
              if (value >= 70) return '#FFC107';
              if (value >= 60) return '#FF9800';
              return '#F44336';
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}分'
          }
        }]
      };

      this.courseChart.setOption(option);
      window.addEventListener('resize', () => this.courseChart.resize());
    }
  }
};
</script>

<style scoped>
.chart-container {
  margin-bottom: 20px;
}

.el-card {
  margin-bottom: 20px;
}

.el-card__body {
  min-height: 400px;
}

[ref="gradeDistributionChart"],
[ref="courseAvgChart"] {
  width: 100%;
  height: 400px;
}
</style>