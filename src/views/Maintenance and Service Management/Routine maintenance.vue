<template>
  <div class="plan-task-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-input v-model="filters.projectName" placeholder="输入项目名称搜索" style="width:220px" clearable />
      <el-select v-model="filters.planType" placeholder="选择计划类型" style="width:180px" clearable>
        <el-option label="月" value="月" />
        <el-option label="季" value="季" />
        <el-option label="半年" value="半年" />
        <el-option label="年" value="年" />
      </el-select>
      <el-select v-model="filters.taskStatus" placeholder="任务状态" style="width:180px" clearable>
        <el-option label="待处理" value="待处理" />
        <el-option label="处理中" value="处理中" />
        <el-option label="待审批" value="待审批" />
        <el-option label="已完成" value="已完成" />
      </el-select>
      <el-select v-model="filters.taskTimeliness" placeholder="任务时效" style="width:180px" clearable>
        <el-option label="正常" value="正常" />
        <el-option label="已逾期" value="已逾期" />
      </el-select>
      <el-date-picker
        v-model="filters.taskDate"
        type="daterange"
        range-separator=" 至 "
        start-placeholder="选择任务日期"
        end-placeholder=""
        style="width:240px"
        value-format="yyyy-MM-dd"
        clearable
      />
      <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="pagedData"
      border
      style="width: 100%; margin-top: 12px;"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="planType" label="计划类型" align="center">
        <template slot-scope="{ row }">
          <span style="color:#39c271;">{{ row.planType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" label="任务名称" align="center" />
      <el-table-column prop="taskId" label="任务ID" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.taskId.slice(0, 7) }}...</span>
        </template>
      </el-table-column>
      <el-table-column prop="principal" label="项目负责人" align="center" />
      <el-table-column prop="worker" label="现场维护人员" align="center" />
      <el-table-column prop="taskStatus" label="任务状态" align="center">
        <template slot-scope="{ row }">
          <span
            :style="{
              color: row.taskStatus === '待处理' ? '#333' :
                row.taskStatus === '处理中' ? '#409eff' :
                row.taskStatus === '已完成' ? '#39c271' : '#333',
              fontWeight: row.taskStatus === '已完成' ? 'bold' : 'normal'
            }"
          >{{ row.taskStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="timeliness" label="任务时效" align="center">
        <template slot-scope="{ row }">
          <span
            :style="{
              color: row.timeliness === '正常' ? '#409eff' : '#ff4d1a',
              fontWeight: row.timeliness === '已逾期' ? 'bold' : 'normal'
            }"
          >{{ row.timeliness }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="platform" label="省网平台" align="center" />
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">详情</el-link>
          <el-link
            v-if="row.taskStatus === '待处理' || row.taskStatus === '处理中'"
            style="margin-left:10px"
            @click="dispatchWorker(row)"
          >改派人员</el-link>
          <el-link
            v-if="row.taskStatus === '已完成'"
            style="margin-left:10px;color:#1bc67c"
            @click="viewReport(row)"
          >查看报告</el-link>
          <el-link style="margin-left:10px;color:#ff4d1a" @click="onDelete(row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页和统计 -->
    <div class="footer-bar">
      <span>共查询到 {{ filteredData.length }} 条</span>
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        :total="filteredData.length"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { getMaintainTasks, deleteMaintainTask } from '@/api/maintainTask'

export default {
  name: 'PlanTaskPage',
  data() {
    return {
      filters: {
        projectName: '',
        planType: '',
        taskStatus: '',
        taskTimeliness: '',
        taskDate: []
      },
      tableData: [],
      filteredData: [],
      pagedData: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  watch: {
    currentPage() {
      this.updatePagedData()
    }
  },
  mounted() {
    this.loadData()
  },
  activated() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        if (this.filters.projectName) params.projectName = this.filters.projectName
        if (this.filters.planType) params.planType = this.filters.planType
        if (this.filters.taskStatus) params.status = this.filters.taskStatus
        if (this.filters.taskTimeliness) params.timeliness = this.filters.taskTimeliness

        const res = await getMaintainTasks(params)
        if (res.success) {
          this.tableData = res.data || []
          this.filteredData = this.tableData
          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          }
        } else {
          this.tableData = []
          this.filteredData = []
          this.pagination.total = 0
          this.$message.error(res.message || '获取数据失败')
        }
      } catch (e) {
        this.tableData = []
        this.filteredData = []
        this.pagination.total = 0
        this.$message.error('网络异常或接口出错')
      }
      this.loading = false
      this.updatePagedData()
    },
    viewDetail(row) {
      this.$router.push({ 
        name: 'TaskDetail',
        params: { id: row._id }
      })
    },
    dispatchWorker(row) {
      this.$router.push({
        name: 'DispatchStaff',
        params: { id: row._id }
      })
    },
    viewReport(row) {
      // 推荐把 pdf 路径提前存在 row.reportUrl 字段，动态切换更方便
      const url = row.reportUrl || '/Routine Maintenance Reports/高坪汽车站消防维保服务2025年4月任务.pdf'
      window.open(url, '_blank')
    },
    async onDelete(row) {
      try {
        await this.$confirm(`确定删除「${row.projectName}」的维护任务吗？`, '提示', { type: 'warning' })
        const res = await deleteMaintainTask(row._id)
        if (res.success) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (err) {
        // 用户取消无需处理
      }
    },
    onSetting() {
      this.$message.info('设置')
    },
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    onReset() {
      this.filters = { projectName: '', planType: '', taskStatus: '', taskTimeliness: '', taskDate: [] }
      this.pagination.page = 1
      this.loadData()
    },
    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      this.pagedData = this.filteredData.slice(start, start + this.pageSize)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.updatePagedData()
    }
  }
}
</script>

<style scoped>
.plan-task-page {
  min-height: 100vh;
  background: #fff;
  padding: 10px 12px 0 10px;
  position: relative;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
  gap: 0 10px;
}

.search-bar>* {
  margin-right: 0 !important;
  min-width: 120px;
}

.footer-bar {
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 0 36px 0 0;
  box-shadow: 0 -2px 6px -4px #eee;
  z-index: 10;
  margin-top: 16px;
}

.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
