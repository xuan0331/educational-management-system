<template>
  <div>
    <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%">
      <el-table-column
          fixed
          prop="cid"
          label="课程号"
          width="150">
      </el-table-column>
      <el-table-column
          prop="cname"
          label="课程名"
          width="150">
      </el-table-column>
      <el-table-column
          fixed
          prop="sid"
          label="学号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="sname"
          label="学生名"
          width="100">
      </el-table-column>
      <el-table-column
          prop="grade"
          label="成绩"
          width="100">
      </el-table-column>
      <el-table-column
          prop="term"
          label="学期"
          width="100">
      </el-table-column>
      <el-table-column
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="editor(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p>
      总平均成绩：{{ avg }}
    </p>


    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  methods: {
    select(row) {
      console.log(row)
    },
    changePage(page) {
      page = page - 1
      const that = this
      let start = page * that.pageSize, end = that.pageSize * (page + 1)
      let length = that.tmpList.length
      let ans = (end < length) ? end : length
      that.tableData = that.tmpList.slice(start, ans)
    },
    editor(row) {
      this.$router.push({
        path: '/editorGradeCourse',
        query: {
          cid: row.cid,
          tid: row.tid,
          sid: row.sid,
          term: row.term
        }
      })
    },
    loadData() {
      const that = this
      axios.post("http://localhost:10086/SCT/findBySearch", this.ruleForm)
          .then(function (resp) {
            that.tmpList = resp.data
            that.total = resp.data.length
            let start = 0, end = that.pageSize
            let length = that.tmpList.length
            let ans = (end < length) ? end : length
            that.tableData = that.tmpList.slice(start, ans)

            that.avg = 0
            for (let i = 0; i < that.tmpList.length; i++) {
              that.avg += that.tmpList[i].grade
            }
            that.avg = that.total > 0 ? that.avg / that.total : 0

            // 新增：触发数据加载事件
            that.$emit('data-loaded', resp.data)
          })
          .catch(error => {
            console.error("查询出错:", error)
            // 新增：即使出错也触发事件，传递空数组
            that.$emit('data-loaded', [])
          })
    }
  },
  data() {
    return {
      tableData: null,
      pageSize: 10,
      total: null,
      tmpList: null,
      avg: 0,
    }
  },
  props: {
    ruleForm: Object,
  },
  watch: {
    ruleForm: {
      handler(newRuleForm) {
        console.log("组件监听 form", newRuleForm)
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>