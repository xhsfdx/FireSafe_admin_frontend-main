<template>
  <div class="owner-account-page">
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>业主单位账号管理</h1>
        <div class="header-info">
          <span class="account-count">
            共 {{ tableData.length }} 个账号
          </span>
        </div>
      </div>

      <!-- 搜索和操作栏 -->
      <div class="search-toolbar">
        <div class="toolbar-content">
          <div class="search-filters">
            <el-input
              v-model="filters.name"
              placeholder="姓名"
              size="small"
              class="filter-input"
              clearable
            />
            <el-input
              v-model="filters.phone"
              placeholder="电话"
              size="small"
              class="filter-input"
              clearable
            />
            <el-select
              v-model="filters.status"
              placeholder="账号状态"
              size="small"
              class="filter-select"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="正常" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </div>
          <div class="action-buttons">
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
            <el-button
              type="primary"
              style="background: #885cf7; border-color: #885cf7;"
              icon="el-icon-link"
              @click="jumpSystem"
            >跳转到社会单位系统</el-button>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="filteredData"
          border
          style="width: 100%;"
          empty-text="暂无数据"
          header-cell-class-name="table-header"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="role" label="用户角色" align="center" />
          <el-table-column prop="mobile" label="手机号" align="center" />
          <el-table-column prop="statusText" label="账号状态" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                {{ row.statusText }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="{ row }">
              <div class="table-actions">
                <el-button size="mini" type="primary" @click="viewDetail(row)">详情</el-button>
                <el-button size="mini" type="success" @click="editAccount(row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteRow(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getcustomers, Deletecustomer } from '@/api/customer'
export default {
  name: 'UserManagePage',
  data() {
    return {
      loading: false,
      filters: {
        name: '',
        phone: '',
        status: ''
      },
      tableData: []
    }
  },
  computed: {
    filteredData() {
      // 显示所有数据，根据搜索条件过滤
      let list = this.tableData
      if (this.filters.name) list = list.filter(row => row.name.includes(this.filters.name))
      if (this.filters.phone) list = list.filter(row => row.mobile && row.mobile.includes(this.filters.phone))
      if (this.filters.status) list = list.filter(row => row.status + '' === this.filters.status)
      return list
    }
  },
  created() {
    this.loadData()
  },
  methods: {

    async loadData() {
      try {
        this.loading = true
        console.log('开始加载客户数据...')
        const res = await getcustomers()
        console.log('客户数据响应:', res)

        if (res.code === 200 && res.data) {
          const rawData = res.data || []
          console.log('原始数据:', rawData)

          this.tableData = rawData.map(item => {
            return {
              id: item._id,
              username: item.username || '未设置',
              name: item.name || '未设置',
              createTime: this.formatTime(item.createTime),
              role: item.role || '未设置',
              mobile: item.mobile || '未设置',
              status: item.user && item.user.active ? 1 : 0,
              statusText: item.user && item.user.active ? '正常' : '禁用',
              // 添加更多字段用于详情显示
              userId: item.userId || '',
              organization: item.organization || '',
              originalData: item // 保存原始数据
            }
          })

          console.log('处理后的表格数据:', this.tableData)

          this.$message.success('数据加载成功')
        } else {
          console.error('API响应错误:', res)
          this.$message.error(res.msg || '加载数据失败')
        }
      } catch (err) {
        console.error('加载数据失败:', err)
        this.$message.error('加载数据失败: ' + err.message)
      } finally {
        this.loading = false
      }
    },
    formatTime(timeStr) {
      const d = new Date(timeStr)
      const Y = d.getFullYear()
      const M = (d.getMonth() + 1).toString().padStart(2, '0')
      const D = d.getDate().toString().padStart(2, '0')
      const h = d.getHours().toString().padStart(2, '0')
      const m = d.getMinutes().toString().padStart(2, '0')
      const s = d.getSeconds().toString().padStart(2, '0')
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    },
    async onSearch() {
      this.loadData()
    },
    onReset() {
      this.filters = { name: '', phone: '', status: '' }
      this.$message.success('重置成功')
    },
    onAdd() {
      this.$router.push('/system/account-add')// 跳转路由路径，按你项目实际配置
    },
    jumpSystem() {
      window.location.href = 'http://xfgl.diweiyunlian.cn/login?redirect=/basicInforManage'
    },
    viewDetail(row) {
      // 跳转到详情页面，传递完整数据
      this.$router.push({
        path: '/system/customer-detail',
        query: {
          id: row.id,
          data: JSON.stringify(row.originalData)
        }
      })
    },
    editAccount(row) {
      // 跳转到编辑页面
      this.$router.push({
        path: '/system/edit-customer-account',
        query: { id: row.id }
      })
    },
    async deleteRow(row) {
      const res = await Deletecustomer(row.id)
      if (res.code === 200) {
        this.$message.error('删除了一条')
        this.loadData()
      } else {
        this.$message.error('删除错误')
      }
    },
    onSetting() {
      this.$message.info('设置按钮')
    }
  }
}
</script>

<style scoped>
.owner-account-page {
  height: 100vh;
  background: #f5f5f5;
  padding: 16px;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: calc(100vh - 32px);
}

/* 页面标题 */
.page-header {
  padding: 20px;
  background: #fafbfc;
  border-bottom: 1px solid #e4e7ed;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.header-info {
  display: flex;
  align-items: center;
}

.account-count {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
}

/* 搜索工具栏 */
.search-toolbar {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.search-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-input,
.filter-select {
  width: 180px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* 表格容器 */
.table-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background: #fff;
  min-height: 400px;
}

.table-header {
  background: #f5f7fa !important;
  color: #606266 !important;
  font-weight: 600 !important;
}

.table-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.table-actions .el-button {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.table-actions .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-input,
  .filter-select {
    width: 150px;
  }

  .toolbar-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .search-filters {
    justify-content: center;
  }

  .action-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .owner-account-page {
    padding: 8px;
  }

  .main-content {
    height: calc(100vh - 16px);
  }

  .toolbar-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .filter-input,
  .filter-select {
    width: 100%;
  }

  .action-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
