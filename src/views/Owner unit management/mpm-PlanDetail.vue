<template>
  <div class="plan-detail-root">
    <!-- 头部详情 -->
    <div class="detail-header">
      <div class="plan-title">计划详情
        <span class="plan-tip">提示：本计划制定后，系统会自动生成<span class="emph">{{ plan.startTime }}</span> - <span class="emph">{{ plan.endTime }}</span>中的（月计划）的所有任务。</span>
      </div>
      <el-row :gutter="30" class="plan-info-row">
        <el-col :span="6"><div><span>项目名称：</span>{{ plan.projectName }}</div></el-col>
        <el-col :span="6"><div><span>业主单位名称：</span>{{ plan.ownerName }}</div></el-col>
        <el-col :span="6"><div><span>计划类型：</span><span class="plan-type">{{ plan.planType }}</span></div></el-col>
        <el-col :span="6"><div><span>计划状态：</span><span class="plan-status">{{ plan.status }}</span></div></el-col>
      </el-row>
      <el-row :gutter="30" class="plan-info-row">
        <el-col :span="6"><div><span>项目负责人：</span>{{ plan.manager }}</div></el-col>
        <el-col :span="6"><div><span>现场维保人员：</span>{{ plan.worker }}</div></el-col>
      </el-row>
    </div>
    <!-- 维保内容 -->
    <div class="section-title">维保内容</div>
    <div class="content-area">
      <el-row>
        <el-col :span="6">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="平台标准系统" name="platform">
              <el-tree
                :data="systemTree"
                node-key="id"
                :props="{ label: 'label', children: 'children' }"
                show-checkbox
                default-expand-all
              />
            </el-tab-pane>
            <el-tab-pane label="自建标准系统" name="custom" />
          </el-tabs>
        </el-col>
        <el-col :span="18">
          <el-table :data="maintItems" style="width:100%;" border>
            <el-table-column prop="index" label="序号" width="60" />
            <el-table-column prop="system" label="消防系统/设施" />
            <el-table-column prop="item" label="维保项目" />
            <el-table-column prop="test" label="检测内容" />
            <el-table-column prop="period" label="维保周期" />
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PlanDetail',
  data() {
    return {
      plan: {
        projectName: 'ue',
        ownerName: '小学',
        manager: '王蕾',
        worker: '黎建军',
        planType: '月',
        status: '进行中',
        startTime: '2025-04-08 00:00:00',
        endTime: '2026-05-01 23:59:59'
      },
      activeTab: 'platform',
      // 示例数据
      systemTree: [
        {
          id: 1, label: '消防供配电设施', children: [
            { id: 11, label: '消防电源监控', children: [] }
          ]
        },
        { id: 2, label: '火灾自动报警系统', children: [] }
      ],
      maintItems: [
        { index: 1, system: '消防供配电设施', item: '消防配电柜', test: '消防电源', period: '月检' },
        { index: 2, system: '消防供配电设施', item: '消防配电柜', test: '消防设备', period: '月检' },
        { index: 3, system: '消防供配电设施', item: '消防配电柜', test: '试验主...', period: '月检' },
        { index: 4, system: '消防供配电设施', item: '自备发电机组', test: '发电机...', period: '月检' }
      ]
    }
  }
}
</script>
<style scoped>
.plan-detail-root { padding: 20px; }
.detail-header { background: #eaf3fd; padding: 20px; border-radius: 6px; margin-bottom: 18px; }
.plan-title { font-size: 20px; font-weight: bold; color: #111; margin-bottom: 6px; }
.plan-tip { font-size: 13px; color: #ea4335; font-weight: normal; margin-left: 20px; }
.plan-info-row { margin-top: 12px; }
.section-title { font-size: 18px; font-weight: bold; color: #183f8c; margin: 18px 0 12px 0; }
.content-area { background: #fff; border-radius: 6px; padding: 14px; }
.plan-type { color: #00bb00; font-weight: bold; }
.plan-status { color: #296cfc; font-weight: bold; }
.emph { color: #ea4335; }
</style>
