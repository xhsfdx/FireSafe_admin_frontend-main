<template>
  <div class="message-push-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalRecords }}</div>
            <div class="stat-label">推送总次数</div>
          </div>
          <i class="el-icon-message stat-icon" style="color: #409EFF" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalSent }}</div>
            <div class="stat-label">发送成功</div>
          </div>
          <i class="el-icon-success stat-icon" style="color: #67C23A" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalFailed }}</div>
            <div class="stat-label">发送失败</div>
          </div>
          <i class="el-icon-error stat-icon" style="color: #F56C6C" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.byType.length }}</div>
            <div class="stat-label">消息类型数</div>
          </div>
          <i class="el-icon-folder stat-icon" style="color: #E6A23C" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作区域 -->
    <el-card class="main-card">
      <div slot="header" class="card-header">
        <span class="card-title">微信消息推送</span>
        <el-button type="primary" icon="el-icon-plus" @click="openSendDialog">
          新建推送
        </el-button>
      </div>

      <!-- 筛选 -->
      <el-form :inline="true" class="filter-form">
        <el-form-item label="消息类型">
          <el-select v-model="queryParams.messageType" clearable placeholder="全部类型" @change="fetchRecords">
            <el-option v-for="t in messageTypes" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" clearable placeholder="全部状态" @change="fetchRecords">
            <el-option label="发送中" value="sending" />
            <el-option label="已完成" value="completed" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchRecords">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 记录表格 -->
      <el-table v-loading="tableLoading" :data="records" border stripe style="width: 100%">
        <el-table-column prop="title" label="推送标题" min-width="160" show-overflow-tooltip />
        <el-table-column prop="messageType" label="消息类型" width="150">
          <template slot-scope="{ row }">
            <el-tag :type="getTypeTagColor(row.messageType)" size="small">
              {{ getTypeLabel(row.messageType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="推送内容" min-width="200" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.content }}</template>
        </el-table-column>
        <el-table-column label="发送统计" width="180">
          <template slot-scope="{ row }">
            <span style="color: #67C23A">成功 {{ row.sentCount }}</span> /
            <span style="color: #F56C6C">失败 {{ row.failedCount }}</span> /
            <span>共 {{ row.totalCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发送人" width="100">
          <template slot-scope="{ row }">{{ row.sender && row.sender.name || '-' }}</template>
        </el-table-column>
        <el-table-column label="发送时间" width="170">
          <template slot-scope="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="viewDetail(row._id)">详情</el-button>
            <el-button
              v-if="row.failedCount > 0"
              type="text"
              size="small"
              style="color: #E6A23C"
              @click="handleRetry(row)"
            >重试</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :page-size="queryParams.limit"
        :current-page="queryParams.page"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </el-card>

    <!-- 新建推送对话框 -->
    <el-dialog title="新建微信消息推送" :visible.sync="sendDialogVisible" width="750px" top="5vh" :close-on-click-modal="false">
      <el-form ref="sendForm" :model="sendForm" :rules="sendRules" label-width="100px">
        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="sendForm.messageType" placeholder="请选择消息类型" style="width: 100%" @change="handleTypeChange">
            <el-option v-for="t in messageTypes" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送标题" prop="title">
          <el-input v-model="sendForm.title" placeholder="请输入推送标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="推送内容" prop="content">
          <el-input
            v-model="sendForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入推送内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="接收用户" prop="recipientIds">
          <div class="user-select-area">
            <div class="user-select-toolbar">
              <el-input
                v-model="userSearch"
                placeholder="搜索用户（姓名/手机号）"
                prefix-icon="el-icon-search"
                clearable
                size="small"
                style="width: 250px"
                @input="debounceSearchUsers"
              />
              <el-select v-model="userRoleFilter" clearable placeholder="角色筛选" size="small" style="width: 130px; margin-left: 10px" @change="fetchUsers">
                <el-option label="管理员" value="admin" />
                <el-option label="维保人员" value="staff" />
                <el-option label="业主" value="customer" />
              </el-select>
              <el-button type="text" size="small" style="margin-left: 10px" @click="selectAllUsers">全选</el-button>
              <el-button type="text" size="small" @click="clearSelectedUsers">清空</el-button>
            </div>
            <div class="selected-tags" v-if="sendForm.recipientIds.length">
              <el-tag
                v-for="uid in sendForm.recipientIds.slice(0, 10)"
                :key="uid"
                closable
                size="small"
                type="info"
                @close="removeRecipient(uid)"
              >{{ getUserNameById(uid) }}</el-tag>
              <el-tag v-if="sendForm.recipientIds.length > 10" size="small" type="info">
                +{{ sendForm.recipientIds.length - 10 }} 人
              </el-tag>
              <span class="selected-count">已选 {{ sendForm.recipientIds.length }} 人</span>
            </div>
            <el-table
              ref="userTable"
              v-loading="usersLoading"
              :data="userList"
              max-height="300"
              size="small"
              @selection-change="handleUserSelectionChange"
            >
              <el-table-column type="selection" width="45" />
              <el-table-column prop="name" label="姓名" width="120" />
              <el-table-column prop="mobile" label="手机号" width="130" />
              <el-table-column prop="role" label="角色" width="100">
                <template slot-scope="{ row }">
                  <el-tag size="mini" :type="getRoleTagType(row.role)">{{ getRoleLabel(row.role) }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-if="userPagination.total > userPagination.limit"
              small
              layout="prev, pager, next"
              :total="userPagination.total"
              :page-size="userPagination.limit"
              :current-page="userPagination.page"
              @current-change="handleUserPageChange"
              style="margin-top: 8px; text-align: right"
            />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="sendDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="sending" @click="handleSend">
          确认推送
        </el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="推送详情" :visible.sync="detailDialogVisible" width="700px" top="5vh">
      <div v-if="detailData" v-loading="detailLoading">
        <el-descriptions :column="2" border size="medium">
          <el-descriptions-item label="推送标题">{{ detailData.title }}</el-descriptions-item>
          <el-descriptions-item label="消息类型">
            <el-tag :type="getTypeTagColor(detailData.messageType)" size="small">
              {{ getTypeLabel(detailData.messageType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="推送内容" :span="2">{{ detailData.content }}</el-descriptions-item>
          <el-descriptions-item label="发送人">{{ detailData.sender && detailData.sender.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="发送时间">{{ formatDate(detailData.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="总数/成功/失败">
            {{ detailData.totalCount }} / 
            <span style="color: #67C23A">{{ detailData.sentCount }}</span> / 
            <span style="color: #F56C6C">{{ detailData.failedCount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(detailData.status)" size="small">
              {{ getStatusLabel(detailData.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <h4 style="margin: 16px 0 8px">接收人列表</h4>
        <el-table :data="detailData.recipients" border size="small" max-height="350">
          <el-table-column label="用户" width="120">
            <template slot-scope="{ row }">{{ row.userId && row.userId.name || '-' }}</template>
          </el-table-column>
          <el-table-column label="手机号" width="130">
            <template slot-scope="{ row }">{{ row.userId && row.userId.mobile || '-' }}</template>
          </el-table-column>
          <el-table-column label="角色" width="100">
            <template slot-scope="{ row }">
              <el-tag v-if="row.userId" size="mini" :type="getRoleTagType(row.userId.role)">
                {{ getRoleLabel(row.userId.role) }}
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="发送状态" width="100">
            <template slot-scope="{ row }">
              <el-tag :type="row.status === 'sent' ? 'success' : row.status === 'failed' ? 'danger' : 'info'" size="mini">
                {{ row.status === 'sent' ? '已发送' : row.status === 'failed' ? '失败' : '待发送' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发送时间" width="170">
            <template slot-scope="{ row }">{{ row.sentAt ? formatDate(row.sentAt) : '-' }}</template>
          </el-table-column>
          <el-table-column label="失败原因" min-width="180" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span style="color: #F56C6C">{{ row.failReason || '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMessageTypes,
  getPushableUsers,
  sendPushMessage,
  getPushRecords,
  getPushRecordDetail,
  getPushStats,
  retryPush
} from '@/api/messagePush'

const TYPE_LABELS = {
  maintenance_overdue: '维保任务逾期',
  monthly_task: '每月任务',
  contract_expiry: '合同到期',
  payment: '付款信息',
  task_status: '任务状态'
}

const TITLE_TEMPLATES = {
  maintenance_overdue: '维保任务逾期提醒',
  monthly_task: '每月维保任务通知',
  contract_expiry: '合同即将到期提醒',
  payment: '付款信息通知',
  task_status: '任务状态变更通知'
}

const CONTENT_TEMPLATES = {
  maintenance_overdue: '您有维保任务已逾期，请及时处理。',
  monthly_task: '您本月有新的维保任务需要完成，请查看任务列表。',
  contract_expiry: '您的合同即将到期，请及时关注续签事宜。',
  payment: '您有新的付款信息需要确认，请查看详情。',
  task_status: '您的维保任务状态已发生变更，请查看最新进度。'
}

export default {
  name: 'MessagePush',
  data() {
    return {
      stats: {
        totalRecords: 0,
        totalSent: 0,
        totalFailed: 0,
        byType: []
      },
      messageTypes: [],
      records: [],
      tableLoading: false,
      queryParams: {
        page: 1,
        limit: 20,
        messageType: '',
        status: ''
      },
      dateRange: null,
      pagination: { total: 0, pages: 0 },

      // 发送对话框
      sendDialogVisible: false,
      sending: false,
      sendForm: {
        messageType: '',
        title: '',
        content: '',
        recipientIds: []
      },
      sendRules: {
        messageType: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入推送标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入推送内容', trigger: 'blur' }],
        recipientIds: [{ type: 'array', required: true, min: 1, message: '请选择接收用户', trigger: 'change' }]
      },

      // 用户选择
      userList: [],
      usersLoading: false,
      userSearch: '',
      userRoleFilter: '',
      userPagination: { page: 1, limit: 20, total: 0 },
      selectedUsers: [],
      searchTimer: null,

      // 详情
      detailDialogVisible: false,
      detailLoading: false,
      detailData: null
    }
  },
  created() {
    this.fetchMessageTypes()
    this.fetchStats()
    this.fetchRecords()
  },
  methods: {
    async fetchMessageTypes() {
      try {
        const res = await getMessageTypes()
        if (res && res.success) {
          this.messageTypes = res.data
        }
      } catch (e) {
        console.error('获取消息类型失败:', e)
      }
    },

    async fetchStats() {
      try {
        const res = await getPushStats()
        if (res && res.success) {
          this.stats = res.data
        }
      } catch (e) {
        console.error('获取统计失败:', e)
      }
    },

    async fetchRecords() {
      this.tableLoading = true
      try {
        const res = await getPushRecords(this.queryParams)
        if (res && res.success) {
          this.records = res.data
          this.pagination = res.pagination
        }
      } catch (e) {
        console.error('获取推送记录失败:', e)
      } finally {
        this.tableLoading = false
      }
    },

    async fetchUsers() {
      this.usersLoading = true
      try {
        const res = await getPushableUsers({
          page: this.userPagination.page,
          limit: this.userPagination.limit,
          search: this.userSearch,
          role: this.userRoleFilter
        })
        if (res && res.success) {
          this.userList = res.data
          this.userPagination.total = res.pagination.total
          this.$nextTick(() => {
            this.syncTableSelection()
          })
        }
      } catch (e) {
        console.error('获取用户列表失败:', e)
      } finally {
        this.usersLoading = false
      }
    },

    syncTableSelection() {
      if (!this.$refs.userTable) return
      this.userList.forEach(row => {
        const isSelected = this.sendForm.recipientIds.includes(row._id)
        this.$refs.userTable.toggleRowSelection(row, isSelected)
      })
    },

    handleUserSelectionChange(selection) {
      const currentPageIds = this.userList.map(u => u._id)
      const otherPageIds = this.sendForm.recipientIds.filter(id => !currentPageIds.includes(id))
      const newSelectedIds = selection.map(u => u._id)
      this.sendForm.recipientIds = [...otherPageIds, ...newSelectedIds]

      const otherPageUsers = this.selectedUsers.filter(u => !currentPageIds.includes(u._id))
      this.selectedUsers = [...otherPageUsers, ...selection]
    },

    handleTypeChange(type) {
      if (type && TITLE_TEMPLATES[type]) {
        this.sendForm.title = TITLE_TEMPLATES[type]
        this.sendForm.content = CONTENT_TEMPLATES[type]
      }
    },

    debounceSearchUsers() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.userPagination.page = 1
        this.fetchUsers()
      }, 300)
    },

    handleUserPageChange(page) {
      this.userPagination.page = page
      this.fetchUsers()
    },

    selectAllUsers() {
      if (this.$refs.userTable) {
        this.$refs.userTable.toggleAllSelection()
      }
    },

    clearSelectedUsers() {
      this.sendForm.recipientIds = []
      this.selectedUsers = []
      if (this.$refs.userTable) {
        this.$refs.userTable.clearSelection()
      }
    },

    removeRecipient(uid) {
      this.sendForm.recipientIds = this.sendForm.recipientIds.filter(id => id !== uid)
      this.selectedUsers = this.selectedUsers.filter(u => u._id !== uid)
      this.syncTableSelection()
    },

    getUserNameById(uid) {
      const user = this.selectedUsers.find(u => u._id === uid)
      return user ? user.name : uid
    },

    openSendDialog() {
      this.sendForm = {
        messageType: '',
        title: '',
        content: '',
        recipientIds: []
      }
      this.selectedUsers = []
      this.userSearch = ''
      this.userRoleFilter = ''
      this.userPagination.page = 1
      this.sendDialogVisible = true
      this.fetchUsers()
    },

    async handleSend() {
      this.$refs.sendForm.validate(async(valid) => {
        if (!valid) return
        this.$confirm(
          `确定向 ${this.sendForm.recipientIds.length} 位用户推送消息吗？`,
          '确认推送',
          { type: 'warning' }
        ).then(async() => {
          this.sending = true
          try {
            const res = await sendPushMessage(this.sendForm)
            if (res && res.success) {
              this.$message.success(res.message || '推送任务已创建')
              this.sendDialogVisible = false
              this.fetchRecords()
              this.fetchStats()
            } else {
              this.$message.error(res.message || '推送失败')
            }
          } catch (e) {
            this.$message.error('推送失败: ' + (e.message || '未知错误'))
          } finally {
            this.sending = false
          }
        }).catch(() => {})
      })
    },

    async viewDetail(id) {
      this.detailDialogVisible = true
      this.detailLoading = true
      try {
        const res = await getPushRecordDetail(id)
        if (res && res.success) {
          this.detailData = res.data
        }
      } catch (e) {
        this.$message.error('获取详情失败')
      } finally {
        this.detailLoading = false
      }
    },

    async handleRetry(row) {
      this.$confirm('确定要重试发送失败的消息吗？', '重试推送', { type: 'warning' })
        .then(async() => {
          try {
            const res = await retryPush(row._id)
            if (res && res.success) {
              this.$message.success(res.message || '重试已开始')
              this.fetchRecords()
            } else {
              this.$message.error(res.message || '重试失败')
            }
          } catch (e) {
            this.$message.error('重试失败')
          }
        }).catch(() => {})
    },

    handleDateChange(val) {
      if (val) {
        this.queryParams.startDate = val[0]
        this.queryParams.endDate = val[1]
      } else {
        this.queryParams.startDate = ''
        this.queryParams.endDate = ''
      }
      this.queryParams.page = 1
      this.fetchRecords()
    },

    resetQuery() {
      this.queryParams = { page: 1, limit: 20, messageType: '', status: '' }
      this.dateRange = null
      this.fetchRecords()
    },

    handleSizeChange(val) {
      this.queryParams.limit = val
      this.queryParams.page = 1
      this.fetchRecords()
    },

    handlePageChange(val) {
      this.queryParams.page = val
      this.fetchRecords()
    },

    getTypeLabel(type) {
      return TYPE_LABELS[type] || type
    },

    getTypeTagColor(type) {
      const map = {
        maintenance_overdue: 'danger',
        monthly_task: '',
        contract_expiry: 'warning',
        payment: 'success',
        task_status: 'info'
      }
      return map[type] || ''
    },

    getStatusTagType(status) {
      const map = { sending: '', completed: 'success', failed: 'danger', draft: 'info' }
      return map[status] || 'info'
    },

    getStatusLabel(status) {
      const map = { draft: '草稿', sending: '发送中', completed: '已完成', failed: '失败' }
      return map[status] || status
    },

    getRoleLabel(role) {
      const map = { superadmin: '超管', admin: '管理员', staff: '维保人员', customer: '业主' }
      return map[role] || role
    },

    getRoleTagType(role) {
      const map = { superadmin: 'danger', admin: '', staff: 'success', customer: 'warning' }
      return map[role] || 'info'
    },

    formatDate(dateStr) {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    }
  }
}
</script>

<style scoped>
.message-push-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: default;
}

.stat-card .el-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 6px;
}

.stat-icon {
  font-size: 40px;
  opacity: 0.7;
}

.main-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.filter-form {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

.user-select-area {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 12px;
}

.user-select-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.selected-tags {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.selected-count {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}
</style>
