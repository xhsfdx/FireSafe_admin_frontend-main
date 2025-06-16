<template>
  <div class="work-report-list-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-input v-model="filters.projectName" placeholder="输入项目名称搜索" style="width:220px" clearable />
      <el-input v-model="filters.owner" placeholder="输入当前所属人搜索" style="width:220px" clearable />
      <el-select v-model="filters.status" placeholder="选择工单状态" style="width:180px" clearable>
        <el-option label="待处理" value="待处理" />
        <el-option label="处理中" value="处理中" />
        <el-option label="已完成" value="已完成" />
      </el-select>
      <el-select v-model="filters.timeliness" placeholder="工单时效选择" style="width:180px" clearable>
        <el-option label="正常" value="正常" />
        <el-option label="已逾期" value="已逾期" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 16px"
      :header-cell-style="{fontWeight:'bold',fontSize:'15px'}"
      :empty-text="' '"
    >
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="reportTime" label="上报时间" align="center" />
      <el-table-column prop="reporter" label="上报人员" align="center" />
      <el-table-column prop="timeliness" label="工单时效" align="center" />
      <el-table-column prop="status" label="工单状态" align="center" />
      <el-table-column prop="owner" label="当前所属人" align="center" />
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">详情</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 无数据时自定义内容 -->
    <div
      v-if="tableData.length === 0"
      class="table-empty"
    >
      <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">

      <div class="empty-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkReportListPage',
  data() {
    return {
      filters: {
        projectName: '',
        owner: '',
        status: '',
        timeliness: ''
      },
      tableData: [] // 没有数据时展示暂无数据
    }
  },
  methods: {
    onSearch() {
      // 实际项目应接接口
      this.$message.info('演示：没有数据')
      this.tableData = []
    },
    onReset() {
      this.filters = { projectName: '', owner: '', status: '', timeliness: '' }
      this.tableData = []
    },
    viewDetail(row) {
      this.$message.info('详情')
    },
    onSetting() {
      this.$message.info('设置')
    }
  }
}
</script>

<style scoped>
.work-report-list-page {
  min-height: 100vh;
  background: #fff;
  padding: 10px 12px 0 10px;
  position: relative;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 0 10px;
  flex-wrap: wrap;
}
.search-bar > * {
  margin-right: 0 !important;
  min-width: 120px;
}
.table-empty {
  position: absolute;
  top: 140px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 2;
  user-select: none;
}
.empty-img {
  width: 120px;
  opacity: 0.7;
  margin-bottom: 8px;
}
.empty-text {
  color: #888;
  font-size: 16px;
}
.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
