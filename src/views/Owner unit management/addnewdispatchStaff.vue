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

      <!-- 提示信息 -->
      <div v-if="!hasConfiguredStaff" class="notice-bar">
        <el-alert
          title="请配置维保人员"
          description="请点击表格中的"
          配置"按钮，为项目分配技术负责人、项目负责人和现场维保人员。"
          type="warning"
          show-icon
          :closable="false"
        />
      </div>

      <!-- 表格区 -->
      <el-table :data="filteredTableData" border>
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" width="50" type="index" />
        <el-table-column label="业主单位名称" prop="ownerName" />
        <el-table-column label="项目名称" prop="projectName" />
        <el-table-column label="维保技术负责人" prop="techLeader">
          <template slot-scope="scope">
            <span v-if="scope.row.techLeader" class="configured">{{ scope.row.techLeader }}</span>
            <span v-else class="not-configured">未配置</span>
          </template>
        </el-table-column>
        <el-table-column label="维保项目负责人" prop="projectLeader">
          <template slot-scope="scope">
            <span v-if="scope.row.projectLeader" class="configured">{{ scope.row.projectLeader }}</span>
            <span v-else class="not-configured">未配置</span>
          </template>
        </el-table-column>
        <el-table-column label="现场维保人员" prop="onSiteStaff">
          <template slot-scope="scope">
            <span v-if="scope.row.onSiteStaff" class="configured">{{ scope.row.onSiteStaff }}</span>
            <span v-else class="not-configured">未配置</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.techLeader && scope.row.projectLeader && scope.row.onSiteStaff ? 'success' : 'primary'"
              size="mini"
              @click="handleConfig(scope.row)"
            >
              {{ scope.row.techLeader && scope.row.projectLeader && scope.row.onSiteStaff ? '重新配置' : '配置' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部按钮 -->
      <div class="footer">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">完成创建</el-button>
      </div>

      <!-- 弹窗 -->
      <el-dialog
        title="配置维保人员"
        :visible.sync="showDialog"
        width="900px"
        destroy-on-close
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="dialog-content">
          <div class="dialog-header">
            <div class="project-info">
              <span class="label">项目名称：</span>
              <span class="value">{{ currentRow.projectName }}</span>
            </div>
            <div class="project-info">
              <span class="label">业主单位：</span>
              <span class="value">{{ currentRow.ownerName }}</span>
            </div>
          </div>
          <DispatchStaff ref="dispatchStaff" :data="currentRow" @submit="onDialogConfirm" @cancel="showDialog = false" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmConfig">确认配置</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import DispatchStaff from '@/views/Maintenance and Service Management/DispatchStaff.vue'
import { getStaffList } from '@/api/staff'

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
      staffList: [] // 添加员工列表
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
    },
    hasConfiguredStaff() {
      return this.tableData.some(row => {
        const hasConfig = row.maintainPersons &&
               row.maintainPersons.technical &&
               row.maintainPersons.leader &&
               row.maintainPersons.maintainers &&
               row.maintainPersons.maintainers.length > 0

        // 添加调试信息
        console.log(`hasConfiguredStaff - 项目: ${row.projectName}, 是否有配置: ${hasConfig}`)
        if (row.maintainPersons) {
          console.log(`技术负责人: ${row.maintainPersons.technical}`)
          console.log(`项目负责人: ${row.maintainPersons.leader}`)
          console.log(`现场维保人员数量: ${row.maintainPersons.maintainers ? row.maintainPersons.maintainers.length : 0}`)
        }

        return hasConfig
      })
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        if (newVal) {
          // 如果是一次性合同且没有项目信息，创建一个默认项目
          if (['施工', '评估', '检测'].includes(newVal.contractType) && (!newVal.projectList || newVal.projectList.length === 0)) {
            this.tableData = [{
              ownerName: newVal.entrustName || '',
              projectName: newVal.contractName || '一次性合同项目',
              techLeader: '',
              projectLeader: '',
              onSiteStaff: '',
              isOneTimeContract: true
            }]
          } else if (newVal.projectList) {
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
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.loadStaffList()
  },
  methods: {
    async loadStaffList() {
      try {
        // DispatchStaff组件会自己从后端加载数据，这里不需要重复加载
        // 如果需要，可以在这里添加其他逻辑
        console.log('addnewdispatchStaff: 员工列表将由DispatchStaff组件加载')
      } catch (e) {
        console.error('加载员工列表失败:', e)
      }
    },
    query() {
      // The computed property 'filteredTableData' handles the search
    },
    reset() {
      this.search = ''
    },
    handleConfig(row) {
      console.log('=== handleConfig 被调用 ===')
      console.log('传入的row数据:', row)
      
      // 确保传递必要的ID信息
      this.currentRow = { 
        ...row,
        taskId: row._id || row.taskId,
        planId: row.planId || this.$route.query.planId
      }
      
      console.log('设置后的currentRow:', this.currentRow)
      this.showDialog = true
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
    confirmConfig() {
      // 触发DispatchStaff组件的保存操作
      this.$refs.dispatchStaff && this.$refs.dispatchStaff.onSave()
    },
    prevStep() {
      this.emitUpdate()
      this.$emit('prev')
    },
    nextStep() {
      console.log('=== nextStep 被调用 ===')
      console.log('当前tableData:', this.tableData)

      // 验证是否配置了维保人员
      const hasConfiguredStaff = this.tableData.some(row => {
        console.log('检查行数据:', row)
        console.log('row.maintainPersons:', row.maintainPersons)

        const hasConfig = row.maintainPersons &&
               row.maintainPersons.technical &&
               row.maintainPersons.leader &&
               Array.isArray(row.maintainPersons.maintainers) &&
               row.maintainPersons.maintainers.length > 0

        console.log('该行是否有配置:', hasConfig)
        console.log('技术负责人:', row.maintainPersons?.technical)
        console.log('项目负责人:', row.maintainPersons?.leader)
        console.log('现场维保人员数量:', row.maintainPersons?.maintainers?.length || 0)
        return hasConfig
      })

      console.log('是否有配置维保人员:', hasConfiguredStaff)

      if (!hasConfiguredStaff) {
        this.$message.error('请先配置技术负责人、项目负责人和至少一名现场维保人员！点击"配置"按钮为项目分配维保人员。')
        return
      }

      this.emitUpdate()
      this.$emit('submit')
    },
    emitUpdate() {
      console.log('emitUpdate 被调用，发送的数据:', { dispatchStaffList: this.tableData })
      console.log('tableData 详细内容:', JSON.stringify(this.tableData, null, 2))

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

/* 弹窗样式 */
.dialog-content {
  padding: 0;
}
.dialog-header {
  background: #f8f9fa;
  padding: 16px 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #409EFF;
}
.project-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.project-info:last-child {
  margin-bottom: 0;
}
.project-info .label {
  font-weight: bold;
  color: #606266;
  min-width: 80px;
}
.project-info .value {
  color: #303133;
  font-size: 14px;
}
.dialog-footer {
  text-align: right;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

/* 提示信息样式 */
.notice-bar {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 4px;
}
.notice-bar .el-alert {
  margin-bottom: 0;
}

/* 表格样式 */
.el-table .configured {
  color: #67c23a; /* 绿色，表示已配置 */
  font-weight: bold;
}
.el-table .not-configured {
  color: #f56c6c; /* 红色，表示未配置 */
  font-weight: bold;
}
</style>
