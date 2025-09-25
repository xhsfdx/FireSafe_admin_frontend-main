<template>
  <div class="fault-work-order-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-warning-outline"></i>
          </div>
          <div class="title-info">
            <h1 class="page-title">故障工单</h1>
            <p class="page-subtitle">管理和跟踪故障工单的处理进度</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-header">
        <h3><i class="el-icon-search"></i> 筛选条件</h3>
      </div>
      <div class="filter-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="filters.projectName"
              placeholder="输入项目名称搜索"
              prefix-icon="el-icon-search"
              clearable
            />
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="filters.owner"
              placeholder="输入当前所属人搜索"
              prefix-icon="el-icon-user"
              clearable
            />
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="filters.reporter"
              placeholder="输入上报人员"
              prefix-icon="el-icon-phone"
              clearable
            />
          </el-col>
          <el-col :span="6">
            <el-select v-model="filters.source" placeholder="选择故障来源" clearable style="width: 100%">
              <el-option label="例行转故障" value="例行转故障" />
              <el-option label="紧急上报" value="紧急上报" />
              <el-option label="日常巡检" value="日常巡检" />
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="6">
            <el-select v-model="filters.status" placeholder="选择工单状态" clearable style="width: 100%">
              <el-option label="待处理" value="待处理" />
              <el-option label="已接单" value="已接单" />
              <el-option label="已分配" value="已分配" />
              <el-option label="已沟通" value="已沟通" />
              <el-option label="已签到" value="已签到" />
              <el-option label="处理中" value="处理中" />
              <el-option label="已解决" value="已解决" />
              <el-option label="已评价" value="已评价" />
              <el-option label="已关闭" value="已关闭" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filters.timeliness" placeholder="选择工单时效" clearable style="width: 100%">
              <el-option label="已逾期" value="已逾期" />
              <el-option label="正常" value="正常" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search" @click="onSearch">
              查询
            </el-button>
            <el-button icon="el-icon-refresh" @click="onReset">
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <div class="table-header">
        <h3><i class="el-icon-s-grid"></i> 工单列表</h3>
        <div class="table-stats">
          <span>共 {{ pagination.total }} 条记录</span>
        </div>
      </div>
      
      <div class="table-container">
        <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="work-order-table"
          :header-cell-style="{ 
            background: '#f5f7fa', 
            color: '#606266',
            fontWeight: 'bold',
            fontSize: '14px'
          }"
          empty-text="暂无数据"
        >
          <el-table-column type="index" label="序号" width="70" align="center">
            <template slot-scope="scope">
              <span class="row-number">{{ (pagination.page - 1) * pagination.limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="projectName" label="项目名称" min-width="200" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div class="project-cell">
                <i class="el-icon-office-building project-icon"></i>
                <span class="project-name">{{ row.projectName || '未设置' }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="reportTime" label="上报时间" width="160" align="center">
            <template slot-scope="{ row }">
              <span class="time-text">{{ formatDateTime(row.reportTime) }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="source" label="工单来源" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="getSourceType(row.source)" size="small">
                {{ row.source || '例行转故障' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="reporter" label="上报人员" width="100" align="center">
            <template slot-scope="{ row }">
              <span class="person-text">{{ row.reporter || '未设置' }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="工单时效" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag
                :type="getTimelinessType(row)"
                size="small"
                style="font-weight: bold;"
              >
                {{ getTimeliness(row) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="工单状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag
                :type="getStatusType(row.status)"
                size="small"
                style="font-weight: bold;"
              >
                {{ row.status || '待处理' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="owner" label="当前所属人" width="120" align="center">
            <template slot-scope="{ row }">
              <span class="person-text">{{ getCurrentOwner(row) }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="280" align="center" fixed="right">
            <template slot-scope="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="mini" @click="viewDetail(row)">
                  详情
                </el-button>
                <el-button type="info" size="mini" @click="viewReport(row)">
                  报告预览
                </el-button>
                <el-dropdown v-if="getAvailableActions(row).length > 0" @command="(command) => handleAction(command, row)" trigger="click">
                  <el-button type="warning" size="mini">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item 
                      v-for="action in getAvailableActions(row)" 
                      :key="action.command" 
                      :command="action.command"
                      :disabled="action.disabled"
                    >
                      {{ action.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="danger" size="mini" @click="onDelete(row)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          :page-size-text="'条/页'"
          :total-text="'共'"
          :page-text="'页'"
          :prev-text="'上一页'"
          :next-text="'下一页'"
          :jumper-text="'跳至'"
        />
      </div>
    </div>

    <!-- 新建工单对话框 -->
    <el-dialog
      title="新建故障工单"
      :visible.sync="createDialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        :rules="createRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="业主单位" prop="ownerUnit">
              <el-input v-model="createForm.ownerUnit" placeholder="请输入业主单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="createForm.projectName" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工单来源" prop="source">
              <el-select v-model="createForm.source" placeholder="请选择工单来源" style="width: 100%">
                <el-option label="例行转故障" value="例行转故障" />
                <el-option label="紧急上报" value="紧急上报" />
                <el-option label="日常巡检" value="日常巡检" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计完成时间" prop="expectedCompletionTime">
              <el-date-picker
                v-model="createForm.expectedCompletionTime"
                type="datetime"
                placeholder="选择预计完成时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上报人员" prop="reporter">
              <el-input v-model="createForm.reporter" placeholder="请输入上报人员" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="createForm.contact" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="消防系统" prop="fireSystem">
              <el-input v-model="createForm.fireSystem" placeholder="请输入消防系统" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维保项目" prop="maintenanceItem">
              <el-input v-model="createForm.maintenanceItem" placeholder="请输入维保项目" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="检测内容" prop="inspectionContent">
          <el-input
            v-model="createForm.inspectionContent"
            type="textarea"
            :rows="3"
            placeholder="请输入检测内容"
          />
        </el-form-item>
        
        <el-form-item label="故障描述" prop="faultDescription">
          <el-input
            v-model="createForm.faultDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入故障描述"
          />
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreate" :loading="createLoading">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getFaultOrders, 
  deleteFaultOrder, 
  acceptFaultOrder, 
  assignFaultOrder,
  markAsResolved,
  rateFaultOrder,
  createFaultOrder
} from '@/api/faultOrder'

export default {
  name: 'FaultWorkOrder',
  data() {
    return {
      // 筛选条件
      filters: {
        projectName: '',
        owner: '',
        reporter: '',
        source: '',
        status: '',
        timeliness: '',
        dateRange: []
      },
      
      // 表格数据
      tableData: [],
      loading: false,
      
      // 分页
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      
      // 新建工单
      createDialogVisible: false,
      createLoading: false,
      createForm: {
        ownerUnit: '',
        projectName: '',
        source: '例行转故障',
        reporter: '',
        contact: '',
        expectedCompletionTime: '',
        fireSystem: '',
        maintenanceItem: '',
        inspectionContent: '',
        faultDescription: ''
      },
      createRules: {
        ownerUnit: [
          { required: true, message: '请输入业主单位', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        reporter: [
          { required: true, message: '请输入上报人员', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        fireSystem: [
          { required: true, message: '请输入消防系统', trigger: 'blur' }
        ],
        maintenanceItem: [
          { required: true, message: '请输入维保项目', trigger: 'blur' }
        ],
        inspectionContent: [
          { required: true, message: '请输入检测内容', trigger: 'blur' }
        ],
        faultDescription: [
          { required: true, message: '请输入故障描述', trigger: 'blur' }
        ],
        expectedCompletionTime: [
          { required: true, message: '请选择预计完成时间', trigger: 'change' }
        ]
      }
    }
  },
  
  mounted() {
    this.loadData()
  },
  
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        
        // 添加筛选条件
        if (this.filters.projectName) params.projectName = this.filters.projectName
        if (this.filters.owner) params.owner = this.filters.owner
        if (this.filters.reporter) params.reporter = this.filters.reporter
        if (this.filters.source) params.source = this.filters.source
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.timeliness) params.timeliness = this.filters.timeliness
        if (this.filters.dateRange && this.filters.dateRange.length === 2) {
          params.startDate = this.filters.dateRange[0]
          params.endDate = this.filters.dateRange[1]
        }

        const res = await getFaultOrders(params)
        console.log('API响应:', res)
        if (res.success) {
          this.tableData = res.data.list || []
          this.pagination.total = res.data.total || 0
          console.log('表格数据:', this.tableData)
          console.log('总数:', this.pagination.total)
        } else {
          this.$message.error(res.message || '获取数据失败')
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },
    
    // 搜索
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    
    // 重置
    onReset() {
      this.filters = {
        projectName: '',
        owner: '',
        reporter: '',
        source: '',
        status: '',
        timeliness: '',
        dateRange: []
      }
      this.pagination.page = 1
      this.loadData()
    },
    
    // 分页处理
    handleSizeChange(val) {
      this.pagination.limit = val
      this.pagination.page = 1
      this.loadData()
    },
    
    handleCurrentChange(val) {
      this.pagination.page = val
      this.loadData()
    },
    
    
    resetCreateForm() {
      this.createForm = {
        ownerUnit: '',
        projectName: '',
        source: '例行转故障',
        reporter: '',
        contact: '',
        expectedCompletionTime: '',
        fireSystem: '',
        maintenanceItem: '',
        inspectionContent: '',
        faultDescription: ''
      }
      this.$nextTick(() => {
        this.$refs.createForm && this.$refs.createForm.clearValidate()
      })
    },
    
    async submitCreate() {
      try {
        await this.$refs.createForm.validate()
        this.createLoading = true
        
        const formData = {
          ...this.createForm,
          expectedCompletionTime: this.createForm.expectedCompletionTime ? 
            new Date(this.createForm.expectedCompletionTime).toISOString() : null
        }
        
        const res = await createFaultOrder(formData)
        if (res.success) {
          this.$message.success('工单创建成功')
          this.createDialogVisible = false
          this.loadData()
        } else {
          this.$message.error(res.message || '创建失败')
        }
      } catch (error) {
        console.error('创建工单失败:', error)
        this.$message.error('创建工单失败')
      } finally {
        this.createLoading = false
      }
    },
    
    // 查看详情
    viewDetail(row) {
      this.$router.push({
        name: 'FaultOrderDetail',
        params: { id: row._id }
      })
    },
    
    // 查看报告
    viewReport(row) {
      this.$message.info('报告预览功能开发中...')
    },
    
    // 删除
    async onDelete(row) {
      try {
        await this.$confirm('确定要删除这个工单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const res = await deleteFaultOrder(row._id)
        if (res.success) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    },
    
    // 获取可用操作
    getAvailableActions(row) {
      const actions = []
      const status = row.status || '待处理'
      
      switch (status) {
        case '待处理':
          actions.push({ command: 'accept', label: '接单' })
          actions.push({ command: 'assign', label: '分配' })
          break
        case '已接单':
          actions.push({ command: 'assign', label: '分配' })
          break
        case '已分配':
          actions.push({ command: 'communicate', label: '沟通' })
          actions.push({ command: 'signin', label: '签到' })
          break
        case '已签到':
          actions.push({ command: 'start', label: '开始处理' })
          break
        case '处理中':
          actions.push({ command: 'resolve', label: '标记解决' })
          break
        case '已解决':
          actions.push({ command: 'rate', label: '评价' })
          break
      }
      
      return actions
    },
    
    // 处理操作
    async handleAction(command, row) {
      try {
        switch (command) {
          case 'accept':
            await this.acceptOrder(row)
            break
          case 'assign':
            await this.assignOrder(row)
            break
          case 'communicate':
            await this.addCommunication(row)
            break
          case 'signin':
            await this.addSignIn(row)
            break
          case 'start':
            await this.startProcessing(row)
            break
          case 'resolve':
            await this.resolveOrder(row)
            break
          case 'rate':
            await this.rateOrder(row)
            break
        }
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error('操作失败')
      }
    },
    
    // 接单
    async acceptOrder(row) {
      const res = await acceptFaultOrder(row._id)
      if (res.success) {
        this.$message.success('接单成功')
        this.loadData()
      } else {
        this.$message.error(res.message || '接单失败')
      }
    },
    
    // 分配工单
    async assignOrder(row) {
      this.$prompt('请输入工作人员ID（多个用逗号分隔）', '分配工单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[a-f\d,]+$/,
        inputErrorMessage: '请输入有效的ID'
      }).then(async ({ value }) => {
        const staffIds = value.split(',').map(id => id.trim())
        const res = await assignFaultOrder(row._id, { staffIds })
        if (res.success) {
          this.$message.success('分配成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '分配失败')
        }
      }).catch(() => {})
    },
    
    // 添加沟通记录
    async addCommunication(row) {
      this.$prompt('请输入沟通内容', '添加沟通记录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        const res = await addCommunicationLog(row._id, {
          staffId: 'current_user_id', // 这里应该获取当前用户ID
          content: value
        })
        if (res.success) {
          this.$message.success('沟通记录添加成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '添加失败')
        }
      }).catch(() => {})
    },
    
    // 添加签到记录
    async addSignIn(row) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const res = await addSignInLog(row._id, {
            staffId: 'current_user_id', // 这里应该获取当前用户ID
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          })
          if (res.success) {
            this.$message.success('签到成功')
            this.loadData()
          } else {
            this.$message.error(res.message || '签到失败')
          }
        }, () => {
          this.$message.error('无法获取位置信息')
        })
      } else {
        this.$message.error('浏览器不支持定位功能')
      }
    },
    
    // 开始处理
    async startProcessing(row) {
      // 这里需要调用相应的API来开始处理
      this.$message.success('开始处理')
      this.loadData()
    },
    
    // 标记解决
    async resolveOrder(row) {
      const res = await markAsResolved(row._id)
      if (res.success) {
        this.$message.success('标记解决成功')
        this.loadData()
      } else {
        this.$message.error(res.message || '操作失败')
      }
    },
    
    // 评价工单
    async rateOrder(row) {
      this.$prompt('请输入评分（1-5分）', '评价工单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-5]$/,
        inputErrorMessage: '请输入1-5之间的数字'
      }).then(async ({ value }) => {
        const res = await rateFaultOrder(row._id, { rating: parseInt(value) })
        if (res.success) {
          this.$message.success('评价成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '评价失败')
        }
      }).catch(() => {})
    },
    
    
    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return '未设置'
      return new Date(date).toLocaleString('zh-CN')
    },
    
    // 获取工单来源类型
    getSourceType(source) {
      const typeMap = {
        '例行转故障': 'primary',
        '紧急上报': 'danger',
        '日常巡检': 'success'
      }
      return typeMap[source] || 'info'
    },
    
    // 获取工单状态类型
    getStatusType(status) {
      const typeMap = {
        '待处理': 'info',
        '已接单': 'warning',
        '已分配': 'primary',
        '已沟通': 'success',
        '已签到': 'success',
        '处理中': 'warning',
        '已解决': 'success',
        '已评价': 'success',
        '已关闭': 'info'
      }
      return typeMap[status] || 'info'
    },
    
    // 获取时效类型
    getTimelinessType(row) {
      if (!row.expectedCompletionTime) return 'success'
      const now = new Date()
      const expected = new Date(row.expectedCompletionTime)
      return now > expected ? 'danger' : 'success'
    },
    
    // 获取时效文本
    getTimeliness(row) {
      if (!row.expectedCompletionTime) return '正常'
      const now = new Date()
      const expected = new Date(row.expectedCompletionTime)
      return now > expected ? '已逾期' : '正常'
    },
    
    // 获取当前所属人
    getCurrentOwner(row) {
      if (row.assignedTo && row.assignedTo.length > 0) {
        return row.assignedTo.map(staff => staff.name).join(', ')
      }
      if (row.acceptedBy && row.acceptedBy.name) {
        return row.acceptedBy.name
      }
      return '未分配'
    }
  }
}
</script>

<style scoped>
.fault-work-order-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
}

.page-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.page-icon i {
  font-size: 28px;
  color: white;
}

.title-info h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.title-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.header-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  margin-left: 10px;
}

.header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.filter-header {
  margin-bottom: 20px;
}

.filter-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.filter-header i {
  color: #667eea;
  margin-right: 8px;
}

.table-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.table-header i {
  color: #667eea;
  margin-right: 8px;
}

.table-stats {
  color: #606266;
  font-size: 14px;
}

.work-order-table {
  margin-bottom: 20px;
}

.row-number {
  font-weight: 600;
  color: #667eea;
}

.project-cell {
  display: flex;
  align-items: center;
}

.project-icon {
  color: #667eea;
  margin-right: 8px;
  font-size: 16px;
}

.project-name {
  font-weight: 500;
}

.time-text {
  color: #606266;
  font-size: 13px;
}

.person-text {
  color: #303133;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
  flex-wrap: wrap;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fault-work-order-page {
    padding: 10px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .title-section {
    margin-bottom: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
