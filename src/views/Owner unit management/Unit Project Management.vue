<template>
  <div class="unit-manage-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-input v-model="filters.ownerName" placeholder="输入业主单位名称搜索" style="width:220px" clearable />
      <el-input v-model="filters.entrustName" placeholder="输入委托单位搜索" style="width:220px" clearable />
      <el-select v-model="filters.status" placeholder="选择服务状态" style="width:180px" clearable>
        <el-option label="服务中" value="服务中" />
        <el-option label="已到期" value="已到期" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </div>
    <!-- 统计信息 -->
    <div style="text-align:right; margin-bottom:6px;">
      共查询到{{ pagination.total }}条
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%; margin-top: 16px"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }" :empty-text="' '">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="ownerName" label="业主单位名称" align="center" />
      <el-table-column prop="entrustName" label="委托单位" align="center" />
      <el-table-column prop="status" label="当前服务状态" align="center">
        <template slot-scope="{ row }">
          <span style="color:#409eff">{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractAmount" label="合同金额" align="center" />
      <el-table-column prop="days" label="当前合同时间" align="center">
        <template slot-scope="{ row }">
          <span style="color:#409eff">剩余：{{ row.days }}天</span>
        </template>
      </el-table-column>
      <el-table-column prop="renewStatus" label="续签情况" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="getRenewStatusTagType(row.renewStatus)" effect="dark" size="small">
            {{ row.renewStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{ row, $index }">
          <el-link type="primary" @click="viewDetail(row)">项目详情</el-link>
          <el-link type="success" style="margin:0 8px" @click="onRenew(row)">续签</el-link>
          <el-link type="danger" @click="onDelete(row)">删除</el-link>
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
  </div>
</template>
<script>
import { fetchContracts, deleteContract } from '@/api/contract'

export default {
  name: 'UnitProjectManagement',
  data() {
    return {
      filters: {
        ownerName: '',
        entrustName: '',
        status: ''
      },
      tableData: [],
      loading: false,
      pagination: {
        page: 1,
        limit: 10,
        total: 0
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
        const res = await fetchContracts(params)
        if (res.success) {
          const list = res.data || []

          this.tableData = list.map(item => {
            const days = item.endDate ? this.getRemainDays(item.endDate) : ''
            return {
              id: item._id,
              ownerName: item.project?.ownerCompany || '',
              entrustName: item.clientCompany || '',
              status: item.status || '',
              contractAmount: item.amount ? `￥${item.amount.toLocaleString()}` : '',
              days: days,
              renewStatus: item.renewStatus || '未续签'
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
    getRenewStatusTagType(status) {
      if (status === '待续签') return 'warning'
      if (status === '可续签') return 'primary'
      if (status === '已续签') return 'success'
      return 'info'
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
      this.filters = { ownerName: '', entrustName: '', status: '' }
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
  align-items: center;
  margin-bottom: 12px;
  gap: 0 10px;
  flex-wrap: wrap;
}

.search-bar>* {
  margin-right: 0 !important;
  min-width: 120px;
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
</style>
