<template>
  <div class="maintain-project-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-select v-model="filters.system" placeholder="消防系统" style="width: 200px; margin-right: 16px" clearable>
        <el-option v-for="item in systemList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="filters.project" placeholder="维保项目" style="width: 200px; margin-right: 16px" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-right: 8px" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" style="margin-right: 8px" @click="onReset">重置</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </div>

    <!-- 表格容器 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%;"
        empty-text="暂无数据"
        header-cell-class-name="table-header"
      >
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="name" label="点位名称" align="center" />
        <el-table-column prop="type" label="点位类型" align="center" />
        <el-table-column prop="address" label="详细地址" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'danger'">
              {{ row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="viewDetail(row)">详情</el-link>
            <el-link type="danger" style="margin-left: 10px" @click="deleteProject(row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page.sync="pagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :page-size-text="'条/页'"
        :total-text="'共 {total} 条'"
        :go-to-text="'前往'"
        :jump-text="'页'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getMaintainProjects, deleteMaintainProject } from '@/api/maintainProject'

export default {
  name: 'MaintainProjectPage',
  data() {
    return {
      loading: false,
      filters: {
        system: '',
        project: ''
      },
      systemList: ['二维码', 'NFC', '蓝牙', '其他'],
      tableData: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }

        if (this.filters.system) {
          params.type = this.filters.system
        }
        if (this.filters.project) {
          params.name = this.filters.project
        }

        console.log('请求参数:', params)
        const res = await getMaintainProjects(params)
        console.log('维保项目API响应:', res)

        if (res.success) {
          // 处理后端返回的数据结构，提取checkpoints数据
          const processedData = []
          res.data.forEach(item => {
            if (item.checkpoints && item.checkpoints.length > 0) {
              item.checkpoints.forEach(checkpoint => {
                processedData.push({
                  _id: checkpoint._id,
                  name: checkpoint.name,
                  type: checkpoint.type,
                  address: checkpoint.address,
                  status: checkpoint.status,
                  projectId: item._id,
                  projectName: item.projectName
                })
              })
            }
          })

          this.tableData = processedData
          this.pagination.total = processedData.length
        } else {
          this.$message.error(res.message || '加载数据失败')
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },

    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },

    onReset() {
      this.filters.system = ''
      this.filters.project = ''
      this.pagination.page = 1
      this.loadData()
    },

    onAdd() {
      // 跳转到新增自建维保项目页面
      this.$router.push({ name: 'AddSelfBuiltMaintenanceProject' })
    },

    viewDetail(row) {
      // 跳转到编辑页面
      this.$router.push({
        name: 'EditSelfBuiltMaintenanceProject',
        params: { id: row._id }
      })
    },

    async deleteProject(row) {
      try {
        await this.$confirm('确定要删除这个维保项目吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await deleteMaintainProject(row._id)
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

    handleSizeChange(val) {
      this.pagination.limit = val
      this.pagination.page = 1
      this.loadData()
    },

    handleCurrentChange(val) {
      this.pagination.page = val
      this.loadData()
    }
  }
}
</script>

<style scoped>
.maintain-project-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  box-sizing: border-box;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  overflow: auto;
}

.table-header {
  background: #f5f7fa !important;
  color: #606266 !important;
  font-weight: 600 !important;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .maintain-project-page {
    padding: 16px;
  }

  .search-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .maintain-project-page {
    padding: 12px;
  }

  .table-container {
    padding: 16px;
  }

  .search-bar {
    padding: 12px 16px;
  }

  .pagination-container {
    padding: 12px 16px;
  }
}
</style>
