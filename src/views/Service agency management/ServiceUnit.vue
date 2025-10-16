<template>
  <div class="work-order-management-page">
    <div class="search-filter">
      <div class="filter-item">
        <input
          v-model="searchParams.name"
          type="text"
          placeholder="输入服务商名称搜索"
          class="filter-input"
        >
      </div>
      <div class="filter-item">
        <input
          v-model="searchParams.contactPerson"
          type="text"
          placeholder="输入联系人搜索"
          class="filter-input"
        >
      </div>
      <div class="filter-item">
        <el-select
          v-model="searchParams.status"
          placeholder="服务状态"
        >
          <el-option label="正常" value="1" />
          <el-option label="停用" value="0" />
        </el-select>
      </div>
      <div class="filter-actions">
        <button class="btn btn-primary" @click="handleSearch">
          <i class="el-icon-search search-icon" /> 查询
        </button>
        <button class="btn btn-secondary" @click="handleReset">
          <i class="el-icon-refresh reset-icon" /> 重置
        </button>
        <button class="btn btn-success" @click="handleAdd">
          <i class="el-icon-plus" /> 新增服务商
        </button>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>服务商名称</th>
            <th>联系人</th>
            <th>联系电话</th>
            <th>服务状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="no-data">
              <div class="empty-state">
                <p>加载中...</p>
              </div>
            </td>
          </tr>
          <tr v-else-if="serviceAgencyList.length === 0">
            <td colspan="7" class="no-data">
              <div class="empty-state">
                <img src="your-xls-icon-path.png" alt="没有数据" class="empty-icon">
                <p>暂无数据</p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(item, index) in serviceAgencyList" :key="item.id">
            <td>{{ (queryParams.page - 1) * queryParams.size + index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.contactPerson }}</td>
            <td>{{ item.contactPhone }}</td>
            <td>
              <span :class="item.status === 1 ? 'status-active' : 'status-inactive'">
                {{ item.status === 1 ? '正常' : '停用' }}
              </span>
            </td>
            <td>{{ formatDate(item.createTime) }}</td>
            <td>
              <button class="btn btn-sm btn-primary" @click="handleEdit(item)">编辑</button>
              <button class="btn btn-sm btn-danger" @click="handleDelete(item)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getServiceAgencyList, deleteServiceAgency } from '@/api/serviceAgency'

export default {
  name: 'ServiceUnit',
  data() {
    return {
      loading: false,
      serviceAgencyList: [],
      total: 0,
      searchParams: { // 搜索过滤条件
        name: '',
        contactPerson: '',
        status: ''
      },
      queryParams: {
        page: 1,
        size: 10,
        name: '',
        contactPerson: '',
        status: ''
      }
    }
  },
  created() {
    this.getServiceAgencyList()
  },
  methods: {
    // 获取服务商列表
    async getServiceAgencyList() {
      try {
        this.loading = true
        const response = await getServiceAgencyList(this.queryParams)
        this.serviceAgencyList = response.data.records || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('获取服务商列表失败:', error)
        this.$message.error('获取服务商列表失败')
      } finally {
        this.loading = false
      }
    },
    // 搜索
    handleSearch() {
      this.queryParams = {
        ...this.queryParams,
        ...this.searchParams,
        page: 1
      }
      this.getServiceAgencyList()
    },
    // 重置
    handleReset() {
      this.searchParams = {
        name: '',
        contactPerson: '',
        status: ''
      }
      this.queryParams = {
        page: 1,
        size: 10,
        name: '',
        contactPerson: '',
        status: ''
      }
      this.getServiceAgencyList()
    },
    // 新增服务商
    handleAdd() {
      this.$router.push('/service-agency/add')
    },
    // 编辑服务商
    handleEdit(item) {
      this.$router.push(`/service-agency/edit/${item.id}`)
    },
    // 删除服务商
    async handleDelete(item) {
      try {
        await this.$confirm('确定要删除这个服务商吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await deleteServiceAgency(item.id)
        this.$message.success('删除成功')
        this.getServiceAgencyList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除服务商失败:', error)
          this.$message.error('删除失败')
        }
      }
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.queryParams.size = val
      this.queryParams.page = 1
      this.getServiceAgencyList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.getServiceAgencyList()
    },
    // 格式化日期
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.work-order-management-page {
  padding: 20px;
}

/* 顶部导航/选项卡 */
.tab-navigation {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab-item {
  padding: 10px 15px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  position: relative;
  margin-right: 10px;
}

.tab-item.active {
  color: #409EFF; /* 选中状态颜色 */
  border-bottom: 2px solid #409EFF; /* 选中状态下划线 */
  font-weight: bold;
}

/* 搜索过滤区域 */
.search-filter {
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  gap: 15px; /* 输入框之间的间隔 */
  margin-bottom: 20px;
  align-items: center; /* 垂直居中对齐 */
}

.filter-item {
    display: flex;
    align-items: center;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  height: 36px; /* 统一高度 */
}

.filter-actions {
  display: flex;
  gap: 10px; /* 按钮之间的间隔 */
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.btn-primary {
  background-color: #409EFF; /* 主色调 */
  color: white;
  text-align: center;
}

.btn-primary:hover {
   background-color: #66b1ff;
}

.btn-secondary {
   background-color: #f0f0f0;
   color: #333;
}

.btn-secondary:hover {
   background-color: #ddd;
}

/* 图标样式 (示例，需要替换为实际的 SVG 或图标字体) */
.search-icon, .reset-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    /* 这里可以添加背景图片或使用图标字体 */
    /* 必要，否则伪元素不显示 */
    /* content: "icon="el-icon-search""; */
}

/* 表格样式 */
.table-container {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow-x: auto; /* 水平滚动 */
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f5f7fa; /* 表头背景色 */
  font-weight: bold;
}

/* 无数据状态 */
.no-data {
  text-align: center;
  padding: 50px 0;
  color: #909399;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty-icon {
    width: 80px; /* 根据图标实际大小调整 */
    height: 80px; /* 根据图标实际大小调整 */
    margin-bottom: 10px;
}

.filter-date {
  width: 260px;
}

/* 状态样式 */
.status-active {
  color: #67c23a;
  font-weight: bold;
}

.status-inactive {
  color: #f56c6c;
  font-weight: bold;
}

/* 按钮样式 */
.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  margin-right: 5px;
}

.btn-success {
  background-color: #67c23a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-success:hover {
  background-color: #5daf34;
}

/* 分页样式 */
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
