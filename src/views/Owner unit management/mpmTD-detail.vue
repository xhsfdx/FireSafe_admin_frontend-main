<template>
  <div class="mpm-td-detail-page">
    <!-- 步骤条+基础信息 -->
    <div class="task-steps-section">
      <!-- 步骤条 -->
      <!-- 步骤条 完全还原图片风格 -->
      <template>
        <div class="step-bar-perfect">
          <div v-for="(step, i) in steps" :key="i" class="step-item-perfect">
            <div class="step-time-perfect">{{ step.time }}</div>
            <div class="step-center-block">
              <!-- 圆圈+勾 -->
              <div class="circle-outer" :class="{ active: i <= activeStep }">
                <div class="circle-inner" :class="{ active: i <= activeStep }">
                  <i v-if="i <= activeStep" class="el-icon-check" />
                </div>
              </div>
              <!-- 横线 -->
              <div
                v-if="i < steps.length - 1"
                class="step-line-perfect"
                :class="{ active: i < activeStep }"
              />
            </div>
            <div class="step-label-perfect">{{ step.label }}</div>
          </div>
        </div>
      </template>

      <!-- 任务基础信息 -->
      <div class="task-base-info">
        <div class="section-title">维保任务详情</div>
        <el-row :gutter="16" style="margin-bottom: 8px;">
          <el-col :span="6">
            <div class="row-txt"><span class="label">项目名称：</span>{{ task.projectName }}</div>
            <div class="row-txt">
              <span class="label">任务状态：</span>
              <span :class="task.taskStatus === '已完成' ? 'stat-finish' : 'stat-process'">{{ task.taskStatus }}</span>
            </div>
            <div class="row-txt">
              <span class="label">服务评分：</span>
              <el-rate v-model="task.score" disabled :max="5" show-score style="vertical-align: middle;" />
            </div>
            <div class="row-txt"><span class="label">维护保养情况：</span>{{ task.maintDesc }}</div>
          </el-col>
          <el-col :span="6">
            <div class="row-txt"><span class="label">计划类型：</span><span class="stat-plan">{{ task.planType }}</span></div>
            <div class="row-txt"><span class="label">现场维保人员：</span>{{ task.worker }}</div>
            <div class="row-txt"><span class="label">评价描述：</span>{{ task.comment }}</div>
          </el-col>
          <el-col :span="6">
            <div class="row-txt"><span class="label">任务名称：</span>{{ task.taskName }}</div>
            <div class="row-txt"><span class="label">项目负责人：</span>{{ task.manager }}</div>
            <div class="row-txt">
              <span class="label">故障列表：</span>
              <el-link type="primary" style="padding: 0 4px;" @click="showFaultList">详情<i class="el-icon-arrow-right" /></el-link>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="row-txt"><span class="label">业主单位名称：</span>{{ task.owner }}</div>
            <div class="row-txt"><span class="label">维保方式：</span><span class="stat-maint">{{ task.maintType }}</span></div>
          </el-col>
        </el-row>
        <el-row class="stat-bar" :gutter="24">
          <el-col :span="4">
            <div class="stat-item">
              <img src="https://img.shields.io/badge/检测总数-1bace0?style=for-the-badge&logo=datadog&logoColor=white" style="height:48px;">
              <div class="stat-num">{{ stat.total }}</div>
              <div class="stat-label">检测总数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <img src="https://img.shields.io/badge/未检数-8d9aac?style=for-the-badge&logo=search&logoColor=white" style="height:48px;">
              <div class="stat-num">{{ stat.notChecked }}</div>
              <div class="stat-label">未检数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <img src="https://img.shields.io/badge/已检数-1cb659?style=for-the-badge&logo=vercel&logoColor=white" style="height:48px;">
              <div class="stat-num">{{ stat.checked }}</div>
              <div class="stat-label">已检数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <img src="https://img.shields.io/badge/故障记录-fa7952?style=for-the-badge&logo=wrench&logoColor=white" style="height:48px;">
              <div class="stat-num">{{ stat.fault }}</div>
              <div class="stat-label">故障记录</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <img src="https://img.shields.io/badge/更换设备-845ce3?style=for-the-badge&logo=handshake&logoColor=white" style="height:48px;">
              <div class="stat-num">{{ stat.replace }}</div>
              <div class="stat-label">更换设备</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 检测详情 -->
    <div class="check-detail-section">
      <div class="section-title">检测详情</div>
      <el-row :gutter="0">
        <!-- 左侧树 -->
        <el-col :span="6">
          <el-tree
            :data="treeData"
            node-key="id"
            :default-expand-all="true"
            highlight-current
            :expand-on-click-node="false"
            :render-content="renderTreeNode"
            class="check-tree"
            @current-change="handleTreeChange"
          />
        </el-col>
        <!-- 右侧表格 -->
        <el-col :span="18">
          <el-table :data="tableData" border>
            <el-table-column prop="content" label="检测内容" min-width="340" />
            <el-table-column prop="result" label="检测结果" min-width="110">
              <template slot-scope="{ row }">
                <span v-if="row.result === '异常'" class="result-warn">{{ row.result }}</span>
                <span v-else class="result-ok">{{ row.result }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MpmTDDetail',
  data() {
    return {
      // 步骤条数据
      steps: [
        { label: '已派发', time: '2025-04-09 08:36:08' },
        { label: '已到达', time: '2025-04-16 15:11:43' },
        { label: '开始处置', time: '2025-04-16 15:12:34' },
        { label: '处置完成提交审批', time: '2025-04-20 14:51:12' },
        { label: '完成维保', time: '2025-04-22 01:30:58' },
        { label: '已评价', time: '' }
      ],
      activeStep: 4, // 当前进度
      // 基本信息
      task: {
        projectName: '高坪汽车站消防维保服务',
        planType: '月',
        taskName: '2025年4月任务',
        owner: '高坪汽车站',
        maintType: '系统维保',
        manager: '王蕾',
        worker: '黎建军',
        taskStatus: '已完成',
        score: 0,
        maintDesc: '完成维保',
        comment: '暂无'
      },
      stat: {
        total: 9,
        notChecked: 0,
        checked: 9,
        fault: 1,
        replace: 0
      },
      // 检测树数据
      treeData: [
        {
          id: 1, label: '消防供配电设施', children: [
            { id: 11, label: '消防配电柜', checked: true },
            { id: 12, label: '自备发电机组' },
            { id: 13, label: '储油设施' },
            { id: 14, label: '消防设备应急电源' }
          ]
        },
        { id: 2, label: '火灾自动报警系统', children: [] },
        { id: 3, label: '电气火灾监控系统', children: [] },
        { id: 4, label: '消防给水及消火栓系统', children: [] },
        { id: 5, label: '应急照明', children: [] }
      ],
      // 检测表格数据
      tableData: [
        { content: '消防电源主电源、备用电源工作状态', result: '异常' },
        { content: '消防设备未端配电切换装置工作状态', result: '正常' },
        { content: '试验主、备电切换功能', result: '正常' }
      ]
    }
  },
  methods: {
    renderTreeNode(h, { node, data }) {
      return (
        <span>
          <i class='el-icon-folder' style='margin-right:5px;color:#599af5;font-size:18px;'></i>
          <span>{data.label}</span>
          {data.children && data.children.length === 0 && node.level === 2 ? (
            <el-link
              style='float:right;color:#2574d8;font-size:15px'
              onClick={() => this.$message('现场详情')}
            >现场详情<i class='el-icon-arrow-right'></i></el-link>
          ) : null}
          {data.checked ? (
            <i class='el-icon-check' style='float:right;color:#2b92f9;margin-right:12px;font-size:22px;font-weight:bold'></i>
          ) : null}
        </span>
      )
    },
    handleTreeChange(data) {
      // 简单模拟切换
      if (data.id === 11) {
        this.tableData = [
          { content: '消防电源主电源、备用电源工作状态', result: '异常' },
          { content: '消防设备未端配电切换装置工作状态', result: '正常' },
          { content: '试验主、备电切换功能', result: '正常' }
        ]
      } else {
        this.tableData = []
      }
    },
    showFaultList() {
      this.$message.info('跳转到故障列表')
    }
  }
}
</script>

