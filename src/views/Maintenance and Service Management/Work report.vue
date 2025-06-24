<template>
  <div class="report-download-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-input
        v-model="filters.projectName"
        placeholder="输入项目名称搜索"
        style="width: 220px; margin-right: 10px"
        clearable
      />
      <el-input v-model="filters.reporter" placeholder="输入上报人员搜索" style="width: 220px; margin-right: 10px" clearable />
      <el-select v-model="filters.type" placeholder="选择上报类型" style="width: 180px; margin-right: 10px" clearable>
        <el-option label="全部" value="" />
        <el-option label="类型一" value="类型一" />
        <el-option label="类型二" value="类型二" />
      </el-select>
      <el-date-picker
        v-model="filters.dateRange"
        type="daterange"
        range-separator=" - "
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 300px; margin-right: 10px"
        value-format="yyyy-MM-dd"
        clearable
      />
      <el-button type="primary" icon="el-icon-search" style="margin-right:8px" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" style="margin-right:8px" @click="onReset">重置</el-button>
      <el-button type="success" style="margin-right:0; font-weight:bold" @click="onDownload">一键下载所选报告</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="pagedData"
      border
      style="width: 100%; margin-top: 12px;"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      :empty-text="' '"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="48" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="orgName" label="业主单位名称" align="center" />
      <el-table-column prop="type" label="上报类型" align="center" />
      <el-table-column prop="reportTime" label="上报时间" align="center" />
      <el-table-column prop="reporter" label="上报人员" align="center" />
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">详情</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 无数据自定义内容 -->
    <div v-if="pagedData.length === 0" class="table-empty">
      <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">

      <div class="empty-text">暂无数据</div>
    </div>

    <!-- 悬浮设置按钮（如不需要可删掉） -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
  </div>
</template>

<script>
export default {
  name: 'ReportDownloadPage',
  data() {
    return {
      filters: {
        projectName: '',
        reporter: '',
        type: '',
        dateRange: []
      },
      tableData: [], // 表格数据
      pagedData: [],
      selectedRows: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  watch: {
    currentPage() {
      this.updatePagedData()
    }
  },
  created() {
    this.updatePagedData()
  },
  methods: {
    onSearch() {
      // 实际开发这里过滤或请求接口
      this.currentPage = 1
      this.updatePagedData()
    },
    onReset() {
      this.filters = { projectName: '', reporter: '', type: '', dateRange: [] }
      this.currentPage = 1
      this.updatePagedData()
    },
    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      this.pagedData = this.tableData.slice(start, start + this.pageSize)
    },
    onSelectionChange(val) {
      this.selectedRows = val
    },
    onDownload() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择要下载的报告')
      } else {
        this.$message.success('已下载所选报告')
      }
    },
    viewDetail(row) {
      this.$message.info('查看详情')
    },
    onSetting() {
      this.$message.info('设置')
    }
  }
}
</script>

<style scoped>
.report-download-page {
  min-height: 100vh;
  background: #fff;
  padding: 10px 12px 0 10px;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.table-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 160px;
  text-align: center;
  z-index: 2;
  user-select: none;
}

.empty-img {
  width: 180px;
  opacity: 0.75;
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
