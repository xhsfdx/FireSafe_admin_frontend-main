<template>
  <div class="customer-detail-page">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>业主单位账号</el-breadcrumb-item>
        <el-breadcrumb-item>客户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 用户头像和基本信息卡片 -->
    <div class="user-profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="user-avatar">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ customerData.name || '未设置' }}</h2>
            <p class="user-role">{{ customerData.role || '未设置' }}</p>
            <el-tag :type="customerData.user && customerData.user.active ? 'success' : 'danger'" size="medium">
              <i class="el-icon-circle-check" v-if="customerData.user && customerData.user.active"></i>
              <i class="el-icon-circle-close" v-else></i>
              {{ customerData.user && customerData.user.active ? '正常' : '禁用' }}
            </el-tag>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-edit" @click="editCustomer">编辑</el-button>
          <el-button icon="el-icon-back" @click="onBack">返回</el-button>
        </div>
      </div>
    </div>

    <!-- 详细信息卡片 -->
    <el-row :gutter="20">
      <!-- 基本信息 -->
      <el-col :span="12">
        <div class="info-card">
          <div class="card-header">
            <i class="el-icon-user"></i>
            <h3>基本信息</h3>
          </div>
          <div class="card-content">
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-postcard"></i>
                <span>客户ID</span>
              </div>
              <div class="info-value">{{ customerData._id || '未设置' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-user"></i>
                <span>用户名</span>
              </div>
              <div class="info-value">{{ customerData.username || '未设置' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-phone"></i>
                <span>手机号</span>
              </div>
              <div class="info-value">{{ customerData.mobile || '未设置' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-s-custom"></i>
                <span>用户角色</span>
              </div>
              <div class="info-value">{{ customerData.role || '未设置' }}</div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 组织信息 -->
      <el-col :span="12">
        <div class="info-card">
          <div class="card-header">
            <i class="el-icon-office-building"></i>
            <h3>组织信息</h3>
          </div>
          <div class="card-content">
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-office-building"></i>
                <span>业主单位</span>
              </div>
              <div class="info-value">{{ customerData.organization || '未设置' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-postcard"></i>
                <span>用户ID</span>
              </div>
              <div class="info-value">{{ customerData.userId || '未设置' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-time"></i>
                <span>创建时间</span>
              </div>
              <div class="info-value">{{ formatTime(customerData.createTime) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-refresh"></i>
                <span>更新时间</span>
              </div>
              <div class="info-value">{{ formatTime(customerData.updateTime) }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 扩展信息和操作记录 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 扩展信息 -->
      <el-col :span="12">
        <div class="info-card">
          <div class="card-header">
            <i class="el-icon-info"></i>
            <h3>扩展信息</h3>
          </div>
          <div class="card-content">
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-edit-outline"></i>
                <span>备注信息</span>
              </div>
              <div class="info-value">{{ customerData.remark || '无' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-key"></i>
                <span>权限列表</span>
              </div>
              <div class="info-value">
                <div class="permissions">
                  <el-tag v-for="permission in customerData.permissions" :key="permission" size="small" type="info">
                    {{ permission }}
                  </el-tag>
                  <span v-if="!customerData.permissions || customerData.permissions.length === 0" class="no-permissions">无特殊权限</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 登录统计 -->
      <el-col :span="12">
        <div class="info-card">
          <div class="card-header">
            <i class="el-icon-data-line"></i>
            <h3>登录统计</h3>
          </div>
          <div class="card-content">
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-time"></i>
                <span>最后登录</span>
              </div>
              <div class="info-value">{{ formatTime(customerData.lastLoginTime) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <i class="el-icon-data-analysis"></i>
                <span>登录次数</span>
              </div>
              <div class="info-value">
                <el-tag type="primary" size="medium">{{ customerData.loginCount || 0 }} 次</el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 操作记录 -->
    <div class="info-card" style="margin-top: 20px;">
      <div class="card-header">
        <i class="el-icon-document"></i>
        <h3>操作记录</h3>
      </div>
      <div class="card-content">
        <el-table :data="operationLogs" border style="width: 100%" class="operation-table">
          <el-table-column prop="operation" label="操作类型" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="getOperationType(row.operation)" size="small">
                {{ row.operation }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作人" width="120" align="center" />
          <el-table-column prop="time" label="操作时间" width="180" align="center" />
          <el-table-column prop="description" label="操作描述" align="left" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerDetail',
  data() {
    return {
      customerData: {},
      operationLogs: [
        {
          operation: '创建账号',
          operator: '系统管理员',
          time: '2024-01-15 10:30:00',
          description: '创建了新的客户账号'
        },
        {
          operation: '修改信息',
          operator: '系统管理员',
          time: '2024-01-20 14:20:00',
          description: '更新了用户基本信息'
        }
      ]
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      try {
        const dataParam = this.$route.query.data
        if (dataParam) {
          this.customerData = JSON.parse(dataParam)
          console.log('客户详情数据:', this.customerData)
        } else {
          this.$message.error('缺少客户数据')
          this.$router.back()
        }
      } catch (error) {
        console.error('解析客户数据失败:', error)
        this.$message.error('数据格式错误')
        this.$router.back()
      }
    },
    formatTime(timeStr) {
      if (!timeStr) return '未设置'
      const d = new Date(timeStr)
      if (isNaN(d.getTime())) return '时间格式错误'
      
      const Y = d.getFullYear()
      const M = (d.getMonth() + 1).toString().padStart(2, '0')
      const D = d.getDate().toString().padStart(2, '0')
      const h = d.getHours().toString().padStart(2, '0')
      const m = d.getMinutes().toString().padStart(2, '0')
      const s = d.getSeconds().toString().padStart(2, '0')
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    },
    editCustomer() {
      this.$router.push({
        path: '/system/edit-customer-account',
        query: { id: this.customerData._id }
      })
    },
    onBack() {
      this.$router.back()
    },
    getOperationType(operation) {
      const typeMap = {
        '创建账号': 'success',
        '修改信息': 'warning',
        '删除账号': 'danger',
        '登录': 'info',
        '登出': 'info'
      }
      return typeMap[operation] || 'info'
    }
  }
}
</script>

<style scoped>
.customer-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 用户头像卡片 */
.user-profile-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: white;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-avatar i {
  font-size: 40px;
  color: white;
}

.user-info h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: bold;
}

.user-info p {
  margin: 0 0 10px 0;
  font-size: 16px;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 信息卡片 */
.info-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 20px;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
  color: white;
  padding: 20px 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header i {
  font-size: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.card-content {
  padding: 25px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f2f5;
  transition: background-color 0.3s ease;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item:hover {
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 0 -10px;
  padding: 15px 10px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  font-weight: 600;
  color: #606266;
}

.info-label i {
  color: #409eff;
  font-size: 16px;
}

.info-value {
  flex: 1;
  color: #303133;
  font-size: 14px;
  word-break: break-all;
}

/* 权限标签 */
.permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.no-permissions {
  color: #909399;
  font-style: italic;
}

/* 操作记录表格 */
.operation-table {
  border-radius: 8px;
  overflow: hidden;
}

.operation-table .el-table__header {
  background: #f8f9fa;
}

.operation-table .el-table__header th {
  background: #f8f9fa !important;
  color: #606266;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .customer-detail-page {
    padding: 10px;
  }
  
  .profile-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .avatar-section {
    flex-direction: column;
    gap: 15px;
  }
  
  .user-avatar {
    margin-right: 0;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .info-label {
    min-width: auto;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card {
  animation: fadeInUp 0.6s ease-out;
}

.info-card:nth-child(1) { animation-delay: 0.1s; }
.info-card:nth-child(2) { animation-delay: 0.2s; }
.info-card:nth-child(3) { animation-delay: 0.3s; }
.info-card:nth-child(4) { animation-delay: 0.4s; }

/* 按钮样式优化 */
.header-actions .el-button {
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.header-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 标签样式优化 */
.el-tag {
  border-radius: 12px;
  font-weight: 500;
}

/* 面包屑样式 */
.el-breadcrumb {
  font-size: 14px;
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #409eff;
  font-weight: 600;
}
</style>
