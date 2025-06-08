<template>
  <div class="order-detail-page">
    <!-- 1. 顶部进度条 -->
    <el-steps :active="4" align-center>
      <el-step v-for="(item, idx) in steps" :key="idx" :title="item.title" :description="item.time + '<br/>' + item.person" />
    </el-steps>

    <!-- 2. 故障工单详情 -->
    <div class="section-card">
      <div class="section-title">故障工单详情</div>
      <el-row>
        <el-col :span="8">工单编号：{{ order.orderNo }}</el-col>
        <el-col :span="8">项目名称：{{ order.projectName }}</el-col>
        <el-col :span="8">上报时间：{{ order.reportTime }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">工单来源：{{ order.source }}</el-col>
        <el-col :span="8">预计完成时间：{{ order.finishTime }}</el-col>
        <el-col :span="8">上报人员：{{ order.reportPerson }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">工单状态：<span style="color:#39c271;">{{ order.status }}</span></el-col>
        <el-col :span="8">业主单位名称：{{ order.unitName }}</el-col>
        <el-col :span="8">维保方式：<span style="color: #6b45f5">{{ order.method }}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="8">任务名称：{{ order.taskName }}</el-col>
        <el-col :span="8">服务评分：
          <el-rate v-model="order.rating" disabled />
        </el-col>
        <el-col :span="8">评价描述：{{ order.comment }}</el-col>
      </el-row>
    </div>

    <!-- 3. 故障信息 -->
    <div class="section-card">
      <div class="section-title">故障信息</div>
      <el-row>
        <el-col :span="8">消防系统设施：{{ fault.system }}</el-col>
        <el-col :span="8">维保项目：{{ fault.project }}</el-col>
        <el-col :span="8">故障照片：
          <span v-for="(img, idx) in fault.photos" :key="idx" style="margin-right: 8px;">
            <el-image :src="img" :preview-src-list="fault.photos" style="width: 50px; height: 50px; border-radius: 4px;" />
          </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">故障描述：{{ fault.desc }}</el-col>
        <el-col :span="8">检测内容：{{ fault.testContent }}</el-col>
      </el-row>
    </div>

    <!-- 4. 故障处置信息 -->
    <div class="section-card">
      <div class="section-title">故障处置信息</div>
      <el-row>
        <el-col :span="8">处理时间：{{ handle.time }}</el-col>
        <el-col :span="8">处理人员：{{ handle.person }}</el-col>
        <el-col :span="8">处理照片：{{ handle.photo || '暂无' }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">逾期时间：{{ handle.overtime }}</el-col>
        <el-col :span="8">备注信息：{{ handle.remark }}</el-col>
        <el-col :span="8">处理描述：{{ handle.desc }}</el-col>
      </el-row>
    </div>

    <!-- 5. 工单分配记录 -->
    <div class="section-card">
      <div class="section-title">工单分配记录</div>
      <el-table :data="records" border>
        <el-table-column prop="assignTime" label="分配时间" />
        <el-table-column prop="assignPerson" label="分配人员" />
        <el-table-column prop="assignedTo" label="被分配人员" />
        <el-table-column prop="acceptPerson" label="接单人员" />
        <el-table-column prop="acceptTime" label="接单时间" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        { title: '已派发', time: '2025-04-20 14:50:38', person: '邱峰' },
        { title: '已接单', time: '2025-04-20 14:52:02', person: '邱峰' },
        { title: '已到达', time: '', person: '邱峰' },
        { title: '完成', time: '2025-04-22 01:19:21', person: '邱峰' },
        { title: '已评价', time: '2025-04-22 01:25:38', person: '王蕾' }
      ],
      order: {
        orderNo: '668939350289752064',
        projectName: '高坪汽车站消防维保服务',
        reportTime: '2025-04-20 14:50:38',
        source: '例行转故障',
        finishTime: '2025-04-21',
        reportPerson: '邱峰 15228141726',
        status: '已完成',
        unitName: '高坪汽车站',
        method: '系统维保',
        taskName: '2025年4月任务',
        rating: 4,
        comment: 'good'
      },
      fault: {
        system: '消防供配电设施',
        project: '消防配电柜',
        desc: '电源损坏',
        testContent: '消防电源主电源、备用电源工作状态',
        photos: [
          require('@/assets/fault1.jpg'), // 换成你自己的图片路径
          require('@/assets/fault2.jpg')
        ]
      },
      handle: {
        time: '2025-04-22 01:19:21',
        person: '邱峰 15228141726',
        photo: '暂无',
        overtime: '00天01小时19分钟',
        desc: '暂无',
        remark: '已线下沟通处理'
      },
      records: [
        { assignTime: '2025-04-20 14:50:38', assignPerson: '邱峰', assignedTo: '邱峰', acceptPerson: '邱峰', acceptTime: '2025-04-20 14:52:02' }
      ]
    }
  }
}
</script>

<style scoped>
.order-detail-page {
  padding: 0 8px 32px 8px;
  background: #fff;
}
.section-card {
  background: #f6faff;
  margin: 24px 0 0 0;
  padding: 18px 24px 12px 24px;
  border-radius: 8px;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}
</style>