<style scoped>
.mpm-td-detail-page {
  padding: 0 0 34px 0;
  background: #f8fbfd;
  min-height: 100vh;
}
.task-steps-section {
  background: #fff;
  border-radius: 14px;
  margin: 0 0 18px 0;
  padding: 16px 24px 26px 24px;
  box-shadow: 0 4px 12px #e7f4ff18;
}
.step-bar-custom {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 0;
  margin-top: 12px;
  padding-left: 8px;
  min-width: 1200px;
}
.step-item-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 200px;
}

.circle-wrap {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 7px;
}
.circle-inner {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #eaf1f7;
  background: #f2f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  color: #fff;
  background: #edf4fa;
  transition: 0.3s;
}
.circle-wrap.active .circle-inner {
  background: #2cb4fa;
  border-color: #2cb4fa;
}
.circle-wrap:not(.active) .circle-inner {
  background: #edf4fa;
  border-color: #eaf1f7;
}
.circle-inner i {
  font-size: 42px;
  font-weight: bold;
  color: #fff;
}

.step-line-custom {
  width: 82px;
  height: 7px;
  background: #eaf1f7;
  margin-left: 0;
  margin-right: -2px;
  transition: 0.3s;
}
.step-line-custom.active {
  background: #cce9fa;
}
.step-label-custom {
  font-size: 25px;
  color: #222;
  font-weight: 400;
  margin-top: 0;
  margin-bottom: 2px;
  letter-spacing: 1px;
  min-height: 34px;
}
.step-time-custom {
  font-size: 17px;
  color: #8a8a8a;
  font-weight: 400;
  margin-top: 0;
  min-height: 24px;
}

