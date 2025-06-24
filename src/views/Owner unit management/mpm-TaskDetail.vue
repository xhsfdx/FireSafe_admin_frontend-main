<template>
  <div class="task-detail-root">
    <el-row :gutter="14" style="margin-bottom:16px;">
      <el-col :span="5">
        <el-select v-model="filter.time" placeholder="任务时效" style="width: 100%;">
          <el-option label="全部" value="" />
          <el-option label="正常" value="正常" />
          <el-option label="已逾期" value="已逾期" />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="filter.status" placeholder="任务状态" style="width: 100%;">
          <el-option label="全部" value="" />
          <el-option label="处理中" value="处理中" />
          <el-option label="待审批" value="待审批" />
          <el-option label="待处理" value="待处理" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-col>
      <el-col :span="3">
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="onGenerateTask">生成任务</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border>
      <el-table-column prop="index" label="序号" width="60" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="planType" label="计划类型" align="center" />
      <el-table-column prop="taskName" label="任务名称" align="center" />
      <el-table-column prop="manager" label="项目负责人" align="center" />
      <el-table-column prop="worker" label="现场维保人员" align="center" />
      <el-table-column prop="taskStatus" label="任务状态" align="center" />
      <el-table-column prop="taskTime" label="任务时效" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="goDetail(row)">详情</el-link>
          <el-link
            v-if="row.taskStatus === '待处理'"
            type="success"
            style="margin-left:8px;"
            @click="goDispatchStaff(row)"
          >
            改派人员
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'TaskDetail',
  data() {
    return {
      filter: { time: '', status: '' },
      tableData: [
        { index: 1, projectName: '小学', planType: '月', taskName: '2025年6月任务', manager: '王蕾', worker: '黎建军', taskStatus: '处理中', taskTime: '正常' },
        { index: 2, projectName: '小学', planType: '月', taskName: '2025年6月任务', manager: '王蕾', worker: '黎建军', taskStatus: '待审批', taskTime: '正常' },
        { index: 3, projectName: '小学', planType: '月', taskName: '2025年6月任务', manager: '王蕾', worker: '黎建军', taskStatus: '待审批', taskTime: '正常' },
        { index: 4, projectName: '小学', planType: '月', taskName: '2025年5月任务', manager: '王蕾', worker: '黎建军', taskStatus: '待处理', taskTime: '已逾期' },
        { index: 5, projectName: '小学', planType: '月', taskName: '2025年4月任务', manager: '王蕾', worker: '黎建军', taskStatus: '待审批', taskTime: '已逾期' }
      ]
    }
  },
  methods: {
    onSearch() {
      // 实际项目可根据 filter 搜索
    },
    onReset() {
      this.filter = { time: '', status: '' }
    },
    onGenerateTask() {
      this.$message.success('已生成任务（模拟）')
    },
    goDispatchStaff(row) {
      this.$router.push({
        name: 'DispatchStaff', // 你的路由name
        query: { taskName: row.taskName }
      })
    },
    goDetail(row) {
      this.$router.push({
        name: 'mpmTD-detail', // 你的mpmTD-detail路由name
        query: { taskName: row.taskName }
      })
    }
  }
}
</script>
<style scoped>
.task-detail-root {
    padding: 18px 16px;
    background: #fff;
    border-radius: 8px;
}
</style>
