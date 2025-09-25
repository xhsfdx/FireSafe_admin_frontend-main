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
        <el-button type="info" icon="el-icon-refresh" class="ml8" @click="loadLatestData">刷新数据</el-button>
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
        v-loading="loading"
        element-loading-text="加载最新数据中..."
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
      destroy-on-close
      @close="showDialog = false"
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
import { getMaintainPlans } from '@/api/maintainPlan'

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
      showDialog: false,
      loading: false
    }
  },
  computed: {
    isOneTimeContract() {
      return this.formData && ['施工', '评估', '检测'].includes(this.formData.contractType)
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        if (newVal) {
          // 如果是一次性合同且没有项目信息，创建一个默认项目
          if (this.isOneTimeContract && (!newVal.projectList || newVal.projectList.length === 0)) {
            this.tableData = [{
              index: 1,
              ownerName: newVal.entrustName || '',
              projectName: newVal.contractName || '一次性合同项目',
              techLeader: '',
              projectLeader: '',
              onSiteStaff: '',
              maintainPersons: { technical: '', leader: '', maintainers: [] }
            }]
          } else if (newVal.projectList) {
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
                maintainPersons: { technical: '', leader: '', maintainers: [] }
              }))
            }
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
  mounted() {
    // 监听维保人员更新事件
    window.addEventListener('maintenancePersonnelUpdated', this.handlePersonnelUpdate)
    // 初始加载最新数据
    this.loadLatestData()
  },
  beforeDestroy() {
    // 清理事件监听
    window.removeEventListener('maintenancePersonnelUpdated', this.handlePersonnelUpdate)
  },
  methods: {
    // 加载最新的维保人员数据
    async loadLatestData() {
      try {
        console.log('🔄 加载最新的维保人员数据...')
        this.loading = true
        
        const response = await getMaintainPlans({ 
          page: 1, 
          limit: 1000
        })
        
        if (response.success && response.data) {
          console.log('✅ 获取到最新计划数据:', response.data)
          
          // 更新表格数据，使用最新的维保人员信息
          const updatedTableData = this.tableData.map(tableRow => {
            // 查找对应的计划数据
            const planData = response.data.find(plan => 
              plan.projectName === tableRow.projectName
            )
            
            if (planData && planData.maintainPersons) {
              console.log(`🔄 更新项目 ${tableRow.projectName} 的维保人员信息`)
              
              return {
                ...tableRow,
                techLeader: planData.maintainPersons.technical?.name || '未分配',
                projectLeader: planData.maintainPersons.leader?.name || '未分配',
                onSiteStaff: planData.maintainPersons.maintainers?.map(m => m.name).join('、') || '未分配',
                maintainPersons: planData.maintainPersons
              }
            }
            
            return tableRow
          })
          
          this.tableData = updatedTableData
          console.log('✅ 维保人员数据更新完成')
        }
      } catch (error) {
        console.error('❌ 加载最新维保人员数据失败:', error)
        this.$message.error('加载最新数据失败，请刷新页面重试')
      } finally {
        this.loading = false
      }
    },
    
    // 处理维保人员更新事件
    handlePersonnelUpdate(event) {
      console.log('📢 收到维保人员更新事件:', event.detail)
      this.loadLatestData()
    },
    
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
      // 验证是否配置了维保人员
      const hasConfiguredStaff = this.tableData.some(row => {
        const hasConfig = row.maintainPersons &&
               row.maintainPersons.technical &&
               row.maintainPersons.leader &&
               Array.isArray(row.maintainPersons.maintainers) &&
               row.maintainPersons.maintainers.length > 0
        return hasConfig
      })

      if (!hasConfiguredStaff) {
        this.$message.error('请先配置技术负责人、项目负责人和至少一名现场维保人员！点击"详情"按钮为项目分配维保人员。')
        return
      }

      // 确保maintainPersons数据格式正确，避免序列化问题
      const sanitizedTableData = this.tableData.map(row => {
        if (row.maintainPersons) {
          return {
            ...row,
            maintainPersons: {
              technical: row.maintainPersons.technical || null,
              leader: row.maintainPersons.leader || null,
              maintainers: Array.isArray(row.maintainPersons.maintainers)
                ? row.maintainPersons.maintainers.filter(id => id && typeof id === 'string')
                : []
            }
          }
        }
        return row
      })

      this.$emit('update', { dispatchStaffList: sanitizedTableData })
      this.$emit('submit', { dispatchStaffList: sanitizedTableData })
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