@media (max-width: 1300px) {
  .step-bar-custom { min-width: 900px;}
  .circle-inner { width: 60px; height: 60px; font-size: 30px;}
  .step-label-custom { font-size: 16px;}
  .step-time-custom { font-size: 13px;}
}

.task-base-info {
  margin-top: 12px;
  background: #f3f7fb;
  border-radius: 8px;
  padding: 18px 22px 2px 22px;
}
.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #113;
  letter-spacing: 1px;
}
.row-txt {
  font-size: 15px;
  margin-bottom: 5px;
  color: #222;
}
.label {
  color: #888;
  min-width: 88px;
  display: inline-block;
}
.stat-finish { color: #1db217; font-weight: 600; }
.stat-process { color: #1976d2; font-weight: 600; }
.stat-plan { color: #18bb4a; font-weight: 600;}
.stat-maint { color: #741cd4; font-weight: 600;}
.stat-bar {
  margin: 14px 0 0 0;
  border-top: 1.5px solid #e6eaf0;
  padding-top: 18px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.stat-num {
  font-size: 29px;
  font-weight: bold;
  margin: 2px 0 2px 0;
  color: #393;
}
.stat-label {
  font-size: 14px;
  color: #757b8a;
  margin-top: 2px;
  font-weight: 500;
}
.check-detail-section {
  background: #fff;
  border-radius: 14px;
  padding: 24px 22px 36px 22px;
  margin-top: 12px;
  box-shadow: 0 4px 12px #e7f4ff18;
}
.check-tree {
  background: #f4f7fb;
  padding: 6px 6px 8px 6px;
  border-radius: 10px;
  min-height: 420px;
}
.result-warn { color: #fe571e; font-weight: 600;}
.result-ok { color: #1888fe; font-weight: 600;}
/* 表格微调 */
::v-deep .el-table thead th {
  background: #f6fafd;
  font-size: 16px;
  color: #223;
  font-weight: bold;
}
::v-deep .el-table td, ::v-deep .el-table th {
  padding: 14px 0 !important;
}
.step-bar-perfect {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  padding: 30px 0 20px 0;
  margin-bottom: 0;
  position: relative;
  border-radius: 12px;
  box-sizing: border-box;
}

.step-item-perfect {
  flex: 1;
  min-width: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-time-perfect {
  font-size: 18px;
  color: #7d8ca3;
  font-weight: 400;
  min-height: 28px;
  margin-bottom: 0;
  margin-top: 0;
  text-align: center;
}

.step-center-block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
}

.circle-outer {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: #eaf4fe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 0 #eaf4fe;
  position: relative;
  z-index: 2;
  transition: 0.2s;
}
.circle-outer.active {
  background: #eaf4fe;
  box-shadow: 0 0 0 12px #eaf4fe;
}

.circle-inner {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #d4eafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  transition: background 0.2s;
}
.circle-inner.active {
  background: #169fff;
}
.circle-inner i {
  font-size: 34px;
  color: #fff;
  font-weight: bold;
}

.step-line-perfect {
  height: 6px;
  background: #eaf4fe;
  margin-left: 0;
  margin-right: 0;
  flex: 1 1 0;
  min-width: 68px;
  position: absolute;
  left: 74px;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  border-radius: 4px;
  transition: background 0.2s;
}
.step-line-perfect.active {
  background: #c1e1fd;
}

.step-label-perfect {
  font-size: 22px;
  color: #222;
  font-weight: 400;
  margin-top: 12px;
  margin-bottom: 0;
  text-align: center;
  min-height: 28px;
  letter-spacing: 1px;
}
</style>
