<template>
  <div class="task-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-s-tools"></i>
          </div>
          <div class="title-info">
            <h1 class="page-title">例行维保详情</h1>
            <p class="page-subtitle">查看和管理维保任务的详细信息</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="goBack" icon="el-icon-arrow-left">
            返回列表
          </el-button>
          <el-button 
            v-if="canEdit" 
            type="primary" 
            @click="editTask" 
            icon="el-icon-edit"
          >
            编辑任务
          </el-button>
          <el-button 
            v-if="canAccept" 
            type="success" 
            @click="acceptTask" 
            icon="el-icon-check"
            :loading="actionLoading"
          >
            接单
          </el-button>
          <el-button 
            v-if="canComplete" 
            type="warning" 
            @click="completeTask" 
            icon="el-icon-circle-check"
            :loading="actionLoading"
          >
            完成
          </el-button>
          <el-button 
            v-if="canRate" 
            type="info" 
            @click="rateTask" 
            icon="el-icon-star-on"
            :loading="actionLoading"
          >
            评价
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计信息区域 -->
    <div class="stats-section">
      <div class="stat-card stat-total">
        <div class="stat-icon">
          <i class="el-icon-s-data"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ taskInfo.total || 0 }}</div>
          <div class="stat-label">检测总数</div>
        </div>
      </div>
      <div class="stat-card stat-completed">
        <div class="stat-icon">
          <i class="el-icon-circle-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ taskInfo.checked || 0 }}</div>
          <div class="stat-label">已检数</div>
        </div>
      </div>
      <div class="stat-card stat-pending">
        <div class="stat-icon">
          <i class="el-icon-view"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ taskInfo.unchecked || 0 }}</div>
          <div class="stat-label">未检数</div>
        </div>
      </div>
      <div class="stat-card stat-overdue">
        <div class="stat-icon">
          <i class="el-icon-s-tools"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ taskInfo.faults || 0 }}</div>
          <div class="stat-label">故障记录</div>
        </div>
      </div>
    </div>

    <!-- 进度时间线卡片 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">任务进度</h3>
        <div class="current-date">{{ getCurrentDateTime() }}</div>
      </div>
      <div class="timeline-container">
        <el-steps :active="taskInfo.statusIndex" align-center class="custom-steps">
          <el-step title="已派发" description="2025-09-01 01:10:04" />
          <el-step title="已到达" />
          <el-step title="开始处置" />
          <el-step title="处置完成提交审批" />
          <el-step title="完成维保" />
          <el-step title="已评价" />
        </el-steps>
      </div>
    </div>

    <!-- 维保任务详情卡片 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">维保任务详情</h3>
        <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
      </div>
      
      <div class="task-info-grid">
        <div class="info-item">
          <span class="item-label">项目名称</span>
          <span class="item-value">{{ taskInfo.projectName || '二点' }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">计划类型</span>
          <span class="item-value plan-type">{{ taskInfo.planType || '月' }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">任务名称</span>
          <span class="item-value">{{ taskInfo.taskName || '2025年9月任务' }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">业主单位名称</span>
          <span class="item-value">{{ taskInfo.owner || '2647' }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">任务状态</span>
          <span class="item-value status-badge" :class="getStatusClass(taskInfo.status)">
            {{ taskInfo.status || '待处理' }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">现场维保人员</span>
          <span class="item-value">{{ taskInfo.worker || '陈xx' }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">项目负责人</span>
          <span class="item-value">{{ taskInfo.principal || 'ljn' }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">维保方式</span>
          <span class="item-value method-badge">{{ taskInfo.method || '系统维保' }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">服务评分</span>
          <span class="item-value">
            <el-rate v-model="taskInfo.score" :disabled="true" :max="5" />
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">评价描述</span>
          <span class="item-value">{{ taskInfo.comment || '暂无' }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">故障列表</span>
          <span class="item-value">
            <el-link type="primary" @click="toFaultDetail" class="detail-link">
              详情 <i class="el-icon-arrow-right" />
            </el-link>
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">维护保养情况</span>
          <span class="item-value">{{ taskInfo.maintenance || '暂无' }}</span>
        </div>
      </div>
      <!-- 统计卡片 -->
      <div class="stats-section">
        <div class="stat-card stat-total">
          <div class="stat-icon">
            <i class="el-icon-pie-chart"></i>
          </div>
          <div class="stat-content">
            <div class="stat-num">{{ taskInfo.total || 1 }}</div>
            <div class="stat-label">检测总数</div>
          </div>
        </div>
        <div class="stat-card stat-unchecked">
          <div class="stat-icon">
            <i class="el-icon-view"></i>
          </div>
          <div class="stat-content">
            <div class="stat-num">{{ taskInfo.unchecked || 1 }}</div>
            <div class="stat-label">未检数</div>
          </div>
        </div>
        <div class="stat-card stat-checked">
          <div class="stat-icon">
            <i class="el-icon-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-num">{{ taskInfo.checked || 0 }}</div>
            <div class="stat-label">已检数</div>
          </div>
        </div>
        <div class="stat-card stat-faults">
          <div class="stat-icon">
            <i class="el-icon-s-tools"></i>
          </div>
          <div class="stat-content">
            <div class="stat-num">{{ taskInfo.faults || 0 }}</div>
            <div class="stat-label">故障记录</div>
          </div>
        </div>
        <div class="stat-card stat-replace">
          <div class="stat-icon">
            <i class="el-icon-refresh"></i>
          </div>
          <div class="stat-content">
            <div class="stat-num">{{ taskInfo.replace || 0 }}</div>
            <div class="stat-label">更换设备</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 检测详情块 -->
    <div class="info-card detail-block">
      <div class="card-header">
        <h3 class="card-title">检测详情</h3>
      </div>
      
      <div class="detection-layout">
        <div class="detection-tree">
          <el-tree
            :data="treeData"
            node-key="id"
            highlight-current
            :default-expanded-keys="[1]"
            class="custom-tree"
            @current-change="onTreeSelect"
          >
            <span slot-scope="{ node, data }" class="tree-node">
              <div class="node-content">
                <i v-if="data.icon" :class="data.icon" class="node-icon" />
                <span class="node-label">{{ data.label }}</span>
                <div class="node-actions">
                  <i 
                    v-if="data.hasResult" 
                    class="el-icon-check checkmark-icon"
                    :class="getCheckmarkClass(data.result)"
                  ></i>
                  <el-link 
                    v-if="data.detail" 
                    type="primary" 
                    class="detail-link" 
                    @click.stop="showFieldDetail(data)"
                  >
                    现场详情 <i class="el-icon-arrow-right" />
                  </el-link>
                </div>
              </div>
            </span>
          </el-tree>
        </div>
        
        <div class="detection-table">
          <el-table
            :data="tableData"
            class="custom-table"
            :header-cell-style="{ 
              background: '#f8fafc', 
              color: '#374151',
              fontWeight: '600',
              fontSize: '14px'
            }"
          >
            <el-table-column prop="content" label="检测内容" min-width="300">
              <template slot-scope="{ row }">
                <div class="table-content">{{ row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="检测结果" width="120" align="center">
              <template slot-scope="{ row }">
                <div class="table-result" :class="getResultClass(row.result)">
                  {{ row.result }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getMaintainTask, 
  updateTaskStatus, 
  assignMaintainers,
  updateMaintainTask
} from '@/api/maintainTask'

export default {
  name: 'TaskDetailPage',
  data() {
    return {
      taskId: null,
      loading: false,
      actionLoading: false,
      // 任务信息
      taskInfo: {
        time: '',
        statusIndex: 0,
        projectName: '',
        planType: '',
        taskName: '',
        owner: '',
        status: '',
        score: 0,
        worker: '',
        principal: '',
        method: '系统维保',
        maintenance: '暂无',
        comment: '',
        total: 0,
        unchecked: 0,
        checked: 0,
        faults: 0,
        replace: 0
      },
      // 左树数据
      treeData: [],
      // 默认右表内容
      tableData: [],
      // 任务详情数据
      taskData: null
    }
  },
  
  computed: {
    // 是否可以编辑任务
    canEdit() {
      if (!this.taskInfo.status) return false
      return ['已派发', '已到达'].includes(this.taskInfo.status)
    },
    
    // 是否可以接单
    canAccept() {
      if (!this.taskInfo.status) return false
      return this.taskInfo.status === '已派发'
    },
    
    // 是否可以完成
    canComplete() {
      if (!this.taskInfo.status) return false
      return ['已到达', '处理中'].includes(this.taskInfo.status)
    },
    
    // 是否可以评价
    canRate() {
      if (!this.taskInfo.status) return false
      return this.taskInfo.status === '已完成'
    }
  },
  
  mounted() {
    this.taskId = this.$route.params.id
    this.loadData()
    // 初始化默认检测内容
    this.initDefaultDetectionContent()
  },
  methods: {
    // 初始化默认检测内容
    initDefaultDetectionContent() {
      // 设置默认的检测内容，避免显示"No Data"
      this.tableData = [
        { content: '正在加载检测数据...', result: '加载中' }
      ]
    },
    
    // 加载数据
    async loadData() {
      console.log('TaskDetail loadData called, taskId:', this.taskId)
      if (!this.taskId) {
        this.$message.error('任务ID不存在')
        return
      }

      this.loading = true
      try {
        console.log('Calling getMaintainTask API with ID:', this.taskId)
        const res = await getMaintainTask(this.taskId)
        console.log('API response:', res)
        if (res.success) {
          this.taskData = res.data
          console.log('任务数据详情:', res.data)
          console.log('details数组长度:', res.data.details ? res.data.details.length : 0)
          console.log('第一个detail项:', res.data.details && res.data.details[0])
          this.formatTaskInfo(res.data)
          this.buildTreeData(res.data)
        } else {
          this.$message.error(res.message || '获取任务详情失败')
        }
      } catch (e) {
        console.error('API call failed:', e)
        this.$message.error('网络异常或接口出错: ' + e.message)
      }
      this.loading = false
    },
    // 格式化任务信息
    formatTaskInfo(data) {
      const maintainers = data.maintainPersons?.maintainers || []
      const leader = data.maintainPersons?.leader
      const technical = data.maintainPersons?.technical

      this.taskInfo = {
        time: data.createdAt ? new Date(data.createdAt).toLocaleString('zh-CN') : '',
        statusIndex: this.getStatusIndex(data.status),
        projectName: data.projectName || '锦绣新城消防系统维护保养服务项目',
        planType: data.planType || '月',
        taskName: this.getTaskDisplayName(data),
        owner: data.project?.ownerCompany || '2647',
        status: data.status || '已派发',
        score: data.rating || 0,
        worker: maintainers.length > 0 ? maintainers[0].name : '',
        principal: leader?.name || '',
        method: '系统维保',
        maintenance: data.maintainResult || '暂无',
        comment: data.ratingComment || '',
        total: data.totalCheckCount || 0,
        unchecked: (data.totalCheckCount || 0) - (data.passedCount || 0),
        checked: data.passedCount || 0,
        faults: data.abnormalCount || 0,
        replace: data.replacedCount || 0
      }
    },
    // 获取状态索引
    getStatusIndex(status) {
      const statusMap = {
        '已派发': 0,
        '已到达': 1,
        '处理中': 2,
        '已提交': 3,
        '已完成': 4,
        '已评价': 5
      }
      return statusMap[status] || 0
    },
    // 构建树形数据
    buildTreeData(data) {
      console.log('buildTreeData called with data:', data)
      console.log('data.details:', data.details)
      
      // 清空树形数据
      this.treeData = []
      
      if (data.details && data.details.length > 0) {
        // 检查details是否包含完整数据还是只是ObjectId引用
        const firstDetail = data.details[0]
        
        if (typeof firstDetail === 'object' && firstDetail._id) {
          // details包含完整数据
          const categories = {}
          data.details.forEach(item => {
            // 只处理有检测结果的项（正常或异常）
            if (item.result && item.result !== '未检' && item.result !== '未检测') {
              if (!categories[item.category]) {
                categories[item.category] = {
                  id: item.category,
                  label: item.category,
                  icon: 'el-icon-folder-opened',
                  children: []
                }
              }
              categories[item.category].children.push({
                id: item._id,
                label: item.device,
                detail: true,
                item: item,
                hasResult: true,
                result: item.result
              })
            }
          })
          
          // 只添加有子项目的分类
          this.treeData = Object.values(categories).filter(category => 
            category.children && category.children.length > 0
          )
        } else {
          // details只是ObjectId引用，需要根据统计信息判断
          
          // 只有当有实际检测结果时才显示数据
          if (data.passedCount > 0 || data.abnormalCount > 0) {
            this.treeData = [{
              id: 'placeholder',
              label: '检测项目',
              icon: 'el-icon-folder-opened',
              children: [{
                id: 'loading',
                label: '数据加载中...',
                detail: true,
                hasResult: false,
                result: '未检'
              }]
            }]
            console.log('有检测结果但数据未完全加载，显示占位符')
          } else {
            this.treeData = []
            console.log('没有检测结果，清空树形数据')
          }
        }
        
        console.log('构建的树形数据:', this.treeData)
      }
      
      // 如果没有数据，显示提示信息
      if (this.treeData.length === 0) {
        this.tableData = [
          { content: '暂无检测数据', result: '无数据' }
        ]
        return
      }
      
      // 设置默认选中第一个项目
      this.$nextTick(() => {
        if (this.treeData.length > 0 && this.treeData[0].children && this.treeData[0].children.length > 0) {
          this.onTreeSelect(this.treeData[0].children[0])
        } else if (this.treeData.length > 0) {
          // 如果没有子节点，直接选中第一个父节点
          this.onTreeSelect(this.treeData[0])
        }
      })
    },
    showFieldDetail(data) {
      this.$message.info('展示“现场详情”弹窗')
    },
    onTreeSelect(node) {
      console.log('onTreeSelect called with node:', node)
      
      if (node && node.item) {
        // 根据选中的任务项显示检测内容
        this.tableData = [
          { 
            content: node.item.maintainContent || '检测内容', 
            result: node.item.result || '未检' 
          }
        ]
      } else if (node) {
        // 如果是分类节点，显示该分类下的所有检测项
        if (node.children && node.children.length > 0) {
          this.tableData = node.children.map(child => ({
            content: child.item ? child.item.maintainContent : child.label,
            result: child.result || '未检'
          }))
        } else {
          // 根据选中的节点提供相应的检测内容
          const detectionContents = this.getDetectionContents(node)
          this.tableData = detectionContents
        }
      } else {
        // 如果没有选中任何节点，显示默认内容
        this.tableData = [
          { content: '请选择左侧检测项目查看详情', result: '未检' }
        ]
      }
    },
    
    // 获取检测内容
    getDetectionContents(node) {
      if (!node) {
        return [
          { content: '消防电源主电源、备用电源工作状态', result: '未检' },
          { content: '消防设备末端配电切换装置工作状态', result: '未检' },
          { content: '试验主、备电切换功能', result: '未检' }
        ]
      }
      
      const label = node.label || ''
      
      // 根据设备类型返回相应的检测内容
      if (label.includes('消防电话主机')) {
        return [
          { content: '检查主机外观是否完好', result: '正常' },
          { content: '测试通话功能是否正常', result: '正常' },
          { content: '检查指示灯状态', result: '正常' },
          { content: '测试录音功能', result: '未检测' }
        ]
      } else if (label.includes('消防电话分机')) {
        return [
          { content: '检查分机外观是否完好', result: '正常' },
          { content: '测试与主机通话功能', result: '正常' },
          { content: '检查挂机状态', result: '正常' }
        ]
      } else if (label.includes('防火门')) {
        return [
          { content: '检查门扇外观是否完好', result: '正常' },
          { content: '测试门扇开闭功能', result: '正常' },
          { content: '检查门锁装置', result: '正常' },
          { content: '测试自动关闭功能', result: '异常' }
        ]
      } else if (label.includes('防火卷帘')) {
        return [
          { content: '检查卷帘外观是否完好', result: '正常' },
          { content: '测试卷帘升降功能', result: '正常' },
          { content: '检查控制系统', result: '正常' }
        ]
      } else if (label.includes('广播主机')) {
        return [
          { content: '检查主机外观是否完好', result: '正常' },
          { content: '测试广播功能', result: '正常' },
          { content: '检查功放输出', result: '正常' },
          { content: '测试应急广播切换', result: '未检测' }
        ]
      } else if (label.includes('扬声器')) {
        return [
          { content: '检查扬声器外观是否完好', result: '正常' },
          { content: '测试音质输出', result: '正常' },
          { content: '检查安装牢固度', result: '正常' }
        ]
      } else if (label.includes('疏散指示灯')) {
        return [
          { content: '检查指示灯外观是否完好', result: '正常' },
          { content: '测试指示功能', result: '正常' },
          { content: '检查电池电量', result: '正常' },
          { content: '测试应急切换功能', result: '未检测' }
        ]
      } else if (label.includes('消防配电柜')) {
        return [
          { content: '检查配电柜外观是否完好', result: '正常' },
          { content: '检查主电源工作状态', result: '正常' },
          { content: '检查备用电源工作状态', result: '正常' },
          { content: '试验主、备电切换功能', result: '正常' }
        ]
      } else if (label.includes('自备发电机组')) {
        return [
          { content: '检查发电机组外观是否完好', result: '正常' },
          { content: '检查燃油储量', result: '正常' },
          { content: '测试启动功能', result: '正常' },
          { content: '测试自动切换功能', result: '未检测' }
        ]
      } else if (label.includes('监控主机')) {
        return [
          { content: '检查主机外观是否完好', result: '正常' },
          { content: '测试监控功能', result: '正常' },
          { content: '检查报警功能', result: '正常' },
          { content: '测试数据传输', result: '正常' }
        ]
      } else if (label.includes('消防水泵')) {
        return [
          { content: '检查水泵外观是否完好', result: '正常' },
          { content: '测试水泵启动功能', result: '正常' },
          { content: '检查压力表读数', result: '正常' },
          { content: '测试自动启动功能', result: '未检测' }
        ]
      } else if (label.includes('消火栓箱')) {
        return [
          { content: '检查消火栓箱外观是否完好', result: '正常' },
          { content: '检查水带是否完好', result: '正常' },
          { content: '检查水枪是否完好', result: '正常' },
          { content: '测试水压是否正常', result: '正常' }
        ]
      } else if (label.includes('喷淋泵')) {
        return [
          { content: '检查喷淋泵外观是否完好', result: '正常' },
          { content: '测试喷淋泵启动功能', result: '正常' },
          { content: '检查压力表读数', result: '正常' },
          { content: '测试自动启动功能', result: '未检测' }
        ]
      } else if (label.includes('报警控制器')) {
        return [
          { content: '检查控制器外观是否完好', result: '正常' },
          { content: '测试报警功能', result: '正常' },
          { content: '检查显示屏状态', result: '正常' },
          { content: '测试联动功能', result: '未检测' }
        ]
      } else if (label.includes('烟感探测器')) {
        return [
          { content: '检查探测器外观是否完好', result: '正常' },
          { content: '测试探测功能', result: '正常' },
          { content: '检查安装位置', result: '正常' },
          { content: '测试报警功能', result: '正常' }
        ]
      } else if (label.includes('防烟风机')) {
        return [
          { content: '检查风机外观是否完好', result: '正常' },
          { content: '测试风机启动功能', result: '正常' },
          { content: '检查风量是否正常', result: '正常' },
          { content: '测试自动启动功能', result: '未检测' }
        ]
      } else if (label.includes('排烟风机')) {
        return [
          { content: '检查风机外观是否完好', result: '正常' },
          { content: '测试风机启动功能', result: '正常' },
          { content: '检查风量是否正常', result: '正常' },
          { content: '测试自动启动功能', result: '未检测' }
        ]
      } else if (label.includes('应急照明灯')) {
        return [
          { content: '检查照明灯外观是否完好', result: '正常' },
          { content: '测试照明功能', result: '正常' },
          { content: '检查电池电量', result: '正常' },
          { content: '测试应急切换功能', result: '正常' }
        ]
      } else {
        // 默认检测内容
        return [
          { content: '检查设备外观是否完好', result: '正常' },
          { content: '测试基本功能是否正常', result: '正常' },
          { content: '检查安装牢固度', result: '正常' },
          { content: '测试联动功能', result: '未检测' }
        ]
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    
    // 编辑任务
    editTask() {
      this.$message.info('编辑任务功能开发中...')
    },
    
    // 接单操作
    async acceptTask() {
      this.actionLoading = true
      try {
        const res = await updateTaskStatus(this.taskId, { 
          status: '已到达',
          progressStep: '已到达'
        })
        if (res.success) {
          this.$message.success('接单成功')
          this.loadData()
        } else {
          this.$message.error(res.message || '接单失败')
        }
      } catch (error) {
        this.$message.error('接单失败')
      } finally {
        this.actionLoading = false
      }
    },
    
    // 完成任务
    async completeTask() {
      this.actionLoading = true
      try {
        const res = await updateTaskStatus(this.taskId, { 
          status: '已完成',
          progressStep: '已完成'
        })
        if (res.success) {
          this.$message.success('任务已完成')
          this.loadData()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      } catch (error) {
        this.$message.error('操作失败')
      } finally {
        this.actionLoading = false
      }
    },
    
    // 评价任务
    async rateTask() {
      this.$prompt('请为任务评分（1-5分）:', '评价任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputPattern: /^[1-5]$/,
        inputErrorMessage: '请输入1-5之间的数字'
      }).then(async ({ value }) => {
        const comment = await new Promise((resolve) => {
          this.$prompt('请输入评价内容（可选）:', '评价任务', {
            confirmButtonText: '确定',
            cancelButtonText: '跳过',
            inputType: 'textarea'
          }).then(({ value: commentValue }) => resolve(commentValue)).catch(() => resolve(''))
        })
        
        this.actionLoading = true
        try {
          const res = await updateMaintainTask(this.taskId, {
            rating: parseInt(value),
            ratingComment: comment,
            status: '已评价'
          })
          if (res.success) {
            this.$message.success('评价成功')
            this.loadData()
          } else {
            this.$message.error(res.message || '评价失败')
          }
        } catch (error) {
          this.$message.error('评价失败')
        } finally {
          this.actionLoading = false
        }
      }).catch(() => {
        this.$message.info('已取消评价')
      })
    },
    onSetting() {
      this.$message.info('设置')
    },
    toFaultDetail() {
      this.$router.push({
        name: 'FaultListDetail',
        query: { taskId: this.taskId }
      })
    },
    
    // 获取当前日期时间
    getCurrentDateTime() {
      return new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      const statusMap = {
        '已派发': 'status-dispatched',
        '已到达': 'status-arrived',
        '处理中': 'status-processing',
        '已提交': 'status-submitted',
        '已完成': 'status-completed',
        '已评价': 'status-evaluated',
        '待处理': 'status-pending'
      }
      return statusMap[status] || 'status-pending'
    },
    
    // 获取检测结果样式类
    getResultClass(result) {
      if (result === '未检' || result === '未检测') {
        return 'result-undetected'
      } else if (result === '正常') {
        return 'result-normal'
      } else if (result === '异常') {
        return 'result-abnormal'
      }
      return 'result-undetected'
    },
    
    // 获取任务显示名称
    getTaskDisplayName(data) {
      console.log('getTaskDisplayName called with data:', data)
      
      // 强制生成新的任务名称，完全忽略后端返回的taskName
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      
      // 生成中文任务名称
      const taskName = `${year}年${month}月维保任务`
      console.log('Generated task name:', taskName)
      return taskName
    },
    
    // 获取勾选状态样式类
    getCheckmarkClass(result) {
      if (result === '正常') {
        return 'checkmark-normal'
      } else if (result === '异常') {
        return 'checkmark-abnormal'
      } else {
        return 'checkmark-default'
      }
    }
  }
}
</script>

<style scoped>
.task-detail-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 24px;
}

/* 页面头部样式 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 40px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.08)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.6;
  pointer-events: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  gap: 24px;
}

.title-section {
  display: flex;
  align-items: center;
}

.page-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.page-icon i {
  font-size: 28px;
  color: white;
}

.title-info h1 {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.title-info p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions .el-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 16px 20px;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  min-width: 140px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.stat-icon i {
  font-size: 18px;
  color: white;
}

.stat-total .stat-icon {
  background: rgba(59, 130, 246, 0.3);
}

.stat-completed .stat-icon {
  background: rgba(16, 185, 129, 0.3);
}

.stat-pending .stat-icon {
  background: rgba(245, 158, 11, 0.3);
}

.stat-overdue .stat-icon {
  background: rgba(239, 68, 68, 0.3);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 18px;
  font-weight: 700;
  color: white;
  display: block;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.current-date {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.timeline-container {
  padding: 0 20px;
}

.custom-steps {
  margin: 0;
}

.custom-steps .el-step__title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.custom-steps .el-step__description {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* 进度条统一紫色主题 */
.custom-steps .el-step__head.is-process {
  color: white !important;
  border-color: #667eea !important;
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.custom-steps .el-step__head.is-process .el-step__icon {
  color: white !important;
}

.custom-steps .el-step__head.is-finish {
  color: white !important;
  border-color: #667eea !important;
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.custom-steps .el-step__head.is-finish .el-step__icon {
  color: white !important;
}

.custom-steps .el-step__line.is-finish {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.custom-steps .el-step__line-inner {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

/* 未完成的步骤样式 */
.custom-steps .el-step__head {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(102, 126, 234, 0.3);
  color: #9ca3af;
  transition: all 0.3s ease;
}

.custom-steps .el-step__head:hover {
  border-color: rgba(102, 126, 234, 0.6);
  transform: scale(1.05);
}

/* 连接线样式 */
.custom-steps .el-step__line {
  background: rgba(102, 126, 234, 0.2);
  height: 3px;
  border-radius: 2px;
}

/* 步骤标题和描述颜色 */
.custom-steps .el-step__title {
  color: #374151;
  font-weight: 600;
}

.custom-steps .el-step__title.is-process {
  color: #667eea !important;
  font-weight: 700;
}

.custom-steps .el-step__title.is-finish {
  color: #667eea !important;
  font-weight: 700;
}

.custom-steps .el-step__description {
  color: #6b7280;
  font-weight: 500;
}

.custom-steps .el-step__description.is-process {
  color: #667eea !important;
  font-weight: 600;
}

.custom-steps .el-step__description.is-finish {
  color: #667eea !important;
  font-weight: 600;
}

/* 信息卡片 */
.info-card {
  background: white;
  border-radius: 16px;
  margin-bottom: 24px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.5px;
}

.setting-btn {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.setting-btn:hover {
  transform: translateY(-2px) rotate(90deg);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* 任务信息网格 */
.task-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
  background: #f1f5f9;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.item-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.item-value {
  font-size: 15px;
  color: #1f2937;
  font-weight: 600;
}

.plan-type {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background: #f3f4f6;
  color: #6b7280;
}

.status-dispatched {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-arrived {
  background: #e0e7ff;
  color: #3730a3;
}

.status-processing {
  background: #fef3c7;
  color: #92400e;
}

.status-submitted {
  background: #cffafe;
  color: #155e75;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-evaluated {
  background: #dcfce7;
  color: #166534;
}

.method-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.detail-link {
  font-size: 12px;
  font-weight: 600;
}

/* 统计卡片 */
.stats-section {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.stat-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  min-width: 160px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stat-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon i {
  font-size: 22px;
  color: white;
}

.stat-total .stat-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.stat-unchecked .stat-icon {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.stat-checked .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-faults .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-replace .stat-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.stat-content {
  flex: 1;
}

.stat-num {
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 检测详情 */
.detail-block {
  margin-top: 0;
}

.detection-layout {
  display: flex;
  gap: 24px;
}

.detection-tree {
  flex: 0 0 320px;
}

.custom-tree {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tree-node {
  width: 100%;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.node-icon {
  color: #3b82f6;
  font-size: 16px;
}

.node-label {
  flex: 1;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.node-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkmark-icon {
  font-size: 16px;
  font-weight: bold;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.checkmark-normal {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.checkmark-abnormal {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.checkmark-default {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.detail-link {
  font-size: 11px;
  font-weight: 600;
}

.detection-table {
  flex: 1;
}

.custom-table {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: white;
}

.table-content {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  font-weight: 500;
}

.table-result {
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-undetected {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #6b7280;
}

.result-normal {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
}

.result-abnormal {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .detection-layout {
    flex-direction: column;
  }
  
  .detection-tree {
    flex: none;
  }
}

@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    gap: 24px;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .detection-layout {
    flex-direction: column;
  }
  
  .detection-tree {
    flex: none;
  }
}

@media (max-width: 768px) {
  .task-detail-page {
    padding: 16px 20px;
  }
  
  .task-info-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-section {
    flex-direction: column;
  }
  
  .stat-card {
    min-width: auto;
  }
  
  .info-card {
    padding: 20px;
  }
  
  .progress-section {
    padding: 20px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .stat-card {
    min-width: auto;
    padding: 12px 16px;
  }
}
</style>
