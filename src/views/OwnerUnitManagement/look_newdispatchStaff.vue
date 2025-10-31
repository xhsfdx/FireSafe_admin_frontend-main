<template>
  <div class="app-container">
    <div class="dispatch-staff-page">
      <!-- 页面标题卡片 -->
      <div class="card-block card-title">
        <div class="card-title-txt">维保人员配置</div>
      </div>

      <!-- 搜索与按钮区 -->
      <div class="toolbar">
        <el-input v-model="search" placeholder="输入项目名称搜索" class="input" clearable />
        <el-button type="primary" @click="query">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="loadLatestData">刷新数据</el-button>
        <el-button type="success">一键配置勾选项目</el-button>
      </div>

      <!-- 表格区 -->
      <el-table v-loading="loading" :data="filteredTableData" border element-loading-text="加载最新数据中...">
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
        <DispatchStaff ref="dispatchStaff" :data="currentRow" @submit="onDialogConfirm" @cancel="showDialog = false" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmConfig">确认配置</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import DispatchStaff from '@/views/MaintenanceManagement/DispatchStaff.vue'
import { getMaintainPlans } from '@/api/maintainPlan'

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
      tableData: [],
      loading: false
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
              techLeader: p.technical,
              projectLeader: p.leader,
              onSiteStaff: p.maintainers.map(item => item.name),
              maintainPersons: p.maintainPersons
            }))
          }
        }
      },
      immediate: true,
      deep: true
    }
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
          console.log(updatedTableData)
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
    confirmConfig() {
      // 触发DispatchStaff组件的保存操作
      console.log('确认配置维保人员:', this.currentRow)
      this.$refs.dispatchStaff && this.$refs.dispatchStaff.onSave()
    },
    onDialogConfirm(newData) {
      console.log('=== onDialogConfirm 被调用 ===')
      console.log('接收到的数据:', newData)
      console.log('当前行数据:', this.currentRow)

      if (!this.currentRow.projectName) {
        this.$message.error('未找到当前行的项目名称，无法保存！')
        return
      }

      const index = this.tableData.findIndex(item => item.projectName === this.currentRow.projectName)
      console.log('找到的行索引:', index)

      if (index !== -1) {
        const maintainPersons = newData.maintainPersons
        const selectedStaff = newData.selectedStaff
        console.log('=== 维保人员数据处理 ===')
        console.log('maintainPersons:', maintainPersons)
        console.log('selectedStaff:', selectedStaff)

        let techLeader = ''
        let projectLeader = ''
        let onSiteStaff = ''

        // 从selectedStaff获取人员姓名
        if (selectedStaff) {
          // 获取技术负责人姓名
          if (selectedStaff.tech) {
            techLeader = selectedStaff.tech.name
            console.log('技术负责人姓名:', techLeader)
          }

          // 获取项目负责人姓名
          if (selectedStaff.manager) {
            projectLeader = selectedStaff.manager.name
            console.log('项目负责人姓名:', projectLeader)
          }

          // 获取现场维护人员姓名
          if (selectedStaff.workers && selectedStaff.workers.length > 0) {
            onSiteStaff = selectedStaff.workers
              .map(worker => worker.name)
              .filter(Boolean)
              .join('、')
            console.log('现场维护人员姓名:', onSiteStaff)
          }
        }

        console.log('=== 解析后的人员信息 ===')
        console.log('techLeader:', techLeader)
        console.log('projectLeader:', projectLeader)
        console.log('onSiteStaff:', onSiteStaff)

        // 确保maintainPersons数据格式正确
        console.log('=== 原始maintainPersons数据 ===')
        console.log('maintainPersons:', maintainPersons)
        console.log('maintainers原始数据:', maintainPersons.maintainers)
        console.log('maintainers类型:', typeof maintainPersons.maintainers)
        console.log('maintainers是否为数组:', Array.isArray(maintainPersons.maintainers))

        const sanitizedMaintainPersons = {
          technical: maintainPersons.technical || null,
          leader: maintainPersons.leader || null,
          maintainers: Array.isArray(maintainPersons.maintainers)
            ? maintainPersons.maintainers.filter(id => id && typeof id === 'string')
            : []
        }

        console.log('=== 处理后的maintainPersons数据 ===')
        console.log('sanitizedMaintainPersons:', sanitizedMaintainPersons)
        console.log('maintainers处理后:', sanitizedMaintainPersons.maintainers)
        console.log('maintainers长度:', sanitizedMaintainPersons.maintainers.length)

        const updatedRow = {
          ...this.tableData[index],
          projectName: this.currentRow.projectName, // 确保项目名称正确
          ownerName: this.currentRow.ownerName, // 确保业主单位正确
          techLeader,
          projectLeader,
          onSiteStaff,
          maintainPersons: sanitizedMaintainPersons
        }

        console.log('=== 更新前的行数据 ===')
        console.log(this.tableData[index])
        console.log('=== 更新后的行数据 ===')
        console.log(updatedRow)

        this.$set(this.tableData, index, updatedRow)
        console.log('=== 整个表格数据更新后 ===')
        console.log(this.tableData)

        this.emitUpdate()
        this.$message.success('维保人员配置成功！')
      } else {
        console.error('未找到匹配的项目行！')
        this.$message.error('未找到匹配的项目行！')
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
      console.log('📢 触发emitUpdate')
      console.log('当前数据:', { dispatchStaffList: this.tableData })
      this.$emit('update', { dispatchStaffList: this.tableData })
    }
  }
}
</script>

<style scoped>
.app-container {
  background: #fff;
  padding: 18px 18px 32px 18px;
  border-radius: 8px;
}

.dispatch-staff-page {
  background: #fff;
}

.card-block {
  background: #f8f9fb;
  border-radius: 8px;
  padding: 18px 16px 10px 16px;
  margin-bottom: 18px;
  margin-top: 10px;
}

.card-title {
  padding: 12px 18px 12px 18px;
  margin-bottom: 18px;
}

.card-title-txt {
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
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
