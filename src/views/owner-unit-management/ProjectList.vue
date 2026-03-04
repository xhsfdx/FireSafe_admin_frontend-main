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
        <div class="contract-type-btns">
          <el-button
            :type="filters.contractType === '' ? 'primary' : 'default'"
            size="small"
            @click="filters.contractType = ''; onSearch()"
          >全部</el-button>
          <el-button
            v-for="ct in contractTypes"
            :key="ct"
            :type="filters.contractType === ct ? 'primary' : 'default'"
            size="small"
            @click="filters.contractType = ct; onSearch()"
          >{{ ct }}</el-button>
        </div>
      </div>
      <div class="search-btns">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
        <el-button v-if="$canViewSensitiveData" type="primary" icon="el-icon-s-finance" @click="handleSumAmount">统计金额</el-button>
        <el-button v-if="$canEdit" type="success" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </div>
    </div>
    <!-- 统计信息 -->
    <div style="text-align:right; margin-bottom:6px;">
      共查询到{{ getTotalCount() }}条数据
    </div>
    <!-- 表格 -->
    <el-table
      ref="unitTable"
      :data="tableData || []"
      border
      style="width: 100%; margin-top: 16px"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      :empty-text="'暂无数据'"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ getSerialNumber(scope.$index) }}
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" label="业主单位名称" align="center" />
      <el-table-column prop="entrustName" label="委托单位" align="center" />
      <el-table-column prop="contractType" label="合同种类" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.contractType === '长期性合同' ? 'success' : 'warning'" size="small">
            {{ row.contractType || '未知' }}
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
      <el-table-column v-if="$canViewSensitiveData" prop="contractAmount" label="合同金额" align="center" />
      <el-table-column prop="days" label="当前合同时间" align="center">
        <template slot-scope="{ row }">
          <span style="color:#409eff">剩余：{{ row.days || 0 }}天</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="$canEdit ? 280 : 100" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">项目详情</el-link>
          <template v-if="$canEdit">
            <el-link type="success" style="margin:0 8px" @click="onRenew(row)">续签</el-link>
            <el-link type="danger" style="margin:0 8px" @click="onDelete(row)">删除</el-link>
            <!-- 审核按钮 - 只在已提交状态显示 -->
            <template v-if="row.status === '已提交'">
              <el-button type="success" size="mini" style="margin:0 4px" @click="onApprove(row)">通过</el-button>
              <el-button type="danger" size="mini" style="margin:0 4px" @click="onReject(row)">不通过</el-button>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <div style="text-align:right;margin-top:8px;">
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
    <div v-if="tableData.length === 0" class="table-empty">
      <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">
      <div class="empty-text">暂无数据</div>
    </div>

    <!-- 审核对话框 -->
    <el-dialog :title="auditDialogTitle" :visible.sync="auditDialogVisible" width="500px">
      <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="100px">
        <el-form-item label="审核意见" prop="auditNote">
          <el-input v-model="auditForm.auditNote" type="textarea" placeholder="请输入审核意见" :rows="4" />
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
import tableListMixin from '@/utils/mixins/table-list'
import roleMixin from '@/mixins/roleMixin'
import { getStatusTagType, getStatusDisplayText, getRemainDays, formatAmount } from '@/utils/status-helper'

