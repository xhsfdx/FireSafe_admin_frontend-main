<template>
  <div class="task-detail-page">
    <!-- 顶部步骤条 -->
    <div class="top-section">
      <div class="time">{{ taskInfo.time }}</div>
      <el-steps :active="taskInfo.statusIndex" align-center>
        <el-step title="已派发" />
        <el-step title="已到达" />
        <el-step title="开始处置" />
        <el-step title="处置完成提交审批" />
        <el-step title="完成维保" />
        <el-step title="已评价" />
      </el-steps>
    </div>

    <!-- 维保任务详情（横向多列） -->
    <div class="info-card">
      <div class="card-title">维保任务详情</div>
      <el-row :gutter="16" class="info-row">
        <el-col :span="6"><span class="item-label">项目名称：</span>{{ taskInfo.projectName }}</el-col>
        <el-col :span="6"><span class="item-label">计划类型：</span><span class="green">{{ taskInfo.planType
        }}</span></el-col>
        <el-col :span="6"><span class="item-label">任务名称：</span>{{ taskInfo.taskName }}</el-col>
        <el-col :span="6"><span class="item-label">业主单位名称：</span>{{ taskInfo.owner }}</el-col>
      </el-row>
      <el-row :gutter="16" class="info-row">
        <el-col :span="6"><span class="item-label">任务状态：</span>{{ taskInfo.status }}</el-col>
        <el-col :span="6"><span class="item-label">现场维护人员：</span>{{ taskInfo.worker }}</el-col>
        <el-col :span="6"><span class="item-label">项目负责人：</span>{{ taskInfo.principal }}</el-col>
        <el-col :span="6"><span class="item-label">维保方式：</span><span class="blue">{{ taskInfo.method }}</span></el-col>
      </el-row>
      <el-row :gutter="16" class="info-row">
        <el-col :span="6">
          <span class="item-label">服务评分：</span>
          <el-rate v-model="taskInfo.score" :disabled="true" />
        </el-col>
        <el-col :span="6"><span class="item-label">评价描述：</span>{{ taskInfo.comment || '暂无' }}</el-col>
        <el-col :span="6">
          <span class="item-label">故障列表：</span>
          <el-link type="primary" @click="toFaultDetail">详情 <i class="el-icon-arrow-right" /></el-link>
        </el-col>
        <el-col :span="6"><span class="item-label">维护保养情况：</span>{{ taskInfo.maintenance || '暂无' }}</el-col>
      </el-row>
      <!-- 统计卡片 -->
      <div class="card-data-bar">
        <div class="stat-card">
          <i class="el-icon-pie-chart blue" />
          <div class="stat-num">{{ taskInfo.total }}</div>
          <div class="stat-label">检测总数</div>
        </div>
        <div class="stat-card">
          <i class="el-icon-view gray" />
          <div class="stat-num">{{ taskInfo.unchecked }}</div>
          <div class="stat-label">未检数</div>
        </div>
        <div class="stat-card">
          <i class="el-icon-check green" />
          <div class="stat-num">{{ taskInfo.checked }}</div>
          <div class="stat-label">已检数</div>
        </div>
        <div class="stat-card">
          <i class="el-icon-s-tools orange" />
          <div class="stat-num">{{ taskInfo.faults }}</div>
          <div class="stat-label">故障记录</div>
        </div>
        <div class="stat-card">
          <i class="el-icon-refresh purple" />
          <div class="stat-num">{{ taskInfo.replace }}</div>
          <div class="stat-label">更换设备</div>
        </div>
      </div>
      <!-- 悬浮设置按钮 -->
      <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
    </div>

    <!-- 检测详情块 -->
    <div class="info-card detail-block">
      <div class="card-title">检测详情</div>
      <el-row :gutter="0">
        <el-col :span="7">
          <el-tree
            :data="treeData"
            node-key="id"
            highlight-current
            :default-expanded-keys="[1]"
            style="background: #f7faff; border-radius: 4px; padding: 8px;"
            @current-change="onTreeSelect"
          >
            <span slot-scope="{ node, data }">
              <i v-if="data.icon" :class="data.icon" /> {{ data.label }}
              <el-link v-if="data.detail" type="primary" style="margin-left: 10px" @click.stop="showFieldDetail(data)">
                现场详情 <i class="el-icon-arrow-right" />
              </el-link>
            </span>
          </el-tree>
        </el-col>
        <el-col :span="17">
          <el-table
            :data="tableData"
            border
            style="width:100%;"
            :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
          >
            <el-table-column prop="content" label="检测内容" />
            <el-table-column prop="result" label="检测结果" />
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskDetailPage',
  data() {
    return {
      // 默认 mock 数据
      taskInfo: {
        time: '2025-06-01 01:10:00',
        statusIndex: 0,
        projectName: 'ue',
        planType: '月',
        taskName: '2025年6月任务',
        owner: '小学',
        status: '待处理',
        score: 0,
        worker: '黎建军',
        principal: '王蕾',
        method: '系统维保',
        maintenance: '暂无',
        comment: '暂无',
        total: 1,
        unchecked: 1,
        checked: 0,
        faults: 0,
        replace: 0
      },
      // 左树数据
      treeData: [
        {
          id: 1,
          label: '消防供配电设施',
          icon: 'el-icon-folder-opened',
          children: [
            { id: 11, label: '消防配电柜', detail: true },
            { id: 12, label: '自备发电机组' }
          ]
        }
      ],
      // 默认右表内容（可以做成随树节点变化而变化）
      tableData: [
        { content: '消防电源主电源、备用电源工作状态', result: '未检测' },
        { content: '消防设备末端配电切换装置工作状态', result: '未检测' },
        { content: '试验主、备电切换功能', result: '未检测' }
      ]
    }
  },
  created() {
    const taskId = this.$route.params.id
    this.mockLoad(taskId)
  },
  methods: {
    mockLoad(taskId) {
      if (taskId === '1909761xxxx') {
        this.taskInfo = {
          time: '2025-04-15 11:30:00',
          statusIndex: 5,
          projectName: '高坪汽...',
          planType: '月',
          taskName: '2025年4月任务',
          owner: '小学',
          status: '已完成',
          score: 5,
          worker: '黎建军',
          principal: '王蕾',
          method: '系统维保',
          maintenance: '设备已全部维护',
          comment: '服务到位，态度好',
          total: 1,
          unchecked: 0,
          checked: 1,
          faults: 0,
          replace: 0
        }
      }
      // 你可以根据不同id设置不同tableData/treeData
    },
    showFieldDetail(data) {
      this.$message.info('展示“现场详情”弹窗')
    },
    onTreeSelect(node) {
      // 可联动不同节点加载不同检测内容
      if (node && node.label === '自备发电机组') {
        this.tableData = [
          { content: '发电机启动装置外观及工作状态', result: '未检测' },
          { content: '试验发电机自动、手动启动功能', result: '未检测' }
        ]
      } else if (node && node.label === '消防配电柜') {
        this.tableData = [
          { content: '消防电源主电源、备用电源工作状态', result: '未检测' },
          { content: '消防设备末端配电切换装置工作状态', result: '未检测' },
          { content: '试验主、备电切换功能', result: '未检测' }
        ]
      }
    },
    onSetting() {
      this.$message.info('设置')
    },
    toFaultDetail() {
      // 假设你要带任务ID参数，也可以携带其它参数
      this.$router.push({
        name: 'FaultListDetail',
        query: { taskId: this.taskInfo.taskId }
      })
    }
  }
}
</script>

