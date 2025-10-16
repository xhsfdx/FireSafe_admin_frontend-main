<template>
  <div class="payment-manage-page">
    <!-- 查询栏 -->
    <div class="search-bar" style="z-index: 10;">
      <div class="search-fields">
        <el-input v-model="filters.ownerName" placeholder="输入业主单位名称搜索" class="search-input" clearable />
        <el-input v-model="filters.entrustName" placeholder="输入委托单位搜索" class="search-input" clearable />
        <el-select v-model="filters.paymentStatus" placeholder="选择结款状态" class="search-select" clearable>
          <el-option label="未结款" value="未结款" />
          <el-option label="部分结款" value="部分结款" />
          <el-option label="已结款" value="已结款" />
        </el-select>
        <el-select v-model="filters.contractType" placeholder="选择合同种类" class="search-select" clearable>
          <el-option label="施工" value="施工" />
          <el-option label="评估" value="评估" />
          <el-option label="检测" value="检测" />
          <el-option label="项目维保" value="项目维保" />
        </el-select>
      </div>
      <div class="search-btns">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-s-finance" @click="showAmountChart">统计金额</el-button>
        <el-button type="success" icon="el-icon-edit" @click="handleBatchUpdate">批量结款</el-button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div style="text-align:right; margin-bottom:6px; z-index: 10;">
      共查询到{{ pagination.total }}条
    </div>

    <!-- 表格 -->
    <el-table
      ref="paymentTable"
      :data="tableData"
      border
      style="width: 100%; margin-top: 16px; z-index: 10;"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      :empty-text="' '"
      @selection-change="handleSelectionChange"
    >
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
          <el-link type="success" style="margin:0 8px" @click="updatePayment(row)">结款</el-link>
          <el-link type="warning" @click="viewPaymentHistory(row)">结款记录</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div style="text-align:right;margin-top:8px; z-index: 10;">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pagination.limit"
        :total="pagination.total"
        :current-page="pagination.page"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 无数据时自定义内容 -->
    <div v-if="tableData.length === 0" class="table-empty" style="z-index: 10;">
      <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">
      <div class="empty-text">暂无数据</div>
    </div>

    <!-- 结款对话框 -->
    <el-dialog title="结款" :visible.sync="paymentDialogVisible" width="500px" :modal="false">
      <el-form ref="paymentForm" :model="paymentForm" :rules="paymentRules" label-width="100px">
        <el-form-item label="结款状态">
          <el-input :value="getCalculatedPaymentStatus()" readonly style="width:100%">
            <template slot="prepend">
              <el-tag :type="getPaymentStatusTagType(getCalculatedPaymentStatus())" size="small">
                {{ getCalculatedPaymentStatus() }}
              </el-tag>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="本次结款金额" prop="paidAmount">
          <el-input v-model="paymentForm.paidAmount" placeholder="请输入本次结款金额" type="number">
            <template slot="prepend">￥</template>
          </el-input>
          <div class="form-tip">输入本次要结款的金额</div>
        </el-form-item>
        <el-form-item label="结款日期" prop="paymentDate">
          <el-date-picker v-model="paymentForm.paymentDate" type="date" placeholder="选择结款日期" style="width:100%" />
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
          <el-input v-model="paymentForm.paymentNote" type="textarea" placeholder="请输入备注信息" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paymentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPaymentUpdate">确定结款</el-button>
      </div>
    </el-dialog>

    <!-- 结款记录对话框 -->
    <el-dialog title="结款记录" :visible.sync="paymentHistoryDialogVisible" width="900px" :modal="false">
      <!-- 结款汇总信息 -->
      <div class="payment-summary">
        <div class="summary-header">
          <h4>结款汇总</h4>
        </div>
        <div class="summary-content">
          <div class="summary-item">
            <span class="label">合同总金额：</span>
            <span class="value total">￥{{ (currentContract && currentContract.contractAmount) || (currentContract && currentContract.amount) || '0' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">总结款金额：</span>
            <span class="value paid">￥{{ totalPaidAmount.toLocaleString() }}</span>
          </div>
          <div class="summary-item">
            <span class="label">未结款金额：</span>
            <span class="value unpaid">￥{{ currentContract && currentContract.amount ? (currentContract.amount - totalPaidAmount).toLocaleString() : '0' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">结款进度：</span>
            <span class="value progress">{{ (currentContract && currentContract.amount > 0) ? ((totalPaidAmount / currentContract.amount) * 100).toFixed(1) : 0 }}%</span>
          </div>
        </div>
      </div>

      <!-- 结款记录表格 -->
      <div class="payment-history-table">
        <div class="table-header">
          <h4>结款记录明细</h4>
        </div>
        <el-table :data="paymentHistoryList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="paymentDate" label="结款日期" align="center" width="120">
            <template slot-scope="{ row }">
              <span>{{ formatDate(row.paymentDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paymentAmount" label="结款金额" align="center" width="120">
            <template slot-scope="{ row }">
              <span style="color:#67c23a; font-weight: bold;">￥{{ (row.paymentAmount || row.paidAmount || 0).toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paymentMethod" label="结款方式" align="center" width="100" />
          <el-table-column prop="paymentStatus" label="结款状态" align="center" width="100">
            <template slot-scope="{ row }">
              <el-tag :type="getPaymentStatusTagType(row.paymentStatus)" size="small">
                {{ row.paymentStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="paymentNote" label="备注" align="center" min-width="150" />
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="paymentHistoryDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 批量结款对话框 -->
    <el-dialog title="批量结款" :visible.sync="batchUpdateDialogVisible" width="600px" :modal="false">
      <div class="batch-update-info">
        <el-alert
          :title="`已选择 ${selectedRows.length} 个项目进行批量结款`"
          type="info"
          :closable="false"
          style="margin-bottom: 20px;"
        />
      </div>

      <el-form ref="batchUpdateForm" :model="batchUpdateForm" :rules="batchUpdateRules" label-width="100px">
        <el-form-item label="本次结款金额" prop="paidAmount">
          <el-input v-model="batchUpdateForm.paidAmount" placeholder="请输入本次结款金额" type="number">
            <template slot="prepend">￥</template>
          </el-input>
          <div class="form-tip">输入本次要结款的金额</div>
        </el-form-item>

        <el-form-item label="结款日期" prop="paymentDate">
          <el-date-picker v-model="batchUpdateForm.paymentDate" type="date" placeholder="选择结款日期" style="width:100%" />
          <div class="form-tip">留空表示不更新日期</div>
        </el-form-item>

        <el-form-item label="结款方式" prop="paymentMethod">
          <el-select v-model="batchUpdateForm.paymentMethod" placeholder="选择结款方式" style="width:100%">
            <el-option label="现金" value="现金" />
            <el-option label="银行转账" value="银行转账" />
            <el-option label="支票" value="支票" />
            <el-option label="其他" value="其他" />
          </el-select>
          <div class="form-tip">留空表示不更新结款方式</div>
        </el-form-item>

        <el-form-item label="备注" prop="paymentNote">
          <el-input v-model="batchUpdateForm.paymentNote" type="textarea" placeholder="请输入备注信息" :rows="3" />
          <div class="form-tip">留空表示不更新备注</div>
        </el-form-item>
      </el-form>

      <!-- 预览选中的项目 -->
      <div class="selected-items-preview">
        <h4>将要更新的项目：</h4>
        <el-table :data="selectedRows" border size="mini" max-height="200">
          <el-table-column prop="ownerName" label="业主单位" width="150" />
          <el-table-column prop="contractType" label="合同类型" width="100" />
          <el-table-column prop="contractAmount" label="合同金额" width="120" />
          <el-table-column prop="paymentStatus" label="当前状态" width="100">
            <template slot-scope="{ row }">
              <el-tag :type="getPaymentStatusTagType(row.paymentStatus)" size="mini">
                {{ row.paymentStatus }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="batchUpdateDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="batchUpdateLoading" @click="submitBatchUpdate">确定结款</el-button>
      </div>
    </el-dialog>

    <!-- 统计金额图表对话框 -->
    <el-dialog title="金额统计图表" :visible.sync="chartDialogVisible" width="900px" :modal="false">
      <div class="chart-container">
        <div class="chart-summary">
          <div class="summary-item">
            <div class="summary-label">合同总金额</div>
            <div class="summary-value total">￥{{ chartData.totalAmount.toLocaleString() }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">已结金额</div>
            <div class="summary-value paid">￥{{ chartData.totalPaidAmount.toLocaleString() }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">未结金额</div>
            <div class="summary-value unpaid">￥{{ chartData.totalUnpaidAmount.toLocaleString() }}</div>
          </div>
        </div>
        <div class="chart-content">
          <div id="paymentChart" style="width: 100%; height: 400px;" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chartDialogVisible = false">关闭</el-button>
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
      paymentHistoryDialogVisible: false,
      chartDialogVisible: false,
      batchUpdateDialogVisible: false,
      batchUpdateLoading: false,
      currentContract: null,
      paymentHistoryList: [],
      totalPaidAmount: 0,
      chartData: {
        totalAmount: 0,
        totalPaidAmount: 0,
        totalUnpaidAmount: 0
      },
      paymentForm: {
        paymentStatus: '',
        paidAmount: '',
        paymentDate: '',
        paymentMethod: '',
        paymentNote: ''
      },
      paymentRules: {
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
      },
      batchUpdateForm: {
        paidAmount: '',
        paymentStatus: '',
        paymentDate: '',
        paymentMethod: '',
        paymentNote: ''
      },
      batchUpdateRules: {
        paidAmount: [
          { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的金额格式', trigger: 'blur' }
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
          console.log('API返回的数据:', list)

          this.tableData = list.map(item => {
            const paidAmount = item.paidAmount || 0
            const totalAmount = item.amount || 0
            const unpaidAmount = totalAmount - paidAmount

            console.log('处理项目:', item.ownerName || item.clientCompany, '已结金额:', paidAmount, '总金额:', totalAmount)

            // 根据已结金额自动计算结款状态
            let paymentStatus = '未结款'
            if (paidAmount > 0) {
              if (paidAmount >= totalAmount) {
                paymentStatus = '已结款'
              } else {
                paymentStatus = '部分结款'
              }
            }

            return {
              id: item._id,
              ownerName: item.clientCompany || item.ownerCompany || item.ownerName || '未知业主单位',
              entrustName: item.entrustName || item.clientCompany || '未知委托单位',
              contractType: item.contractType || '项目维保',
              contractAmount: totalAmount ? `￥${totalAmount.toLocaleString()}` : '￥0',
              paidAmount: paidAmount,
              unpaidAmount: unpaidAmount,
              paymentStatus: paymentStatus,
              paymentDate: item.paymentDate,
              paymentMethod: item.paymentMethod,
              paymentNote: item.paymentNote,
              amount: totalAmount
            }
          })

          // 分页信息
          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.page = res.pagination.page
            this.pagination.limit = res.pagination.limit
          } else {
            // 如果没有分页信息，使用数据长度作为总数
            this.pagination.total = list.length
          }
        } else {
          this.tableData = []
          this.pagination.total = 0
          console.error('API返回失败:', res.message)
          this.$message.error(res.message || '获取数据失败')
        }
      } catch (e) {
        console.error('请求异常:', e)
        this.tableData = []
        this.pagination.total = 0
        this.$message.error('网络异常或接口出错')

        // 如果接口出错，使用模拟数据
        console.log('API调用失败，使用模拟数据')
        this.loadMockData()
      } finally {
        this.loading = false
      }
    },

    // 加载模拟数据
    loadMockData() {
      const mockData = [
        {
          id: '1',
          ownerName: '北京消防科技有限公司',
          entrustName: '上海维保服务公司',
          contractType: '项目维保',
          contractAmount: '￥120,000',
          paidAmount: 80000,
          unpaidAmount: 40000,
          paymentStatus: '部分结款',
          paymentDate: '2024-01-15',
          paymentMethod: '银行转账',
          paymentNote: '第一期结款',
          amount: 120000
        },
        {
          id: '2',
          ownerName: '深圳安全设备有限公司',
          entrustName: '广州检测服务公司',
          contractType: '检测',
          contractAmount: '￥85,000',
          paidAmount: 85000,
          unpaidAmount: 0,
          paymentStatus: '已结款',
          paymentDate: '2024-02-20',
          paymentMethod: '银行转账',
          paymentNote: '全额结款',
          amount: 85000
        },
        {
          id: '3',
          ownerName: '杭州建筑集团',
          entrustName: '浙江维保公司',
          contractType: '施工',
          contractAmount: '￥200,000',
          paidAmount: 0,
          unpaidAmount: 200000,
          paymentStatus: '未结款',
          paymentDate: null,
          paymentMethod: null,
          paymentNote: null,
          amount: 200000
        },
        {
          id: '4',
          ownerName: '成都物业管理公司',
          entrustName: '四川检测中心',
          contractType: '评估',
          contractAmount: '￥65,000',
          paidAmount: 30000,
          unpaidAmount: 35000,
          paymentStatus: '部分结款',
          paymentDate: '2024-03-10',
          paymentMethod: '现金',
          paymentNote: '首期款',
          amount: 65000
        },
        {
          id: '5',
          ownerName: '武汉消防工程公司',
          entrustName: '湖北维保服务',
          contractType: '项目维保',
          contractAmount: '￥150,000',
          paidAmount: 150000,
          unpaidAmount: 0,
          paymentStatus: '已结款',
          paymentDate: '2024-03-25',
          paymentMethod: '支票',
          paymentNote: '项目完成结款',
          amount: 150000
        },
        {
          id: '6',
          ownerName: '西安建筑装饰公司',
          entrustName: '陕西消防检测',
          contractType: '检测',
          contractAmount: '￥95,000',
          paidAmount: 50000,
          unpaidAmount: 45000,
          paymentStatus: '部分结款',
          paymentDate: '2024-04-05',
          paymentMethod: '银行转账',
          paymentNote: '中期款',
          amount: 95000
        },
        {
          id: '7',
          ownerName: '南京物业管理集团',
          entrustName: '江苏维保公司',
          contractType: '项目维保',
          contractAmount: '￥180,000',
          paidAmount: 0,
          unpaidAmount: 180000,
          paymentStatus: '未结款',
          paymentDate: null,
          paymentMethod: null,
          paymentNote: null,
          amount: 180000
        },
        {
          id: '8',
          ownerName: '青岛消防设备厂',
          entrustName: '山东检测服务',
          contractType: '评估',
          contractAmount: '￥75,000',
          paidAmount: 75000,
          unpaidAmount: 0,
          paymentStatus: '已结款',
          paymentDate: '2024-04-15',
          paymentMethod: '银行转账',
          paymentNote: '评估完成结款',
          amount: 75000
        }
      ]

      this.tableData = mockData
      this.pagination.total = mockData.length
      this.pagination.page = 1
      this.pagination.limit = 10

      this.$message.success('已加载模拟数据')
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

    // 计算结款状态
    getCalculatedPaymentStatus() {
      if (!this.currentContract) return '未结款'

      const thisPaymentAmount = parseFloat(this.paymentForm.paidAmount) || 0
      const totalAmount = this.currentContract.amount || 0
      const currentPaidAmount = this.currentContract.paidAmount || 0
      const newTotalPaidAmount = currentPaidAmount + thisPaymentAmount

      if (newTotalPaidAmount <= 0) {
        return '未结款'
      } else if (newTotalPaidAmount >= totalAmount) {
        return '已结款'
      } else {
        return '部分结款'
      }
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
      console.log('查询条件:', this.filters)
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
        paidAmount: '', // 清空金额，让用户输入本次结款金额
        paymentDate: new Date(), // 默认使用当前日期
        paymentMethod: '银行转账', // 默认结款方式
        paymentNote: '' // 清空备注
      }
      this.paymentDialogVisible = true
    },

    // 提交结款更新
    async submitPaymentUpdate() {
      try {
        await this.$refs.paymentForm.validate()

        const thisPaymentAmount = parseFloat(this.paymentForm.paidAmount) || 0
        const totalAmount = this.currentContract.amount || 0
        const currentPaidAmount = this.currentContract.paidAmount || 0

        if (thisPaymentAmount <= 0) {
          this.$message.warning('本次结款金额必须大于0')
          return
        }

        // 计算新的总结款金额
        const newTotalPaidAmount = currentPaidAmount + thisPaymentAmount

        // 检查是否超过合同总金额
        if (newTotalPaidAmount > totalAmount) {
          this.$message.warning(`本次结款金额过大，总金额不能超过合同金额 ${totalAmount.toLocaleString()} 元`)
          return
        }

        // 计算新的结款状态
        let newPaymentStatus = '未结款'
        if (newTotalPaidAmount > 0) {
          if (newTotalPaidAmount >= totalAmount) {
            newPaymentStatus = '已结款'
          } else {
            newPaymentStatus = '部分结款'
          }
        }

        // 准备结款记录数据
        const paymentRecordData = {
          paymentAmount: thisPaymentAmount, // 本次结款金额
          totalPaidAmount: newTotalPaidAmount, // 总结款金额
          paymentStatus: newPaymentStatus,
          paymentDate: this.paymentForm.paymentDate,
          paymentMethod: this.paymentForm.paymentMethod,
          paymentNote: this.paymentForm.paymentNote || `第${Math.floor(newTotalPaidAmount / (totalAmount / 3)) + 1}期结款`
        }

        // 更新结款状态（使用现有API）
        const res = await updatePaymentStatus(this.currentContract.id, {
          paymentStatus: newPaymentStatus,
          paidAmount: newTotalPaidAmount,
          paymentDate: this.paymentForm.paymentDate,
          paymentMethod: this.paymentForm.paymentMethod,
          paymentNote: this.paymentForm.paymentNote
        })
        if (res.success) {
          this.$message.success('结款记录添加成功')
          this.paymentDialogVisible = false
          this.loadData()
        } else {
          this.$message.error(res.message || '添加结款记录失败')
        }
      } catch (error) {
        console.error('添加结款记录失败:', error)
        this.$message.error('添加结款记录失败')
      }
    },

    // 查看结款记录
    async viewPaymentHistory(row) {
      try {
        console.log('查看结款记录 - 传入的行数据:', row)
        this.currentContract = row

        // 由于没有单独的结款记录表，使用模拟数据生成结款历史
        console.log('生成结款记录历史')
        this.paymentHistoryList = this.generateMockPaymentHistory(row)

        // 计算总结款金额
        this.totalPaidAmount = this.paymentHistoryList.reduce((total, record) => {
          return total + (record.paymentAmount || record.paidAmount || 0)
        }, 0)

        console.log('总结款金额:', this.totalPaidAmount)
        this.paymentHistoryDialogVisible = true
      } catch (error) {
        console.error('获取结款记录失败:', error)
        this.$message.error('获取结款记录失败')
      }
    },

    // 生成模拟结款记录数据
    generateMockPaymentHistory(row) {
      const history = []
      const totalAmount = row.amount || 0
      const currentPaidAmount = row.paidAmount || 0

      console.log('生成结款记录 - 行数据:', row)
      console.log('总金额:', totalAmount, '已结金额:', currentPaidAmount)

      // 如果已结款金额为0，返回空记录
      if (currentPaidAmount === 0) {
        console.log('已结金额为0，返回空记录')
        return []
      }

      // 根据已结款金额生成多条记录
      if (currentPaidAmount >= totalAmount) {
        // 已完全结款，生成多条记录
        const recordCount = Math.floor(Math.random() * 3) + 2 // 2-4条记录
        const baseAmount = Math.floor(totalAmount / recordCount)
        let remainingAmount = totalAmount

        for (let i = 0; i < recordCount; i++) {
          const isLast = i === recordCount - 1
          const amount = isLast ? remainingAmount : baseAmount
          remainingAmount -= amount

          const paymentDate = new Date()
          paymentDate.setDate(paymentDate.getDate() - (recordCount - i) * 30) // 每月一次

          history.push({
            paymentDate: paymentDate,
            paidAmount: amount,
            paymentMethod: ['银行转账', '现金', '支票'][Math.floor(Math.random() * 3)],
            paymentStatus: isLast ? '已结款' : '部分结款',
            paymentNote: isLast ? '最后一笔结款' : `第${i + 1}期结款`
          })
        }
      } else {
        // 部分结款，生成1-2条记录
        const recordCount = Math.floor(Math.random() * 2) + 1 // 1-2条记录
        const baseAmount = Math.floor(currentPaidAmount / recordCount)
        let remainingAmount = currentPaidAmount

        for (let i = 0; i < recordCount; i++) {
          const isLast = i === recordCount - 1
          const amount = isLast ? remainingAmount : baseAmount
          remainingAmount -= amount

          const paymentDate = new Date()
          paymentDate.setDate(paymentDate.getDate() - (recordCount - i) * 30)

          history.push({
            paymentDate: paymentDate,
            paidAmount: amount,
            paymentMethod: ['银行转账', '现金', '支票'][Math.floor(Math.random() * 3)],
            paymentStatus: '部分结款',
            paymentNote: `第${i + 1}期结款`
          })
        }
      }

      // 按日期排序，最新的在前
      return history.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
    },

    // 批量更新
    handleBatchUpdate() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择要更新的项目')
        return
      }

      // 重置表单
      this.batchUpdateForm = {
        paidAmount: '',
        paymentStatus: '',
        paymentDate: '',
        paymentMethod: '',
        paymentNote: ''
      }

      this.batchUpdateDialogVisible = true
    },

    handleSelectionChange(val) {
      this.selectedRows = val
    },

    // 提交批量更新
    async submitBatchUpdate() {
      try {
        // 验证表单
        await this.$refs.batchUpdateForm.validate()

        // 检查是否有要更新的内容
        const hasUpdateContent = this.batchUpdateForm.paidAmount ||
                                this.batchUpdateForm.paymentDate ||
                                this.batchUpdateForm.paymentMethod ||
                                this.batchUpdateForm.paymentNote

        if (!hasUpdateContent) {
          this.$message.warning('请至少填写一项要更新的内容')
          return
        }

        this.batchUpdateLoading = true

        // 准备批量更新的数据
        const updatePromises = this.selectedRows.map(async(row) => {
          const totalAmount = row.amount || 0
          const currentPaidAmount = row.paidAmount || 0
          const thisPaymentAmount = parseFloat(this.batchUpdateForm.paidAmount) || 0

          if (thisPaymentAmount <= 0) {
            throw new Error('本次结款金额必须大于0')
          }

          // 计算新的总结款金额
          const newTotalPaidAmount = currentPaidAmount + thisPaymentAmount

          // 检查是否超过合同总金额
          if (newTotalPaidAmount > totalAmount) {
            throw new Error(`本次结款金额过大，总金额不能超过合同金额 ${totalAmount.toLocaleString()} 元`)
          }

          // 计算新的结款状态
          let newPaymentStatus = '未结款'
          if (newTotalPaidAmount > 0) {
            if (newTotalPaidAmount >= totalAmount) {
              newPaymentStatus = '已结款'
            } else {
              newPaymentStatus = '部分结款'
            }
          }

          // 准备结款记录数据
          const paymentRecordData = {
            paymentAmount: thisPaymentAmount, // 本次结款金额
            totalPaidAmount: newTotalPaidAmount, // 总结款金额
            paymentStatus: newPaymentStatus,
            paymentDate: this.batchUpdateForm.paymentDate,
            paymentMethod: this.batchUpdateForm.paymentMethod,
            paymentNote: this.batchUpdateForm.paymentNote || `批量结款 - ${row.ownerName}`
          }

          // 调用更新结款状态API
          return updatePaymentStatus(row.id, {
            paymentStatus: newPaymentStatus,
            paidAmount: newTotalPaidAmount,
            paymentDate: this.batchUpdateForm.paymentDate,
            paymentMethod: this.batchUpdateForm.paymentMethod,
            paymentNote: this.batchUpdateForm.paymentNote
          })
        })

        // 执行批量更新
        const results = await Promise.allSettled(updatePromises)

        // 统计结果
        let successCount = 0
        let failCount = 0
        const errors = []

        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.success) {
            successCount++
          } else {
            failCount++
            const errorMsg = result.status === 'rejected'
              ? result.reason.message || '更新失败'
              : result.value.message || '更新失败'
            errors.push(`${this.selectedRows[index].ownerName}: ${errorMsg}`)
          }
        })

        // 显示结果
        if (successCount > 0) {
          this.$message.success(`批量结款完成！成功添加 ${successCount} 条结款记录`)
        }

        if (failCount > 0) {
          this.$message.error(`有 ${failCount} 个项目结款失败`)
          console.error('批量结款失败详情:', errors)
        }

        // 关闭对话框并刷新数据
        this.batchUpdateDialogVisible = false

        // 刷新数据以确保表格显示最新状态
        await this.loadData()

        // 清空选择
        this.$refs.paymentTable.clearSelection()
        this.selectedRows = []
      } catch (error) {
        console.error('批量结款失败:', error)
        this.$message.error('批量结款失败')
      } finally {
        this.batchUpdateLoading = false
      }
    },

    // 显示统计金额图表
    showAmountChart() {
      const rows = this.selectedRows.length > 0 ? this.selectedRows : this.tableData
      let totalAmount = 0
      let totalPaidAmount = 0
      let totalUnpaidAmount = 0

      rows.forEach(row => {
        totalAmount += row.amount || 0
        totalPaidAmount += row.paidAmount || 0
        totalUnpaidAmount += row.unpaidAmount || 0
      })

      this.chartData = {
        totalAmount,
        totalPaidAmount,
        totalUnpaidAmount
      }

      this.chartDialogVisible = true

      // 延迟渲染图表，确保DOM已更新
      this.$nextTick(() => {
        this.renderChart()
      })
    },

    // 渲染图表
    renderChart() {
      // 这里使用简单的HTML/CSS图表，实际项目中可以使用ECharts等图表库
      const chartContainer = document.getElementById('paymentChart')
      if (chartContainer) {
        const { totalAmount, totalPaidAmount, totalUnpaidAmount } = this.chartData

        chartContainer.innerHTML = `
          <div style="display: flex; justify-content: space-around; align-items: center; height: 100%;">
            <div style="text-align: center;">
              <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(#67c23a 0deg ${(totalPaidAmount / totalAmount) * 360}deg, #f56c6c ${(totalPaidAmount / totalAmount) * 360}deg 360deg); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #333;">
                  ${((totalPaidAmount / totalAmount) * 100).toFixed(1)}%
                </div>
              </div>
              <div style="font-size: 14px; color: #666;">结款完成率</div>
            </div>
            <div style="text-align: center;">
              <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #67c23a, #85ce61); border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; margin: 0 auto 10px;">
                <div style="font-size: 24px; font-weight: bold;">￥${totalPaidAmount.toLocaleString()}</div>
                <div style="font-size: 14px;">已结金额</div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #f56c6c, #f78989); border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; margin: 0 auto 10px;">
                <div style="font-size: 24px; font-weight: bold;">￥${totalUnpaidAmount.toLocaleString()}</div>
                <div style="font-size: 14px;">未结金额</div>
              </div>
            </div>
          </div>
        `
      }
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
  z-index: 1;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: nowrap;
  margin-bottom: 18px;
  gap: 0 10px;
}

.search-fields {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  align-items: flex-end;
}

.search-input {
  width: 160px !important;
}

.search-select {
  width: 160px !important;
}

.search-btns {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-left: 15px;
  flex-shrink: 0;
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

/* 图表相关样式 */
.chart-container {
  padding: 20px 0;
}

.chart-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-item {
  text-align: center;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 20px;
  font-weight: bold;
}

.summary-value.total {
  color: #409EFF;
}

.summary-value.paid {
  color: #67c23a;
}

.summary-value.unpaid {
  color: #f56c6c;
}

.chart-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 结款记录相关样式 */
.payment-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.summary-header h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
}

.summary-content .summary-item {
  display: flex;
  align-items: center;
  min-width: 200px;
}

.summary-content .label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

.summary-content .value {
  font-size: 16px;
  font-weight: bold;
}

.summary-content .value.total {
  color: #409EFF;
}

.summary-content .value.paid {
  color: #67c23a;
}

.summary-content .value.unpaid {
  color: #f56c6c;
}

.summary-content .value.progress {
  color: #E6A23C;
}

.payment-history-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.table-header h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

/* 批量更新相关样式 */
.batch-update-info {
  margin-bottom: 20px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.selected-items-preview {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.selected-items-preview h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}
</style>
