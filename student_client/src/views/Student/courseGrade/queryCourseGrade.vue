<template>
  <div>
    <el-form>
      <el-form-item label="选择学期">
        <el-select v-model="term" placeholder="请选择学期">
          <el-option v-for="(item, index) in termList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-card>
      <el-table
          :data="tableData"
          border
          style="width: 100%">
        <el-table-column
            fixed
            prop="cid"
            label="课号"
            width="150">
        </el-table-column>
        <el-table-column
            prop="cname"
            label="课程名"
            width="150">
        </el-table-column>
        <el-table-column
            prop="tid"
            label="教师号"
            width="150">
        </el-table-column>
        <el-table-column
            prop="tname"
            label="教师名称"
            width="150">
        </el-table-column>
        <el-table-column
            prop="ccredit"
            label="学分"
            width="150">
        </el-table-column>
        <el-table-column
            prop="grade"
            label="成绩"
            width="150">
          <template #default="{row}">
            <el-tag :type="getGradeTagType(row.grade)">
              {{ row.grade }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="summary">
        <p>平均成绩：<span class="highlight">{{ avg.toFixed(2) }}</span></p>
        <p>总学分：<span class="highlight">{{ totalCredit }}</span></p>
      </div>

      <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="changePage"
      >
      </el-pagination>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <div ref="gradeChart" style="width: 100%; height: 450px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div ref="creditChart" style="width: 100%; height: 450px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  methods: {
    changePage(page) {
      page = page - 1;
      const that = this;
      let start = page * that.pageSize, end = that.pageSize * (page + 1);
      let length = that.tmpList.length;
      let ans = (end < length) ? end : length;
      that.tableData = that.tmpList.slice(start, ans);
    },

    getGradeTagType(grade) {
      if (grade >= 90) return 'success';
      if (grade >= 80) return '';
      if (grade >= 70) return 'warning';
      if (grade >= 60) return 'danger';
      return 'info';
    },

    renderCharts() {
      if (!this.tmpList || this.tmpList.length === 0) return;

      // 成绩分布图表
      const gradeChart = echarts.init(this.$refs.gradeChart);
      const gradeOption = {
        title: {
          text: '成绩分布',
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['90-100', '80-89', '70-79', '60-69', '0-59']
        },
        series: [
          {
            name: '成绩分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              { value: this.gradeDistribution[0], name: '90-100' },
              { value: this.gradeDistribution[1], name: '80-89' },
              { value: this.gradeDistribution[2], name: '70-79' },
              { value: this.gradeDistribution[3], name: '60-69' },
              { value: this.gradeDistribution[4], name: '0-59' }
            ],
            itemStyle: {
              color: function(params) {
                const colorList = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];
                return colorList[params.dataIndex];
              }
            }
          }
        ]
      };
      gradeChart.setOption(gradeOption);

      // 学分分布图表
      const creditChart = echarts.init(this.$refs.creditChart);
      const creditOption = {
        title: {
          text: '学分与成绩分布',
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return `课程: ${params[0].name}<br/>学分: ${params[0].value}<br/>成绩: ${params[0].data.grade}`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.tmpList.map(item => item.cname),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '学分',
            position: 'left'
          },
          {
            type: 'value',
            name: '成绩',
            min: 0,
            max: 100,
            position: 'right',
            axisLabel: {
              formatter: '{value} 分'
            }
          }
        ],
        series: [
          {
            name: '学分',
            data: this.tmpList.map(item => ({
              value: item.ccredit,
              name: item.cname,
              grade: item.grade
            })),
            type: 'bar',
            itemStyle: {
              color: function(params) {
                const grade = params.data.grade;
                if (grade >= 90) return '#4CAF50';
                if (grade >= 80) return '#8BC34A';
                if (grade >= 70) return '#FFC107';
                if (grade >= 60) return '#FF9800';
                return '#F44336';
              }
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{@grade}分'
            }
          },
          {
            name: '成绩',
            type: 'line',
            yAxisIndex: 1,
            data: this.tmpList.map(item => item.grade),
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#1890FF'
            },
            lineStyle: {
              width: 3
            }
          }
        ]
      };
      creditChart.setOption(creditOption);

      // 窗口大小变化时重绘图表
      window.addEventListener('resize', function() {
        gradeChart.resize();
        creditChart.resize();
      });

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', function() {
          gradeChart.resize();
          creditChart.resize();
        });
      });
    },

    calculateGradeDistribution() {
      this.gradeDistribution = [0, 0, 0, 0, 0];
      this.totalCredit = 0;

      this.tmpList.forEach(item => {
        this.totalCredit += item.ccredit;

        if (item.grade >= 90) this.gradeDistribution[0]++;
        else if (item.grade >= 80) this.gradeDistribution[1]++;
        else if (item.grade >= 70) this.gradeDistribution[2]++;
        else if (item.grade >= 60) this.gradeDistribution[3]++;
        else this.gradeDistribution[4]++;
      });
    }
  },

  data() {
    return {
      tableData: [],
      pageSize: 10,
      total: 0,
      tmpList: [],
      avg: 0,
      totalCredit: 0,
      term: sessionStorage.getItem('currentTerm'),
      termList: [],
      gradeDistribution: [0, 0, 0, 0, 0] // [90-100, 80-89, 70-79, 60-69, 0-59]
    };
  },

  created() {
    const that = this;
    axios.get('http://localhost:10086/SCT/findAllTerm').then(function(resp) {
      that.termList = resp.data;
    });
  },

  watch: {
    term: {
      handler(newTerm) {
        const sid = sessionStorage.getItem('sid');
        const that = this;

        axios.get('http://localhost:10086/SCT/findBySid/' + sid + '/' + newTerm).then(function(resp) {
          that.tmpList = resp.data;
          that.total = resp.data.length;

          let start = 0, end = that.pageSize;
          let length = that.tmpList.length;
          let ans = (end < length) ? end : length;
          that.tableData = that.tmpList.slice(start, end);

          let totalScore = 0;
          let totalCredit = 0;
          that.avg = 0;

          that.tmpList.forEach(item => {
            totalCredit += item.ccredit;
            totalScore += item.ccredit * item.grade;
          });

          that.totalCredit = totalCredit;
          that.avg = totalCredit === 0 ? 0 : totalScore / totalCredit;

          that.calculateGradeDistribution();
          that.$nextTick(() => {
            that.renderCharts();
          });
        });
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.summary {
  margin: 20px 0;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.summary p {
  margin: 5px 0;
  font-size: 16px;
}

.highlight {
  font-weight: bold;
  color: #409EFF;
}

.el-card {
  margin-bottom: 20px;
}

.el-row {
  margin-top: 20px;
}
</style>