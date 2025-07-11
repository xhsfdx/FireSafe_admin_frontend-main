<template>
  <div class="unit-manage-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <div class="search-fields">
        <el-input v-model="filters.ownerName" placeholder="输入业主单位名称搜索" style="width:180px" clearable />
        <el-input v-model="filters.entrustName" placeholder="输入委托单位搜索" style="width:180px" clearable />
        <el-select v-model="filters.status" placeholder="选择服务状态" style="width:180px" clearable>
          <el-option label="待处理" value="草稿" />
          <el-option label="待审核" value="已提交" />
          <el-option label="服务中" value="已审核" />
          <el-option label="已完成" value="已归档" />
          <el-option label="已续签" value="已续签" />
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
        <el-button type="success" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </div>
    </div>
    <!-- 统计信息 -->
    <div style="text-align:right; margin-bottom:6px;">
      共查询到{{ pagination.total }}条
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%; margin-top: 16px"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }" :empty-text="' '"
      @selection-change="handleSelectionChange" ref="unitTable">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="ownerName" label="业主单位名称" align="center" />
      <el-table-column prop="entrustName" label="委托单位" align="center" />
      <el-table-column prop="contractType" label="合同种类" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.contractType === '长期性合同' ? 'success' : 'warning'" size="small">
            {{ row.contractType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="当前服务状态" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="getStatusTagType(row.status)" effect="dark" size="small">
            {{ getStatusDisplayText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contractAmount" label="合同金额" align="center" />
      <el-table-column prop="days" label="当前合同时间" align="center">
        <template slot-scope="{ row }">
          <span style="color:#409eff">剩余：{{ row.days }}天</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="{ row, $index }">
          <el-link type="primary" @click="viewDetail(row)">项目详情</el-link>
          <el-link type="success" style="margin:0 8px" @click="onRenew(row)">续签</el-link>
          <el-link type="danger" style="margin:0 8px" @click="onDelete(row)">删除</el-link>
          <!-- 审核按钮 - 只在已提交状态显示 -->
          <template v-if="row.status === '已提交'">
            <el-button type="success" size="mini" style="margin:0 4px" @click="onApprove(row)">通过</el-button>
            <el-button type="danger" size="mini" style="margin:0 4px" @click="onReject(row)">不通过</el-button>
          </template>
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
    
    <!-- 审核对话框 -->
    <el-dialog :title="auditDialogTitle" :visible.sync="auditDialogVisible" width="500px">
      <el-form :model="auditForm" :rules="auditRules" ref="auditForm" label-width="100px">
        <el-form-item label="审核意见" prop="auditNote">
          <el-input v-model="auditForm.auditNote" type="textarea" placeholder="请输入审核意见" :rows="4">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchContracts, deleteContract, approveContract, rejectContract } from '@/api/contract'

export default {
  name: 'UnitProjectManagement',
  data() {
    return {
      filters: {
        ownerName: '',
        entrustName: '',
        status: '',
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
      // 审核相关数据
      auditDialogVisible: false,
      auditDialogTitle: '',
      auditType: '', // 'approve' 或 'reject'
      currentContract: null,
      auditForm: {
        auditNote: ''
      },
      auditRules: {
        auditNote: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
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
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.entrustName) params.clientCompany = this.filters.entrustName
        if (this.filters.ownerName) params.ownerName = this.filters.ownerName // 如果后端有这个字段
        if (this.filters.contractType) params.contractType = this.filters.contractType
        const res = await fetchContracts(params)
        if (res.success) {
          const list = res.data || []

          this.tableData = list.map(item => {
            const days = item.endDate ? this.getRemainDays(item.endDate) : ''
            return {
              id: item._id,
              ownerName: item.project?.ownerCompany || '',
              entrustName: item.clientCompany || '',
              contractType: item.contractType || '长期性合同',
              status: item.status || '',
              contractAmount: item.amount ? `￥${item.amount.toLocaleString()}` : '',
              days: days
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
    // 获取剩余天数
    getRemainDays(endDate) {
      const end = new Date(endDate)
      const now = new Date()
      const diff = Math.ceil((end - now) / (1000 * 3600 * 24))
      return diff > 0 ? diff : 0
    },
    
    // 获取状态标签类型
    getStatusTagType(status) {
      const statusMap = {
        '草稿': 'info',
        '已提交': 'warning',
        '已审核': 'success',
        '已归档': 'primary',
        '已续签': 'success'
      }
      return statusMap[status] || 'info'
    },
    
    // 获取状态显示文本
    getStatusDisplayText(status) {
      const statusMap = {
        '草稿': '待处理',
        '已提交': '待审核',
        '已审核': '服务中',
        '已归档': '已完成',
        '已续签': '已续签'
      }
      return statusMap[status] || status
    },

    // 翻页事件
    handlePageChange(page) {
      this.pagination.page = page
      this.loadData()
    },
    // 查询
    onSearch() {
      this.pagination.page = 1 // 查询重置到第一页
      this.loadData()
    },
    // 重置
    onReset() {
      this.filters = { ownerName: '', entrustName: '', status: '', contractType: '' }
      this.pagination.page = 1
      this.loadData()
    },
    // 新增
    onAdd() {
      this.$router.push({ name: 'AddContractPage' })
    },
    // 查看详情
    viewDetail(row) {
      this.$router.push({
        name: 'UnitDetail',
        query: { id: row.id }
      })
    },
    // 续签
    onRenew(row) {
      // 传递合同ID，确保续签时ID不变
      this.$router.push({
        name: 'RenewalPage',
        query: { id: row.id } // 传递合同ID，而不是其他参数
      })
    },
    // 删除
    async onDelete(row) {
      try {
        await this.$confirm(`确定删除「${row.ownerName}」吗？`, '提示', { type: 'warning' })
        const res = await deleteContract(row.id)
        if (res.success) {
          this.$message.success('删除成功')
          // 刷新表格
          this.loadData()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (err) {
        // 用户取消无需处理
      }
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    handleSumAmount() {
      let rows = this.selectedRows.length > 0 ? this.selectedRows : this.tableData;
      let sum = rows.reduce((acc, cur) => {
        // 兼容金额格式
        let amount = cur.amount || cur.contractAmount || 0;
        if (typeof amount === 'string') {
          amount = Number(amount.replace(/[￥,]/g, '')) || 0;
        }
        return acc + amount;
      }, 0);
      this.$message.info(`合同金额合计：￥${sum.toLocaleString()}`);
    },
    
    // 审核通过
    onApprove(row) {
      this.currentContract = row;
      this.auditType = 'approve';
      this.auditDialogTitle = '审核通过';
      this.auditForm.auditNote = '';
      this.auditDialogVisible = true;
    },
    
    // 审核不通过
    onReject(row) {
      this.currentContract = row;
      this.auditType = 'reject';
      this.auditDialogTitle = '审核不通过';
      this.auditForm.auditNote = '';
      this.auditDialogVisible = true;
    },
    
    // 提交审核
    async submitAudit() {
      try {
        await this.$refs.auditForm.validate();
        
        let res;
        if (this.auditType === 'approve') {
          res = await approveContract(this.currentContract.id, {
            auditNote: this.auditForm.auditNote
          });
        } else {
          res = await rejectContract(this.currentContract.id, {
            auditNote: this.auditForm.auditNote
          });
        }
        
        if (res.success) {
          this.$message.success(res.message || '审核成功');
          this.auditDialogVisible = false;
          this.loadData(); // 刷新数据
        } else {
          this.$message.error(res.message || '审核失败');
        }
      } catch (error) {
        console.error('审核失败:', error);
        this.$message.error('审核失败');
      }
    }
  }
}
</script>


<style scoped>
.unit-manage-page {
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
