<!-- 续签配置维保人员 -->
<template>
  <div class="renewal-maintain-staff">
    <!-- 顶部步骤栏插槽由父页面控制，这里只做内容区 -->
    <div class="main-card">
      <!-- 顶部操作栏 -->
      <div class="table-tools">
        <el-input
          v-model="filter.project"
          class="search-input"
          placeholder="输入项目名称搜索"
          clearable
          size="medium"
        />
        <el-button type="primary" icon="el-icon-search" class="ml8" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh" class="ml8" @click="onReset">重置</el-button>
        <el-button type="success" class="ml8" style="background:#3ccf4d;border:none;font-size:16px;" @click="onOneClick">
          <i class="el-icon-link" style="margin-right:4px;" />一键配置勾选项目
        </el-button>
      </div>
      <!-- 表格区域 -->
      <el-table
        :data="tableData"
        border
        class="data-table"
        style="margin-top:18px"
        height="420px"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="index" label="序号" width="70" align="center" />
        <el-table-column prop="owner" label="业主单位名称" width="120" align="center" />
        <el-table-column prop="projectName" label="项目名称" width="120" align="center" />
        <el-table-column prop="techManager" label="维保技术负责人" align="center" />
        <el-table-column prop="projManager" label="维保项目负责人" align="center" />
        <el-table-column prop="worker" label="现场维保人员" align="center" />
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-link type="primary" style="font-size: 15px;">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部按钮 -->
      <div class="footer-btns">
        <el-button class="prev-btn" @click="prevStep">上一步</el-button>
        <el-button class="create-btn" type="primary" @click="finishCreate">完成创建</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RenewwalConfigureMaintenancePersonnel',
  data() {
    return {
      filter: { project: '' },
      tableData: [
        {
          index: 1,
          owner: '小学',
          projectName: '1',
          techManager: '邱峰',
          projManager: '王蕾',
          worker: '黎建军'
        }
      ]
    }
  },
  methods: {
    onSearch() {},
    onReset() { this.filter.project = '' },
    onOneClick() { this.$message.success('已一键配置（模拟）') },
    prevStep() { this.$emit('prev') },
    finishCreate() { this.$emit('finish') }
  }
}
</script>

<style scoped>
.renewal-maintain-staff {
  background: #f5f6fa;
  min-height: 100vh;
}
.main-card {
  background: #fff;
  border-radius: 11px;
  margin: 24px 1.8% 0 1.8%;
  padding: 28px 32px 34px 32px;
  box-shadow: 0 4px 20px #dbefff22;
}
.table-tools {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  gap: 8px;
}
.search-input {
  width: 270px;
  font-size: 16px;
}
.ml8 {
  margin-left: 8px;
}
.data-table ::v-deep th {
  background: #f7fbff;
  font-size: 16px;
  color: #222;
}
.data-table ::v-deep td, .data-table ::v-deep th {
  padding: 13px 0 !important;
  font-size: 15px;
}
.footer-btns {
  margin-top: 36px;
  display: flex;
  justify-content: center;
  gap: 34px;
}
.prev-btn {
  width: 130px;
  height: 44px;
  font-size: 19px;
  background: #fff;
  border: 1.7px solid #e0e6ee;
  border-radius: 8px;
  color: #222;
  letter-spacing: 8px;
}
.create-btn {
  width: 170px;
  height: 44px;
  font-size: 20px;
  background: #1888fe;
  border-radius: 8px;
  letter-spacing: 9px;
  border: none;
}
.create-btn:hover {
  background: #157de6;
}
</style>
