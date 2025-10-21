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
        <el-table-column prop="ownerName" label="业主单位名称" width="120" align="center" />
        <el-table-column prop="projectName" label="项目名称" width="120" align="center" />
        <el-table-column prop="techLeader" label="维保技术负责人" align="center" />
        <el-table-column prop="projectLeader" label="维保项目负责人" align="center" />
        <el-table-column prop="onSiteStaff" label="现场维保人员" align="center" />
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="handleConfig(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部按钮 -->
      <div class="footer-btns">
        <el-button class="prev-btn" @click="prevStep">上一步</el-button>
        <el-button class="create-btn" type="primary" @click="finishCreate">完成创建</el-button>
      </div>
    </div>
    <el-dialog
      title="配置维保人员"
      :visible.sync="showDialog"
      width="700px"
      @close="showDialog = false"
      destroy-on-close
    >
      <DispatchStaff
        :data="currentRow"
        @submit="onDialogConfirm"
      />
    </el-dialog>
  </div>
</template>

<script>
import DispatchStaff from '@/views/Maintenance and Service Management/DispatchStaff.vue'
export default {
  name: 'RenewwalConfigureMaintenancePersonnel',
  components: { DispatchStaff },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      filter: { project: '' },
      tableData: [],
      currentRow: null,
      showDialog: false
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        if (newVal && newVal.projectList) {
          if (newVal.dispatchStaffList && newVal.dispatchStaffList.length) {
            this.tableData = JSON.parse(JSON.stringify(newVal.dispatchStaffList))
          } else {
            this.tableData = newVal.projectList.map((p, idx) => ({
              index: idx + 1,
              ownerName: p.ownerName || newVal.entrustName || '',
              projectName: p.name,
              techLeader: '',
              projectLeader: '',
              onSiteStaff: '',
              maintainPersons: { technical: '', leader: '', maintainer: [] }
            }))
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    console.log('Renewwal Configure maintenance personnel 组件已创建')
    console.log('初始 formData:', this.formData)
    console.log('初始 tableData:', this.tableData)
  },
  methods: {
    onSearch() {},
    onReset() { this.filter.project = '' },
    onOneClick() { this.$message.success('已一键配置（模拟）') },
    prevStep() { this.$emit('prev') },
    handleConfig(row) {
      this.currentRow = { ...row }
      this.showDialog = true
    },
    onDialogConfirm(newData) {
      const index = this.tableData.findIndex(item => item.projectName === this.currentRow.projectName)
      if (index !== -1) {
        const maintainPersons = {
          technical: newData.maintainPersons.technical || '',
          leader: newData.maintainPersons.leader || '',
          maintainer: Array.isArray(newData.maintainPersons.maintainer) ? newData.maintainPersons.maintainer.filter(Boolean) : []
        }
        const updatedRow = {
          ...this.tableData[index],
          techLeader: maintainPersons.technical,
          projectLeader: maintainPersons.leader,
          onSiteStaff: (maintainPersons.maintainer || []).join('、'),
          maintainPersons
        }
        this.$set(this.tableData, index, updatedRow)
        this.$emit('update', { dispatchStaffList: this.tableData })
      }
      this.showDialog = false
    },
    finishCreate() {
      const cleanTableData = this.tableData.map(row => ({
        ...row,
        maintainPersons: {
          technical: row.maintainPersons?.technical || '',
          leader: row.maintainPersons?.leader || '',
          maintainer: Array.isArray(row.maintainPersons?.maintainer) ? row.maintainPersons.maintainer.filter(Boolean) : []
        }
      }))
      this.$emit('update', { dispatchStaffList: cleanTableData })
      this.$emit('submit', { dispatchStaffList: cleanTableData })
    }
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
