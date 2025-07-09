<template>
  <div class="payment-manage-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <div class="search-fields">
        <el-input v-model="filters.ownerName" placeholder="输入业主单位名称搜索" style="width:180px" clearable />
        <el-input v-model="filters.entrustName" placeholder="输入委托单位搜索" style="width:180px" clearable />
        <el-select v-model="filters.paymentStatus" placeholder="选择结款状态" style="width:180px" clearable>
          <el-option label="未结款" value="未结款" />
          <el-option label="部分结款" value="部分结款" />
          <el-option label="已结款" value="已结款" />
        </el-select>
        <el-select v-model="filters.contractType" placeholder="选择合同种类" style="width:180px" clearable>
          <el-option label="施工" value="施工" />
          <el-option label="评估" value="评估" />
          <el-option label="检测" value="检测" />
          <el-option label="项目维保" value="项目维保" />
        </el-select>
      </div>
      <div class="search-btns">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-s-finance" @click="handleSumAmount">统计金额</el-button>
        <el-button type="success" icon="el-icon-edit" @click="handleBatchUpdate">批量更新</el-button>
      </div>
    </div>
    
    <!-- 统计信息 -->
    <div style="text-align:right; margin-bottom:6px;">
      共查询到{{ pagination.total }}条
    </div>
    
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%; margin-top: 16px"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }" :empty-text="' '"
      @selection-change="handleSelectionChange" ref="paymentTable">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="ownerName" label="业主单位名称" align="center" />
      <el-table-column prop="entrustName" label="委托单位" align="center" />
      <el-table-column prop="contractType" label="合同种类" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="getContractTypeTagType(row.contractType)" size="small">
            {{ row.contractType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contractAmount" label="合同金额" align="center" />
      <el-table-column prop="paidAmount" label="已结金额" align="center">
        <template slot-scope="{ row }">
          <span style="color:#67c23a">￥{{ row.paidAmount ? row.paidAmount.toLocaleString() : '0' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unpaidAmount" label="未结金额" align="center">
        <template slot-scope="{ row }">
          <span style="color:#f56c6c">￥{{ row.unpaidAmount ? row.unpaidAmount.toLocaleString() : '0' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentStatus" label="结款状态" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="getPaymentStatusTagType(row.paymentStatus)" effect="dark" size="small">
            {{ row.paymentStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="paymentDate" label="结款日期" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.paymentDate">{{ formatDate(row.paymentDate) }}</span>
          <span v-else style="color:#909399">未结款</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="结款方式" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.paymentMethod">{{ row.paymentMethod }}</span>
          <span v-else style="color:#909399">-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">详情</el-link>
          <el-link type="success" style="margin:0 8px" @click="updatePayment(row)">更新结款</el-link>
          <el-link type="warning" @click="viewPaymentHistory(row)">结款记录</el-link>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页控件 -->
    <div style="text-align:right;margin-top:8px;">
      <el-pagination background layout="prev, pager, next" :page-size="pagination.limit" :total="pagination.total"
        :current-page="pagination.page" @current-change="handlePageChange" />
    </div>
    
    <!-- 无数据时自定义内容 -->
    <div v-if="tableData.length === 0" class="table-empty">
      <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">
      <div class="empty-text">暂无数据</div>
    </div>
    
    <!-- 更新结款对话框 -->
    <el-dialog title="更新结款状态" :visible.sync="paymentDialogVisible" width="500px">
      <el-form :model="paymentForm" :rules="paymentRules" ref="paymentForm" label-width="100px">
        <el-form-item label="结款状态" prop="paymentStatus">
          <el-select v-model="paymentForm.paymentStatus" placeholder="选择结款状态" style="width:100%">
            <el-option label="未结款" value="未结款" />
            <el-option label="部分结款" value="部分结款" />
            <el-option label="已结款" value="已结款" />
          </el-select>
        </el-form-item>
        <el-form-item label="已结金额" prop="paidAmount">
          <el-input v-model="paymentForm.paidAmount" placeholder="请输入已结金额" type="number">
            <template slot="prepend">￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="结款日期" prop="paymentDate">
          <el-date-picker v-model="paymentForm.paymentDate" type="date" placeholder="选择结款日期" style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结款方式" prop="paymentMethod">
          <el-select v-model="paymentForm.paymentMethod" placeholder="选择结款方式" style="width:100%">
            <el-option label="现金" value="现金" />
            <el-option label="银行转账" value="银行转账" />
            <el-option label="支票" value="支票" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="paymentNote">
          <el-input v-model="paymentForm.paymentNote" type="textarea" placeholder="请输入备注信息" :rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paymentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPaymentUpdate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPaymentList, updatePaymentStatus, getPaymentStats } from '@/api/payment'

export default {
  name: 'PaymentManagement',
  data() {
    return {
      filters: {
        ownerName: '',
        entrustName: '',
        paymentStatus: '',
        contractType: ''
      },
      tableData: [],
      loading: false,
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      selectedRows: [],
      paymentDialogVisible: false,
      currentContract: null,
      paymentForm: {
        paymentStatus: '',
        paidAmount: '',
        paymentDate: '',
        paymentMethod: '',
        paymentNote: ''
      },
      paymentRules: {
        paymentStatus: [
          { required: true, message: '请选择结款状态', trigger: 'change' }
        ],
        paidAmount: [
          { required: true, message: '请输入已结金额', trigger: 'blur' },
          { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的金额格式', trigger: 'blur' }
        ],
        paymentDate: [
          { required: true, message: '请选择结款日期', trigger: 'change' }
        ],
        paymentMethod: [
          { required: true, message: '请选择结款方式', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.loadData()
  },
  activated() {
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
        if (this.filters.paymentStatus) params.paymentStatus = this.filters.paymentStatus
        if (this.filters.entrustName) params.entrustName = this.filters.entrustName
        if (this.filters.ownerName) params.ownerName = this.filters.ownerName
        if (this.filters.contractType) params.contractType = this.filters.contractType
        
        const res = await getPaymentList(params)
        if (res.success) {
          const list = res.data || []

          this.tableData = list.map(item => {
            const unpaidAmount = (item.amount || 0) - (item.paidAmount || 0)
            return {
              id: item._id,
              ownerName: item.ownerName || '',
              entrustName: item.clientCompany || '',
              contractType: item.contractType || '项目维保',
              contractAmount: item.amount ? `￥${item.amount.toLocaleString()}` : '￥0',
              paidAmount: item.paidAmount || 0,
              unpaidAmount: unpaidAmount,
              paymentStatus: item.paymentStatus || '未结款',
              paymentDate: item.paymentDate,
              paymentMethod: item.paymentMethod,
              paymentNote: item.paymentNote,
              amount: item.amount || 0
            }
          })
          
          // 分页信息
          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          }
        } else {
          this.tableData = []
          this.pagination.total = 0
          this.$message.error(res.message || '获取数据失败')
        }
      } catch (e) {
        this.tableData = []
        this.pagination.total = 0
        this.$message.error('网络异常或接口出错')
      }
      this.loading = false
    },
    
    // 获取合同类型标签样式
    getContractTypeTagType(type) {
      const typeMap = {
        '施工': 'danger',
        '评估': 'warning',
        '检测': 'info',
        '项目维保': 'success'
      }
      return typeMap[type] || 'info'
    },
    
    // 获取结款状态标签样式
    getPaymentStatusTagType(status) {
      const statusMap = {
        '未结款': 'danger',
        '部分结款': 'warning',
        '已结款': 'success'
      }
      return statusMap[status] || 'info'
    },
    
    // 格式化日期
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },
    
    // 翻页事件
    handlePageChange(page) {
      this.pagination.page = page
      this.loadData()
    },
    
    // 查询
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    
    // 重置
    onReset() {
      this.filters = { ownerName: '', entrustName: '', paymentStatus: '', contractType: '' }
      this.pagination.page = 1
      this.loadData()
    },
    
    // 查看详情
    viewDetail(row) {
      this.$router.push({
        name: 'UnitDetail',
        query: { id: row.id }
      })
    },
    
    // 更新结款
    updatePayment(row) {
      this.currentContract = row
      this.paymentForm = {
        paymentStatus: row.paymentStatus,
        paidAmount: row.paidAmount.toString(),
        paymentDate: row.paymentDate ? new Date(row.paymentDate) : '',
        paymentMethod: row.paymentMethod || '银行转账',
        paymentNote: row.paymentNote || ''
      }
      this.paymentDialogVisible = true
    },
    
    // 提交结款更新
    async submitPaymentUpdate() {
      try {
        await this.$refs.paymentForm.validate()
        
        const res = await updatePaymentStatus(this.currentContract.id, this.paymentForm)
        if (res.success) {
          this.$message.success('结款状态更新成功')
          this.paymentDialogVisible = false
          this.loadData()
        } else {
          this.$message.error(res.message || '更新失败')
        }
      } catch (error) {
        console.error('更新结款状态失败:', error)
        this.$message.error('更新失败')
      }
    },
    
    // 查看结款记录
    viewPaymentHistory(row) {
      this.$message.info('结款记录功能开发中...')
    },
    
    // 批量更新
    handleBatchUpdate() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择要更新的项目')
        return
      }
      this.$message.info('批量更新功能开发中...')
    },
    
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    
    handleSumAmount() {
      let rows = this.selectedRows.length > 0 ? this.selectedRows : this.tableData
      let totalAmount = 0
      let totalPaidAmount = 0
      let totalUnpaidAmount = 0
      
      rows.forEach(row => {
        totalAmount += row.amount || 0
        totalPaidAmount += row.paidAmount || 0
        totalUnpaidAmount += row.unpaidAmount || 0
      })
      
      this.$message.info(`合同金额合计：￥${totalAmount.toLocaleString()}\n已结金额：￥${totalPaidAmount.toLocaleString()}\n未结金额：￥${totalUnpaidAmount.toLocaleString()}`)
    }
  }
}
</script>

<style scoped>
.payment-manage-page {
  min-height: 100vh;
  background: #fff;
  padding: 10px 12px 0 10px;
  position: relative;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 18px;
  gap: 0 10px;
}

.search-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  align-items: flex-end;
}

.search-btns {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

@media (max-width: 900px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-btns {
    margin: 12px 0 0 0;
    justify-content: flex-start;
  }
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

.dialog-footer {
  text-align: right;
}
</style> 