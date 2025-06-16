<template>
  <div class="project-list-page">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="filters.name"
        placeholder="输入项目名称搜索"
        class="search-input"
        clearable
      />
      <el-input
        v-model="filters.entrust"
        placeholder="输入委托单位搜索"
        class="search-input"
        clearable
      />
      <el-select
        v-model="filters.status"
        placeholder="选择服务状态"
        class="search-input"
        clearable
      >
        <el-option label="服务中" value="服务中" />
        <el-option label="已到期" value="已到期" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%;"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      :empty-text="' '"
    >
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="name" label="项目名称" align="center" />
      <el-table-column prop="entrust" label="委托单位" align="center" />
      <el-table-column prop="status" label="服务状态" align="center" />
      <el-table-column prop="maintType" label="维保方式" align="center" />
      <el-table-column prop="pointCount" label="点位数量" align="center" />
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-link type="primary" @click="viewDetail(scope.row)">详情</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 空数据图片和文字 -->
    <div class="empty-table" v-if="!tableData.length">
      <img src="@/assets/无数据.jpg" alt="暂无" />
      <div class="empty-desc">暂无数据</div>
    </div>
    <!-- 右下角设置按钮（示意） -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle />
  </div>
</template>

<script>
export default {
  name: 'ProjectListPage',
  data() {
    return {
      filters: {
        name: '',
        entrust: '',
        status: ''
      },
      allData: [],
      tableData: []
    }
  },
  mounted() {
    // 初始化数据为空即可，展示空状态
    this.onSearch()
  },
  methods: {
    onSearch() {
      // 实际开发这里应该是接口请求
      const { name, entrust, status } = this.filters
      this.tableData = this.allData.filter(item =>
        (!name || item.name.includes(name)) &&
        (!entrust || item.entrust.includes(entrust)) &&
        (!status || item.status === status)
      )
    },
    onReset() {
      this.filters = { name: '', entrust: '', status: '' }
      this.onSearch()
    },
    viewDetail(row) {
      this.$message.info('详情功能开发中')
    }
  }
}
</script>

<style scoped>
.project-list-page {
  min-height: 100vh;
  background: #fafbfc;
  padding: 14px 18px 0 18px;
  position: relative;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.search-input {
  width: 240px;
}
.empty-table {
  position: absolute;
  left: 0; right: 0; top: 190px;
  text-align: center;
  z-index: 2;
  user-select: none;
}
.empty-table img {
  width: 170px;
  opacity: 0.7;
  margin-bottom: 12px;
}
.empty-desc {
  color: #888;
  font-size: 16px;
}
.setting-btn {
  position: fixed;
  right: 42px;
  bottom: 120px;
  z-index: 20;
  width: 56px;
  height: 56px;
  font-size: 26px;
  background: #1d8cff;
  border: none;
  box-shadow: 0 4px 24px #b7dfff44;
}
</style>