<style scoped>
.task-detail-page {
  min-height: 100vh;
  background: #fff;
  padding: 0 0 32px 0;
  position: relative;
}

.top-section {
  margin: 32px 0 32px 0;
}

.time {
  font-size: 16px;
  margin-bottom: 18px;
  color: #333;
}

.el-steps {
  margin-bottom: 24px;
}

.info-card {
  background: #f5faff;
  border-radius: 8px;
  margin: 24px 0;
  padding: 26px 32px 34px 32px;
  box-shadow: 0 2px 12px #87b7fd10;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 18px;
}

.info-row {
  margin-bottom: 8px;
  font-size: 16px;
}

.item-label {
  color: #888;
  font-weight: 600;
  margin-right: 6px;
}

.info-row .green {
  color: #39c271;
}

.info-row .blue {
  color: #6b45f5;
}

.card-data-bar {
  display: flex;
  align-items: flex-end;
  gap: 36px;
  margin: 28px 0 0 0;
  font-size: 17px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 98px;
  padding: 6px 0;
}

.stat-num {
  font-size: 28px;
  font-weight: bold;
  margin-top: 2px;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-card .el-icon-pie-chart {
  color: #56b6fd;
  font-size: 38px;
}

.stat-card .el-icon-view {
  color: #8d9aad;
  font-size: 38px;
}

.stat-card .el-icon-check {
  color: #39c271;
  font-size: 38px;
}

.stat-card .el-icon-s-tools {
  color: #ff4d1a;
  font-size: 38px;
}

.stat-card .el-icon-refresh {
  color: #885efb;
  font-size: 38px;
}

.setting-btn {
  position: absolute;
  right: 24px;
  top: 24px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}

.detail-block {
  margin-top: 22px;
}
</style>