export default {
  name: 'UnitProject',
  mixins: [tableListMixin, roleMixin],
  data() {
    return {
      contractTypes: ['施工', '评估', '检测', '项目维保'],
      filters: {
        ownerName: '',
        entrustName: '',
        status: '',
        contractType: ''
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
    console.log('🔄 Unit Project Management 页面被激活，重新加载数据')
    this.loadData()
  },
  methods: {
    // 获取总数据条数
    getTotalCount() {
      return this.pagination.total || this.tableData.length
    },
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
        if (this.filters.ownerName) params.ownerName = this.filters.ownerName
        if (this.filters.contractType) params.contractType = this.filters.contractType

        const res = await fetchContracts(params)
        
        // 使用mixin提供的数据映射方法
        const dataMapper = (item, index) => {
          const days = item.endDate ? getRemainDays(item.endDate) : 0
          return {
            id: item.contractId || `temp_${Date.now()}_${index}`,
            projectid: item.project_id || item.contractId || '',
            ownerName: item.ownerCompany || '',
            entrustName: item.clientCompany || '',
            contractType: item.contractType || '长期性合同',
            status: item.status || '草稿',
            contractAmount: formatAmount(item.amount),
            days: days
          }
        }
        
        this.handleApiResponse(res, dataMapper)
      } catch (e) {
        this.handleApiError(e)
      } finally {
        this.loading = false
      }
    },
    
    // 获取状态标签类型（使用工具函数）
    getStatusTagType(status) {
      return getStatusTagType(status)
    },
    
    // 获取状态显示文本（使用工具函数）
    getStatusDisplayText(status) {
      return getStatusDisplayText(status)
    },
    // 新增
    onAdd() {
      this.$router.push({ name: 'AddContractPage' })
    },
    // 查看详情
    viewDetail(row) {
      console.log('🚀 准备跳转到项目详情页面，行数据:', row)
      console.log('使用的项目ID:', row.projectid)
      console.log('使用的合同ID:', row.id)
      console.log('业主单位名称:', row.ownerName)
      console.log('委托单位名称:', row.entrustName)

      // 优先使用项目ID，如果没有则使用合同ID
      // 后端现在可以同时处理项目ID和合同ID
      const targetId = row.projectid || row.id

      // 验证是否有有效的ID
      if (!targetId) {
        console.error('❌ 没有有效的项目ID或合同ID')
        this.$message.error('无法获取项目详情：缺少项目ID或合同ID')
        return
      }

      console.log('🎯 最终传递的目标ID:', targetId)
      console.log('🎯 跳转URL参数:', {
        id: targetId,
        contractId: row.id,
        ownerName: row.ownerName,
        entrustName: row.entrustName
      })

      this.$router.push({
        name: 'UnitDetail',
        query: {
          id: targetId, // 传递项目ID或合同ID
          contractId: row.id, // 传递合同ID作为备用标识
          ownerName: row.ownerName,
          entrustName: row.entrustName
        }
      })
    },
    // 续签
    onRenew(row) {
      console.log('🚀 准备跳转到续签页面，行数据:', row)
      console.log('使用的项目ID:', row.projectid)
      console.log('使用的合同ID:', row.id)

      // 传递完整的参数，确保续签页面能正确返回
      const targetId = row.projectid || row.id

      if (!targetId) {
        console.error('❌ 没有有效的项目ID或合同ID')
        this.$message.error('无法进行续签：缺少项目ID或合同ID')
        return
      }

      console.log('🎯 续签页面跳转参数:', {
        id: targetId,
        contractId: row.id,
        ownerName: row.ownerName,
        entrustName: row.entrustName
      })

      this.$router.push({
        name: 'RenewalPage',
        query: {
          id: targetId,
          contractId: row.id,
          ownerName: row.ownerName,
          entrustName: row.entrustName
        }
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
      this.selectedRows = val
    },
    handleSumAmount() {
      const rows = this.selectedRows.length > 0 ? this.selectedRows : this.tableData
      const sum = rows.reduce((acc, cur) => {
        // 兼容金额格式
        let amount = cur.amount || cur.contractAmount || 0
        if (typeof amount === 'string') {
          amount = Number(amount.replace(/[￥,]/g, '')) || 0
        }
        return acc + amount
      }, 0)
      this.$message.info(`合同金额合计：￥${sum.toLocaleString()}`)
    },

    // 审核通过
    onApprove(row) {
      this.currentContract = row
      this.auditType = 'approve'
      this.auditDialogTitle = '审核通过'
      this.auditForm.auditNote = ''
      this.auditDialogVisible = true
    },

    // 审核不通过
    onReject(row) {
      this.currentContract = row
      this.auditType = 'reject'
      this.auditDialogTitle = '审核不通过'
      this.auditForm.auditNote = ''
      this.auditDialogVisible = true
    },

    // 提交审核
    async submitAudit() {
      try {
        await this.$refs.auditForm.validate()

        let res
        if (this.auditType === 'approve') {
          res = await approveContract(this.currentContract.id, {
            auditNote: this.auditForm.auditNote
          })
        } else {
          res = await rejectContract(this.currentContract.id, {
            auditNote: this.auditForm.auditNote
          })
        }

        if (res.success) {
          this.$message.success(res.message || '审核成功')
          this.auditDialogVisible = false
          this.loadData() // 刷新数据
        } else {
          this.$message.error(res.message || '审核失败')
        }
      } catch (error) {
        console.error('审核失败:', error)
        this.$message.error('审核失败')
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

.contract-type-btns {
  display: inline-flex;
  gap: 0;
  align-items: center;
}
.contract-type-btns .el-button {
  border-radius: 0;
  margin-left: -1px;
}
.contract-type-btns .el-button:first-child {
  border-radius: 4px 0 0 4px;
  margin-left: 0;
}
.contract-type-btns .el-button:last-child {
  border-radius: 0 4px 4px 0;
}

</style>
