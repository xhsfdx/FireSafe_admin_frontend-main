<template>
  <div class="dispatch-staff-page">
    <!-- 搜索与按钮区 -->
    <div class="toolbar">
      <el-input v-model="search" placeholder="输入项目名称搜索" class="input" clearable />
      <el-button type="primary" @click="query">查询</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button type="success">一键配置勾选项目</el-button>
    </div>

    <!-- 表格区 -->
    <el-table :data="tableData" border>
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column label="业主单位名称" prop="ownerUnit" />
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
      <DispatchStaff :data="currentRow" @confirm="onDialogConfirm" @cancel="showDialog = false" />
    </el-dialog>
  </div>
</template>

<script>
import DispatchStaff from '@/views/Maintenance and Service Management/DispatchStaff.vue'

export default {
  name: 'AddNewDispatchStaff',
  components: { DispatchStaff },
  props: {
    formData: Object // 可接收父组件数据（可选）
  },
  data() {
    return {
      search: '',
      showDialog: false,
      currentRow: {},
      tableData: [
        {
          ownerUnit: '12510000452189617W',
          projectName: '1',
          techLeader: '',
          projectLeader: '',
          onSiteStaff: ''
        }
      ]
    }
  },
  mounted() {
    // 如果父组件有传入分配数据，可以初始化
    if (this.formData && this.formData.dispatchStaffList) {
      this.tableData = JSON.parse(JSON.stringify(this.formData.dispatchStaffList))
    }
  },
  methods: {
    query() {
      // 可实现搜索功能
    },
    reset() {
      this.search = ''
    },
    handleConfig(row) {
      this.currentRow = { ...row }
      this.showDialog = true
    },
    onDialogConfirm(newData) {
      // 2024-06-09 修正：将配置弹窗回传的负责人分别赋值到表格字段
      const index = this.tableData.findIndex(item => item.projectName === this.currentRow.projectName)
      const techName = newData.technical ? newData.technical.name : ''
      const leaderName = newData.leader ? newData.leader.name : ''
      const maintainerNames = (newData.maintainer || []).map(p => p.name).join(', ')
      if (index !== -1) {
        this.tableData.splice(index, 1, {
          ...this.tableData[index],
          techLeader: techName, // 维保技术负责人
          projectLeader: leaderName, // 维保项目负责人
          onSiteStaff: maintainerNames, // 现场维保人员
          technical: newData.technical,
          leader: newData.leader,
          maintainer: newData.maintainer
        })
      }
      this.emitUpdate()
      this.showDialog = false
    },
    prevStep() {
      // 回传当前数据，并通知父组件切换步骤
      this.emitUpdate()
      this.$emit('prev')
    },
    nextStep() {
      // 2024-06-09 只负责数据收集，通过update事件同步数据到父组件，不直接请求后端
      this.emitUpdate()
      this.$emit('update', { dispatchStaffList: this.tableData })
      this.$emit('submit') // 通知父组件最终提交
    },
    emitUpdate() {
      // 同步数据到父组件
      this.$emit('update', { dispatchStaffList: this.tableData })
    }
  }
}
</script>

<style scoped>
.dispatch-staff-page {
  padding: 16px;
}
.toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.input {
  width: 240px;
}
.footer {
  margin-top: 16px;
  text-align: right;
}
</style>
