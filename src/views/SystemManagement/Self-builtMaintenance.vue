<template>
  <div class="maintain-project-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-select v-model="filters.system" placeholder="消防系统" style="width: 200px; margin-right: 16px" clearable>
        <el-option v-for="item in systemList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="filters.project" placeholder="维保项目" style="width: 200px; margin-right: 16px" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-right: 8px" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" style="margin-right: 8px" @click="onReset">重置</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%; margin-top: 16px" :empty-text="' '">
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="system" label="消防系统" align="center" />
      <el-table-column prop="project" label="维保项目" align="center" />
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">详情</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 无数据时自定义内容 -->
    <div v-if="tableData.length === 0" class="table-empty">
      <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">

      <div class="empty-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaintainProjectPage',
  data() {
    return {
      filters: {
        system: '',
        project: ''
      },
      systemList: ['消防系统', '喷淋系统', '水炮系统'],
      tableData: [] // 空数据时自动展示暂无数据提示
    }
  },
  methods: {
    onSearch() {
      // 实际项目这里加接口查询
      this.$message.success('查询功能演示')
    },
    onReset() {
      this.filters.system = ''
      this.filters.project = ''
      this.tableData = []
    },
    onAdd() {
      // 跳转到新增自建维保项目页面
      this.$router.push({ name: 'AddSelfBuiltMaintenanceProject' })
      // 或者用 path，如果你知道具体 path
      // this.$router.push('/system-management/add-self-built-maintenance-project')
    }
    // onSetting() {
    //   this.$message.info('点击了设置')
    // }
  }
}
</script>

<style scoped>
.maintain-project-page {
  min-height: 100vh;
  background: #fff;
  padding: 8px 12px 0 8px;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 4px;
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

/* .setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
} */
</style>
