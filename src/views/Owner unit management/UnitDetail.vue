<template>
  <div class="unit-detail-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="breadcrumb-bar">
      <el-breadcrumb-item>业主单位管理</el-breadcrumb-item>
      <el-breadcrumb-item>单位项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 返回按钮 -->
    <el-button class="back-btn" icon="el-icon-back" @click="goBack">返回</el-button>

    <el-card v-loading="loading">
      <!-- 项目基本信息 -->
      <div class="section-title">项目基本信息</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">项目名称：</span>
          <span class="info-value">{{ projectDetail.projectName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">项目ID：</span>
          <span class="info-value">{{ projectDetail.projectId }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">合同状态：</span>
          <el-tag :type="getStatusType(projectDetail.status)" size="small">
            {{ projectDetail.status }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="info-label">业主单位：</span>
          <span class="info-value">{{ projectDetail.ownerName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">委托单位：</span>
          <span class="info-value">{{ projectDetail.entrustName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">合同金额：</span>
          <span class="info-value">{{ projectDetail.contractAmount }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">服务开始日期：</span>
          <span class="info-value">{{ projectDetail.startDate }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">服务结束日期：</span>
          <span class="info-value">{{ projectDetail.endDate }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">剩余天数：</span>
          <span class="info-value" style="color: #409eff; font-weight: bold">{{ projectDetail.remainingDays }}天</span>
        </div>
        <div class="info-item">
          <span class="info-label">续签状态：</span>
          <el-tag :type="getRenewStatusType(projectDetail.renewStatus)" size="small">
            {{ projectDetail.renewStatus }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="info-label">创建时间：</span>
          <span class="info-value">{{ projectDetail.createTime }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">更新时间：</span>
          <span class="info-value">{{ projectDetail.updateTime }}</span>
        </div>
      </div>

      <!-- 项目详细信息表格 -->
      <div class="section-title" style="margin-top: 24px;">详细信息</div>
      <el-table
        :data="[projectDetail]"
        border
        style="width: 100%; margin-top: 16px"
        :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="projectName" label="项目名称" align="center" />
        <el-table-column prop="projectId" label="项目ID" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="ownerName" label="业主单位名称" align="center" />
        <el-table-column prop="entrustName" label="委托单位" align="center" />
        <el-table-column prop="status" label="当前服务状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serviceDate" label="合同服务日期" align="center" />
        <el-table-column prop="remainingDays" label="剩余天数" align="center">
          <template slot-scope="{ row }">
            <span style="color: #409eff; font-weight: bold">{{ row.remainingDays }}天</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="viewMoreDetail(row)">更多详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 悬浮设置按钮 -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle title="设置" @click="onSetting" />
  </div>
</template>

<script>
import { fetchProjectDetail } from '@/api/contract'

export default {
  name: 'UnitDetail',
  data() {
    return {
      projectDetail: {
        projectName: '',
        projectId: '',
        ownerName: '',
        entrustName: '',
        status: '',
        serviceDate: '',
        contractAmount: '',
        startDate: '',
        endDate: '',
        remainingDays: 0,
        renewStatus: '',
        createTime: '',
        updateTime: ''
      },
      loading: false,
      contractId: null
    }
  },
  mounted() {
    console.log('🚀 UnitDetail组件已挂载，开始加载详情')
    this.loadDetail()
  },
  // 添加路由变化监听，确保每次路由变化都重新加载数据
  watch: {
    '$route'(to, from) {
      console.log('🔄 路由变化 detected:', { 
        to: to.query, 
        from: from.query,
        toPath: to.path,
        fromPath: from.path
      })
      
      // 如果是从项目详情页面离开（返回），不触发数据加载
      if (from.path === '/owner/UnitDetail' && to.path === '/owner/project') {
        console.log('🔄 检测到返回操作，不重新加载数据')
        return
      }
      
      // 如果是从续签页面返回，也不触发数据加载
      if (from.path === '/owner/renewal' && to.path === '/owner/UnitDetail') {
        console.log('🔄 检测到从续签页面返回，不重新加载数据')
        return
      }
      
      // 检查是否有参数变化，或者是从其他页面跳转过来的
      const hasIdChange = to.query.id !== from.query.id
      const hasContractIdChange = to.query.contractId !== from.query.contractId
      const hasOwnerNameChange = to.query.ownerName !== from.query.ownerName
      const isNewNavigation = !from.query.id && to.query.id
      
      if (hasIdChange || hasContractIdChange || hasOwnerNameChange || isNewNavigation) {
        console.log('🔄 检测到参数变化，重新加载数据')
        console.log('🔄 变化详情:', {
          hasIdChange,
          hasContractIdChange, 
          hasOwnerNameChange,
          isNewNavigation
        })
        this.loadDetail()
      }
    }
  },
  methods: {
    // 获取状态标签类型
    getStatusType(status) {
      const statusMap = {
        '服务中': 'success',
        '已到期': 'danger',
        '待开始': 'warning',
        '已终止': 'info',
        '数据获取失败': 'danger',
        '网络错误': 'danger',
        '错误': 'danger',
        '项目未找到': 'warning',
        '草稿': 'info',
        '已提交': 'warning',
        '已审核': 'success',
        '已归档': 'primary',
        '已续签': 'success'
      }
      return statusMap[status] || 'info'
    },
    // 获取续签状态标签类型
    getRenewStatusType(status) {
      const statusMap = {
        '待续签': 'warning',
        '可续签': 'primary',
        '已续签': 'success',
        '未续签': 'info',
        '数据获取失败': 'danger',
        '网络错误': 'danger',
        '错误': 'danger',
        '项目未找到': 'warning',
        '未知': 'info'
      }
      return statusMap[status] || 'info'
    },
    // 计算剩余天数
    getRemainingDays(endDate) {
      if (!endDate) return 0
      const end = new Date(endDate)
      const now = new Date()
      const diff = Math.ceil((end - now) / (1000 * 3600 * 24))
      return diff > 0 ? diff : 0
    },
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      return dateString.slice(0, 10)
    },
    // 查看更多详情
    viewMoreDetail(row) {
      this.$router.push({
        name: 'ContractDetailView',
        query: { id: this.contractId }
      })
    },
    // 加载详情数据
    async loadDetail() {
      // 先清空之前的数据，避免缓存问题
      this.projectDetail = {
        projectName: '',
        projectId: '',
        ownerName: '',
        entrustName: '',
        status: '',
        serviceDate: '',
        contractAmount: '',
        startDate: '',
        endDate: '',
        remainingDays: 0,
        renewStatus: '',
        createTime: '',
        updateTime: ''
      }
      
      const id = this.$route.query.id
      const contractId = this.$route.query.contractId
      const ownerName = this.$route.query.ownerName
      const entrustName = this.$route.query.entrustName
      
      console.log('🚀 UnitDetail页面接收到的参数:', this.$route.query)
      console.log('使用的项目ID:', id)
      console.log('使用的合同ID:', contractId)
      console.log('业主单位名称:', ownerName)
      console.log('委托单位名称:', entrustName)
      console.log('🔄 开始加载详情数据，时间戳:', new Date().toISOString())
      
      if (!id && !contractId) {
        console.log('❌ 未传入项目ID或合同ID，当前路由参数:', this.$route.query)
        console.log('❌ 当前路由路径:', this.$route.path)
        console.log('❌ 当前路由名称:', this.$route.name)
        
        // 检查是否是从其他页面返回导致的空参数，如果是则直接返回项目列表页面
        if (this.$route.path === '/owner/UnitDetail') {
          console.log('🔄 检测到无效参数，直接返回项目列表页面')
          this.$router.push({ name: 'UnitProject' })
          return
        }
        
        // 只有在明确需要显示错误时才显示错误消息
        if (this.$route.query && Object.keys(this.$route.query).length > 0) {
          this.$message.error('未传入项目ID或合同ID')
          setTimeout(() => {
            this.$router.push({ name: 'UnitProject' })
          }, 1000)
        } else {
          // 如果完全没有参数，直接返回，不显示错误
          console.log('🔄 没有查询参数，直接返回项目列表页面')
          this.$router.push({ name: 'UnitProject' })
        }
        return
      }

      // 优先使用项目ID，如果没有则使用合同ID
      const targetId = id || contractId
      this.contractId = targetId
      this.loading = true
      
      console.log('🎯 最终使用的目标ID:', targetId)
      console.log('🎯 ID类型判断:', id ? '项目ID' : '合同ID')
      
      // 先设置基本信息，确保页面有内容显示
      this.projectDetail = {
        projectName: ownerName || '加载中...',
        projectId: targetId,
        ownerName: ownerName || '',
        entrustName: entrustName || '',
        status: '加载中...',
        serviceDate: '',
        contractAmount: '',
        startDate: '',
        endDate: '',
        remainingDays: 0,
        renewStatus: '加载中...',
        createTime: '',
        updateTime: ''
      }
      
      try {
        console.log('🔄 正在从后端获取项目详情，ID:', targetId)
        console.log('🔄 API调用URL: /api/contracts/' + targetId)
        console.log('🔄 开始调用fetchProjectDetail API...')
        
        const res = await fetchProjectDetail(targetId)
        console.log('📋 后端返回的项目详情数据:', res)
        console.log('📋 响应状态:', res ? 'success' : 'failed')
        console.log('📋 响应数据:', res?.data)
        console.log('📋 响应类型:', typeof res)
        
        // 如果API调用成功但返回404，尝试使用传入的基本信息
        if (res && res.success === false && res.message === '项目未找到') {
          console.log('⚠️ 项目未找到，使用传入的基本信息显示页面')
          this.$message.warning('项目详情未找到，显示基本信息')
          this.projectDetail = {
            projectName: ownerName || '项目未找到',
            projectId: targetId,
            ownerName: ownerName || '',
            entrustName: entrustName || '',
            status: '项目未找到',
            serviceDate: '',
            contractAmount: '',
            startDate: '',
            endDate: '',
            remainingDays: 0,
            renewStatus: '项目未找到',
            createTime: '',
            updateTime: ''
          }
          this.loading = false
          return
        }
        
        if (res.success && res.data) {
          const item = res.data
          console.log('✅ 成功获取项目详情数据:', item)
          console.log('✅ 数据验证 - 项目名称:', item.projectName || item.name)
          console.log('✅ 数据验证 - 业主单位:', item.ownerCompany)
          console.log('✅ 数据验证 - 委托单位:', item.clientCompany)
          console.log('✅ 数据验证 - 合同ID:', item.contractId)
          console.log('✅ 数据验证 - 项目ID:', item.project_id || item._id)

          // 计算剩余天数
          const remainingDays = this.getRemainingDays(item.endDate)

          this.projectDetail = {
            projectName: item.projectName || item.name || ownerName || '未知项目',
            projectId: item.project_id || item._id || item.projectId || targetId,
            ownerName: item.ownerCompany || item.ownerName || ownerName || '',
            entrustName: item.clientCompany || item.entrustName || entrustName || '',
            status: item.status || '未知状态',
            serviceDate: item.startDate && item.endDate
              ? `${this.formatDate(item.startDate)} 至 ${this.formatDate(item.endDate)}`
              : '',
            contractAmount: item.amount ? `￥${item.amount.toLocaleString()}` : '未设置',
            startDate: this.formatDate(item.startDate) || '',
            endDate: this.formatDate(item.endDate) || '',
            remainingDays: remainingDays,
            renewStatus: item.renewStatus || '未续签',
            createTime: this.formatDate(item.createdAt) || '',
            updateTime: this.formatDate(item.updatedAt) || ''
          }
          
          console.log('✅ 项目详情数据处理完成:', this.projectDetail)
          console.log('✅ 最终显示的项目名称:', this.projectDetail.projectName)
          console.log('✅ 最终显示的业主单位:', this.projectDetail.ownerName)
        } else {
          console.log('❌ 后端返回数据格式错误:', res)
          console.log('❌ 尝试使用传入的基本信息显示页面')
          this.$message.warning(res.message || '获取详情失败，显示基本信息')
          // 如果获取失败，显示默认数据，使用传入的参数
          this.projectDetail = {
            projectName: ownerName || '数据获取失败',
            projectId: targetId,
            ownerName: ownerName || '',
            entrustName: entrustName || '',
            status: '数据获取失败',
            serviceDate: '',
            contractAmount: '',
            startDate: '',
            endDate: '',
            remainingDays: 0,
            renewStatus: '未知',
            createTime: '',
            updateTime: ''
          }
        }
      } catch (e) {
        console.error('❌ 加载详情失败:', e)
        console.error('❌ 错误类型:', typeof e)
        console.error('❌ 错误消息:', e.message)
        console.error('❌ 错误响应:', e.response)
        console.error('❌ 错误状态:', e.response?.status)
        console.error('❌ 错误数据:', e.response?.data)
        
        // 根据错误类型显示不同的提示信息
        if (e.response && e.response.status === 404) {
          console.log('❌ 404错误：项目或合同不存在')
          this.$message.error('项目或合同不存在，可能已被删除')
        } else if (e.response && e.response.status === 401) {
          console.log('❌ 401错误：未授权访问')
          this.$message.error('未授权访问，请重新登录')
        } else if (e.response && e.response.status === 500) {
          console.log('❌ 500错误：服务器内部错误')
          this.$message.error('服务器内部错误，请稍后重试')
        } else {
          console.log('❌ 其他错误：网络异常或接口出错')
          this.$message.error('网络异常或接口出错: ' + (e.message || '未知错误'))
        }
        
        // 显示错误状态的数据，但保留传入的基本信息
        this.projectDetail = {
          projectName: ownerName || '数据获取失败',
          projectId: targetId,
          ownerName: ownerName || '',
          entrustName: entrustName || '',
          status: '数据获取失败',
          serviceDate: '',
          contractAmount: '',
          startDate: '',
          endDate: '',
          remainingDays: 0,
          renewStatus: '数据获取失败',
          createTime: '',
          updateTime: ''
        }
      }
      this.loading = false
    },
    // 设置按钮
    onSetting() {
      this.$message.info('设置功能开发中...')
    },
    // 返回按钮
    goBack() {
      console.log('🔄 用户点击返回按钮')
      // 直接跳转到项目列表页面，避免使用 $router.back() 可能导致的页面乱跳
      this.$router.push({
        name: 'UnitProject'
      })
    }
  }
}
</script>

<style scoped>
.unit-detail-page {
  min-height: 100vh;
  background: #fff;
  padding: 24px 24px 0 24px;
  position: relative;
}

.breadcrumb-bar {
  margin-bottom: 18px;
}

.back-btn {
  position: absolute;
  right: 48px;
  top: 22px;
  z-index: 5;
}

.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #409eff;
}

/* 信息网格样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  font-weight: bold;
  color: #606266;
  min-width: 120px;
  margin-right: 8px;
}

.info-value {
  color: #303133;
  flex: 1;
}
</style>
