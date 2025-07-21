<template>
  <div class="unit-detail-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="breadcrumb-bar">
      <el-breadcrumb-item>业主单位管理</el-breadcrumb-item>
      <el-breadcrumb-item>单位项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>合同详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 返回按钮 -->
    <el-button class="back-btn" icon="el-icon-back" @click="$router.back()">返回</el-button>
    
    <!-- 刷新按钮 -->
    <el-button class="refresh-btn" icon="el-icon-refresh" @click="loadDetail" :loading="loading">刷新</el-button>

    <el-card v-loading="loading">
      <!-- 合同基本信息 -->
      <div class="section-title">合同基本信息</div>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="合同名称">{{ projectDetail.projectName }}</el-descriptions-item>
        <el-descriptions-item label="合同编号">{{ projectDetail.contractNo }}</el-descriptions-item>
        <el-descriptions-item label="合同状态">
          <el-tag :type="getStatusType(projectDetail.status)" size="small">
            {{ projectDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="业主单位">{{ projectDetail.ownerName }}</el-descriptions-item>
        <el-descriptions-item label="委托单位">{{ projectDetail.entrustName }}</el-descriptions-item>
        <el-descriptions-item label="合同金额">{{ projectDetail.contractAmount }}</el-descriptions-item>
        <el-descriptions-item label="合同类型">
          <el-tag :type="projectDetail.contractType === '长期性合同' ? 'success' : 'warning'" size="small">
            {{ projectDetail.contractType }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="付款周期">{{ projectDetail.payCycle }}</el-descriptions-item>
        <el-descriptions-item label="维保建筑类型">{{ projectDetail.warrantyType }}</el-descriptions-item>
        <el-descriptions-item label="维保方式">{{ projectDetail.warrantyMethod }}</el-descriptions-item>
        <el-descriptions-item label="维保面积">{{ projectDetail.warrantyArea }}㎡</el-descriptions-item>
        <el-descriptions-item label="服务开始日期">{{ projectDetail.startDate }}</el-descriptions-item>
        <el-descriptions-item label="服务结束日期">{{ projectDetail.endDate }}</el-descriptions-item>
        <el-descriptions-item label="剩余天数">
          <span style="color: #409eff; font-weight: bold">{{ projectDetail.remainingDays }}天</span>
        </el-descriptions-item>
        <el-descriptions-item label="续签状态">
          <el-tag :type="getRenewStatusType(projectDetail.renewStatus)" size="small">
            {{ projectDetail.renewStatus }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="收款提醒">
          <el-tag :type="projectDetail.autoNotice ? 'success' : 'info'" size="small">
            {{ projectDetail.autoNotice ? '开通' : '关闭' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设计单位">{{ projectDetail.designCompany }}</el-descriptions-item>
        <el-descriptions-item label="调试单位">{{ projectDetail.debugCompany }}</el-descriptions-item>
        <el-descriptions-item label="验收备案">{{ projectDetail.checkCompany }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ projectDetail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ projectDetail.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注说明" :span="3">{{ projectDetail.note }}</el-descriptions-item>
      </el-descriptions>

      <!-- 合同详细信息表格 -->
      <div class="section-title" style="margin-top: 24px;">合同详细信息</div>
      <el-table
        :data="[projectDetail]"
        border
        style="width: 100%; margin-top: 16px"
        :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="projectName" label="合同名称" align="center" />
        <el-table-column prop="contractNo" label="合同编号" align="center" />
        <el-table-column prop="ownerName" label="业主单位" align="center" />
        <el-table-column prop="entrustName" label="委托单位" align="center" />
        <el-table-column prop="contractType" label="合同类型" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.contractType === '长期性合同' ? 'success' : 'warning'" size="small">
              {{ row.contractType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="合同状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contractAmount" label="合同金额" align="center" />
        <el-table-column label="服务期限" align="center">
          <template slot-scope="{ row }">
            {{ row.startDate && row.endDate ? `${row.startDate} 至 ${row.endDate}` : '未设置' }}
          </template>
        </el-table-column>
        <el-table-column label="剩余天数" align="center">
          <template slot-scope="{ row }">
            <span style="color: #409eff; font-weight: bold">{{ row.remainingDays }}天</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="viewContractDetail(row)">合同详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 悬浮设置按钮 -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle title="设置" @click="onSetting" />
    
    <!-- 调试信息（开发环境显示） -->
    <el-card v-if="showDebug" style="margin-top: 20px; background-color: #f5f5f5;">
      <div slot="header">
        <span>调试信息（开发环境）</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="showDebug = false">关闭</el-button>
      </div>
      <pre>{{ JSON.stringify(debugData, null, 2) }}</pre>
    </el-card>
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
        updateTime: '',
        // 新增合同相关字段
        contractType: '',
        contractNo: '',
        payCycle: '',
        warrantyType: '',
        warrantyMethod: '',
        warrantyArea: '',
        autoNotice: false,
        designCompany: '',
        debugCompany: '',
        checkCompany: '',
        note: ''
      },
      loading: false,
      contractId: null,
      showDebug: false,
      debugData: {}
    }
  },
  mounted() {
    this.loadDetail()
    // 检查是否是从新增合同页面返回的
    this.checkIfFromNewContract()
    
    // 添加键盘事件监听（开发环境调试）
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    // 移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeydown)
  },
  // 添加路由参数变化监听
  watch: {
    '$route.query.id': {
      handler(newId, oldId) {
        if (newId && newId !== oldId) {
          console.log('UnitDetail - 路由ID变化，重新加载数据:', newId)
          this.loadDetail()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取状态标签类型
    getStatusType(status) {
      const statusMap = {
        '服务中': 'success',
        '已到期': 'danger',
        '待开始': 'warning',
        '已终止': 'info'
      }
      return statusMap[status] || 'info'
    },
    // 获取续签状态标签类型
    getRenewStatusType(status) {
      const statusMap = {
        '待续签': 'warning',
        '可续签': 'primary',
        '已续签': 'success',
        '未续签': 'info'
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
    // 查看合同详情
    viewContractDetail(row) {
      this.$router.push({
        name: 'ContractDetailView',
        query: { id: this.contractId }
      })
    },
    // 加载详情数据
    async loadDetail() {
      const id = this.$route.query.id
      console.log('UnitDetail - 从路由获取的ID:', id)
      console.log('UnitDetail - 完整的路由查询参数:', this.$route.query)
      
      if (!id) {
        this.$message.error('未传入项目ID')
        setTimeout(() => {
          this.$router.back()
        }, 1000)
        return
      }

      this.contractId = id
      this.loading = true
      
      // 从路由参数中获取传递的数据作为备用
      const routeData = this.$route.query
      
      try {
        console.log('UnitDetail - 开始调用 fetchProjectDetail，ID:', id)
        console.log('UnitDetail - API URL:', `/contracts/${id}`)
        
        // 添加重试机制
        let res
        let retryCount = 0
        const maxRetries = 3
        
        while (retryCount < maxRetries) {
          try {
            res = await fetchProjectDetail(id)
            console.log(`UnitDetail - API响应 (尝试 ${retryCount + 1}):`, res)
            console.log('UnitDetail - API响应数据:', res.data)
            break
          } catch (error) {
            retryCount++
            console.error(`UnitDetail - API调用失败 (尝试 ${retryCount}):`, error)
            if (retryCount >= maxRetries) {
              throw error
            }
            // 等待1秒后重试
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
        
        if (res.success && res.data) {
          const item = res.data
          console.log('UnitDetail - 解析后的数据项:', item)
          console.log('UnitDetail - 项目信息:', item.project)
          console.log('UnitDetail - 合同名称:', item.name)
          console.log('UnitDetail - 合同编号:', item.code)
          console.log('UnitDetail - 业主单位:', item.project?.ownerCompany)
          console.log('UnitDetail - 委托单位:', item.clientCompany)
          console.log('UnitDetail - 合同金额:', item.amount)
          console.log('UnitDetail - 合同类型:', item.contractType)

          // 计算剩余天数
          const remainingDays = this.getRemainingDays(item.endDate)

          // 确保contractId被正确设置，用于传递给下一个页面
          this.contractId = item._id || id
          
          // 简化数据映射，确保正确显示
          this.projectDetail = {
            // 基本信息
            projectName: item.name || '未知项目',
            projectId: item._id || '',
            ownerName: item.project?.ownerCompany || item.project?.companyname || '',
            entrustName: item.clientCompany || '',
            status: item.status || '未知状态',
            
            // 日期信息
            startDate: this.formatDate(item.startDate) || '',
            endDate: this.formatDate(item.endDate) || '',
            serviceDate: item.startDate && item.endDate 
              ? `${this.formatDate(item.startDate)} 至 ${this.formatDate(item.endDate)}` 
              : '',
            remainingDays: remainingDays || 0,
            
            // 金额信息
            contractAmount: item.amount ? `￥${item.amount.toLocaleString()}` : '未设置',
            
            // 合同信息
            contractType: item.contractType || '长期性合同',
            contractNo: item.code || '',
            payCycle: item.payCycle || '',
            warrantyType: item.warrantyType || '',
            warrantyMethod: item.warrantyMethod || '',
            warrantyArea: item.warrantyArea || '',
            autoNotice: item.autoNotice || false,
            designCompany: item.designCompany || '',
            debugCompany: item.debugCompany || '',
            checkCompany: item.checkCompany || '',
            note: item.note || '',
            
            // 其他信息
            renewStatus: item.renewStatus || '未续签',
            createTime: this.formatDate(item.createdAt) || '',
            updateTime: this.formatDate(item.updatedAt) || ''
          }
          
          console.log('UnitDetail - 最终处理后的项目详情:', this.projectDetail)
          
          // 保存调试数据
          this.debugData = {
            originalData: item,
            processedData: this.projectDetail,
            routeData: routeData,
            contractId: this.contractId
          }
          
          // 验证数据是否正确
          console.log('UnitDetail - 数据验证:')
          console.log('- 合同名称:', this.projectDetail.projectName)
          console.log('- 合同编号:', this.projectDetail.contractNo)
          console.log('- 业主单位:', this.projectDetail.ownerName)
          console.log('- 委托单位:', this.projectDetail.entrustName)
          console.log('- 合同金额:', this.projectDetail.contractAmount)
          console.log('- 合同类型:', this.projectDetail.contractType)
          console.log('- 合同状态:', this.projectDetail.status)
          
          console.log('UnitDetail - 加载到的原始数据:', item)
          console.log('UnitDetail - 项目详情:', this.projectDetail)
          console.log('UnitDetail - 合同ID:', this.contractId)
          console.log('UnitDetail - 项目信息:', item.project)
          console.log('UnitDetail - 项目名称:', item.project?.name)
          console.log('UnitDetail - 项目ID:', item.project?._id)
          console.log('UnitDetail - 业主单位:', item.project?.ownerCompany)
        } else {
          console.error('UnitDetail - API返回失败:', res)
          this.$message.error(res.message || '获取详情失败')
          // 如果API获取失败，使用路由传递的数据
          this.projectDetail = {
            // 基本信息
            projectName: routeData.projectName || '数据获取失败',
            projectId: id,
            ownerName: routeData.ownerCompany || '',
            entrustName: routeData.entrustName || '',
            status: routeData.status || '未知',
            
            // 日期信息
            startDate: this.formatDate(routeData.startDate) || '',
            endDate: this.formatDate(routeData.endDate) || '',
            serviceDate: routeData.startDate && routeData.endDate
              ? `${this.formatDate(routeData.startDate)} 至 ${this.formatDate(routeData.endDate)}`
              : '',
            remainingDays: parseInt(routeData.remainingDays) || 0,
            
            // 金额信息
            contractAmount: routeData.contractAmount || '',
            
            // 合同信息
            contractType: routeData.contractType || '',
            contractNo: '',
            payCycle: '',
            warrantyType: '',
            warrantyMethod: '',
            warrantyArea: '',
            autoNotice: false,
            designCompany: '',
            debugCompany: '',
            checkCompany: '',
            note: '',
            
            // 其他信息
            renewStatus: '未知',
            createTime: '',
            updateTime: ''
          }
        }
      } catch (e) {
        console.error('加载详情失败:', e)
        this.$message.error('网络异常或接口出错')
        // 网络错误时，使用路由传递的数据
        this.projectDetail = {
          // 基本信息
          projectName: routeData.projectName || '网络错误',
          projectId: id,
          ownerName: routeData.ownerCompany || '',
          entrustName: routeData.entrustName || '',
          status: routeData.status || '错误',
          
          // 日期信息
          startDate: this.formatDate(routeData.startDate) || '',
          endDate: this.formatDate(routeData.endDate) || '',
          serviceDate: routeData.startDate && routeData.endDate
            ? `${this.formatDate(routeData.startDate)} 至 ${this.formatDate(routeData.endDate)}`
            : '',
          remainingDays: parseInt(routeData.remainingDays) || 0,
          
          // 金额信息
          contractAmount: routeData.contractAmount || '',
          
          // 合同信息
          contractType: routeData.contractType || '',
          contractNo: '',
          payCycle: '',
          warrantyType: '',
          warrantyMethod: '',
          warrantyArea: '',
          autoNotice: false,
          designCompany: '',
          debugCompany: '',
          checkCompany: '',
          note: '',
          
          // 其他信息
          renewStatus: '错误',
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
    // 键盘事件处理
    handleKeydown(event) {
      // Ctrl + D 显示调试信息
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault()
        this.showDebug = !this.showDebug
        console.log('调试模式:', this.showDebug ? '开启' : '关闭')
      }
    },
    // 检查是否是从新增合同页面返回的
    checkIfFromNewContract() {
      const fromNewContract = this.$route.query.fromNewContract
      if (fromNewContract === 'true') {
        this.$message.success('合同创建成功！这是您刚刚创建的合同详情。')
        // 清除URL中的参数，避免刷新页面时重复显示
        this.$router.replace({
          name: 'UnitDetail',
          query: { id: this.$route.query.id }
        })
      }
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
  right: 120px;
  top: 22px;
  z-index: 5;
}

.refresh-btn {
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

/* 描述列表样式优化 */
:deep(.el-descriptions__label) {
  font-weight: bold;
  color: #606266;
}

:deep(.el-descriptions__content) {
  color: #303133;
}
</style>
