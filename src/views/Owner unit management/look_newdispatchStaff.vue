<template>
  <div class="app-container">
    <div class="dispatch-staff-page">
      <!-- 搜索与按钮区 -->
      <div class="toolbar">
        <el-input v-model="search" placeholder="输入项目名称搜索" class="input" clearable />
        <el-button type="primary" @click="query">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="success">一键配置勾选项目</el-button>
      </div>

      <!-- 表格区 -->
      <el-table :data="filteredTableData" border>
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" width="50" type="index" />
        <el-table-column label="业主单位名称" prop="ownerName" />
        <el-table-column label="项目名称" prop="projectName" />
        <el-table-column label="维保技术负责人" prop="techLeader" />
        <el-table-column label="维保项目负责人" prop="projectLeader" />
        <el-table-column label="现场维保人员" prop="onSiteStaff" />
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="handleConfig(scope.row)">配置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部按钮 -->
      <div class="footer">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">完成创建</el-button>
      </div>

      <!-- 弹窗 -->
      <el-dialog title="配置维保人员" :visible.sync="showDialog" width="700px" destroy-on-close>
        <DispatchStaff :data="currentRow" @submit="onDialogConfirm" @cancel="showDialog = false" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import DispatchStaff from '@/views/Maintenance and Service Management/DispatchStaff.vue'

export default {
  name: 'AddNewDispatchStaff',
  components: { DispatchStaff },
  props: {
    formData: {
      type: Object,
      default: () => ({ projectList: [], dispatchStaffList: [] })
    }
  },
  data() {
    return {
      search: '',
      showDialog: false,
      currentRow: {},
      tableData: []
    }
  },
  computed: {
    filteredTableData() {
      if (!this.search) {
        return this.tableData
      }
      return this.tableData.filter(
        data => data.projectName && data.projectName.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        if (newVal && newVal.projectList) {
          if (newVal.dispatchStaffList && newVal.dispatchStaffList.length) {
            this.tableData = JSON.parse(JSON.stringify(newVal.dispatchStaffList))
          } else {
            this.tableData = newVal.projectList.map(p => ({
              ownerName: p.ownerName,
              projectName: p.name,
              techLeader: '',
              projectLeader: '',
              onSiteStaff: ''
            }))
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    query() {
      // The computed property 'filteredTableData' handles the search
    },
    reset() {
      this.search = ''
    },
    handleConfig(row) {
      this.currentRow = { ...row }
      this.showDialog = true
    },
    onDialogConfirm(newData) {
      if (!this.currentRow.projectName) {
        this.$message.error('未找到当前行的项目名称，无法保存！')
        return
      }
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
        this.emitUpdate()
      }
      this.showDialog = false
    },
    prevStep() {
      this.emitUpdate()
      this.$emit('prev')
    },
    nextStep() {
      this.emitUpdate()
      this.$emit('submit')
    },
    emitUpdate() {
      this.$emit('update', { dispatchStaffList: this.tableData })
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.dispatch-staff-page {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}
.toolbar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.input {
  width: 240px;
}
.footer {
  margin-top: 20px;
  text-align: center;
}
</style> 