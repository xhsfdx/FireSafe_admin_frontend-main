<template>
  <div class="plan-detail-root">
    <!-- 页面标题卡片 -->
    <div class="card-block card-title">
      <div class="card-title-txt">维保计划详情</div>
      <div class="plan-tip">提示：本计划制定后，系统会自动生成<span class="emph">{{ plan.startTime }}</span> - <span class="emph">{{ plan.endTime }}</span>中的（月计划）的所有任务。</div>
    </div>

    <!-- 头部详情 -->
    <div class="detail-header">
      <el-row :gutter="30" class="plan-info-row">
        <el-col :span="6"><div><span>项目名称：</span>{{ plan.projectName }}</div></el-col>
        <el-col :span="6"><div><span>业主单位名称：</span>{{ plan.ownerName }}</div></el-col>
        <el-col :span="6"><div><span>计划类型：</span><span class="plan-type">{{ plan.planType }}</span></div></el-col>
        <el-col :span="6"><div><span>计划状态：</span><span class="plan-status">{{ plan.planDefinedStatus }}</span></div></el-col>
      </el-row>
      <el-row :gutter="30" class="plan-info-row">
        <el-col :span="6"><div><span>维保技术负责人：</span><span :class="{ 'configured': plan.maintainPersons.technical, 'not-configured': !plan.maintainPersons.technical }">{{ (plan.maintainPersons.technical && plan.maintainPersons.technical.name) || '未分配' }}</span></div></el-col>
        <el-col :span="6"><div><span>维保项目负责人：</span><span :class="{ 'configured': plan.maintainPersons.leader, 'not-configured': !plan.maintainPersons.leader }">{{ (plan.maintainPersons.leader && plan.maintainPersons.leader.name) || '未分配' }}</span></div></el-col>
        <el-col :span="12">
          <div class="maintainers-row">
            <span>现场维保人员：</span>
            <div v-if="plan.maintainPersons.maintainers && plan.maintainPersons.maintainers.length > 0" class="maintainers-tags">
              <el-tag
                v-for="(m, index) in plan.maintainPersons.maintainers"
                :key="index"
                size="small"
                type="success"
                class="maintainer-tag"
              >
                {{ m.name || m }}
              </el-tag>
            </div>
            <span v-else class="not-configured">未分配</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 维保内容 -->
    <div class="section-title">维保内容</div>
    <div class="content-area">
      <el-row>
        <!-- <el-col :span="6">
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
        </el-col> -->
        <el-col :span="18">
          <el-table :data="maintItems" style="width:100%;" border>
            <el-table-column prop="index" label="序号" width="60" />
            <el-table-column prop="systemCategory" label="消防系统/设施" />
            <el-table-column prop="maintainSlim" label="维保项目" />
            <el-table-column prop="maintainContent" label="检测内容" />
            <el-table-column prop="frequency" label="维保周期" />
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getMaintainbyId } from '@/api/maintainPlan'
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
      // systemTree: [
      //   {
      //     id: 1, label: '消防供配电设施', children: [
      //       { id: 11, label: '消防电源监控', children: [] }
      //     ]
      //   },
      //   { id: 2, label: '火灾自动报警系统', children: [] }
      // ],
      maintItems: [
        { index: 1, system: '消防供配电设施', item: '消防配电柜', test: '消防电源', period: '月检' },
        { index: 2, system: '消防供配电设施', item: '消防配电柜', test: '消防设备', period: '月检' },
        { index: 3, system: '消防供配电设施', item: '消防配电柜', test: '试验主...', period: '月检' },
        { index: 4, system: '消防供配电设施', item: '自备发电机组', test: '发电机...', period: '月检' }
      ]
    }
  },
  mounted() {
    this.onLoad()
  },
  methods: {
    async onLoad() {
      const id = this.$route.query.id
      try {
        const res = await getMaintainbyId(id)
        console.log(res)
        this.plan = res.data
        this.maintItems = res.data.maintenanceItems
      } catch (error) {
        this.$message.error(`出现错误${error.msg}`)
      }
    }
  }
}
</script>
<style scoped>
.plan-detail-root {
  background: #fff;
  padding: 18px 18px 32px 18px;
  border-radius: 8px;
}

.card-block {
  background: #f8f9fb;
  border-radius: 8px;
  padding: 18px 16px 10px 16px;
  margin-bottom: 18px;
  margin-top: 10px;
}

.card-title {
  padding: 12px 18px 12px 18px;
  margin-bottom: 18px;
}

.card-title-txt {
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
}

.detail-header {
  background: #eaf3fd;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 18px;
}

.plan-tip {
  font-size: 13px;
  color: #ea4335;
  font-weight: normal;
}

.plan-info-row {
  margin-top: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #183f8c;
  margin: 18px 0 12px 0;
}

.content-area {
  background: #fff;
  border-radius: 6px;
  padding: 14px;
}

.plan-type {
  color: #00bb00;
  font-weight: bold;
}

.plan-status {
  color: #296cfc;
  font-weight: bold;
}

.emph {
  color: #ea4335;
}

/* 状态样式 */
.configured {
  color: #67c23a;
  font-weight: 500;
}

.not-configured {
  color: #f56c6c;
  font-weight: 500;
}

/* 维保人员标签样式 */
.maintainers-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.maintainers-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.maintainer-tag {
  margin: 2px;
}
</style>
