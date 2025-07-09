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
import { getFaultRecord } from '@/api/faultRecord'

export default {
  data() {
    return {
      faultId: null,
      loading: false,
      steps: [
        { title: '已派发', time: '', person: '' },
        { title: '已接单', time: '', person: '' },
        { title: '已到达', time: '', person: '' },
        { title: '完成', time: '', person: '' },
        { title: '已评价', time: '', person: '' }
      ],
      order: {
        orderNo: '',
        projectName: '',
        reportTime: '',
        source: '',
        finishTime: '',
        reportPerson: '',
        status: '',
        unitName: '',
        method: '系统维保',
        taskName: '',
        rating: 0,
        comment: ''
      },
      fault: {
        system: '',
        project: '',
        desc: '',
        testContent: '',
        photos: []
      },
      handle: {
        time: '',
        person: '',
        photo: '暂无',
        overtime: '',
        desc: '',
        remark: ''
      },
      records: []
    }
  },
  mounted() {
    this.faultId = this.$route.params.id
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      if (!this.faultId) {
        this.$message.error('故障记录ID不存在')
        return
      }

      this.loading = true
      try {
        const res = await getFaultRecord(this.faultId)
        if (res.success) {
          this.formatData(res.data)
        } else {
          this.$message.error(res.message || '获取故障详情失败')
        }
      } catch (e) {
        this.$message.error('网络异常或接口出错')
      }
      this.loading = false
    },
    // 格式化数据
    formatData(data) {
      // 格式化工单信息
      this.order = {
        orderNo: data._id,
        projectName: data.task?.projectName || '',
        reportTime: data.createdAt ? new Date(data.createdAt).toLocaleString('zh-CN') : '',
        source: data.source || '人工上报',
        finishTime: data.resolvedAt ? new Date(data.resolvedAt).toLocaleString('zh-CN') : '',
        reportPerson: data.reporter || '',
        status: data.resolved ? '已完成' : '未完成',
        unitName: data.task?.project?.ownerCompany || '',
        method: '系统维保',
        taskName: data.task?.taskMonth ? `${data.task.taskMonth}任务` : '',
        rating: 0,
        comment: ''
      }

      // 格式化故障信息
      this.fault = {
        system: data.taskItem?.category || '',
        project: data.taskItem?.device || '',
        desc: data.description || '',
        testContent: data.taskItem?.maintainContent || '',
        photos: []
      }

      // 格式化处理信息
      this.handle = {
        time: data.resolvedAt ? new Date(data.resolvedAt).toLocaleString('zh-CN') : '',
        person: data.resolvedBy || '',
        photo: '暂无',
        overtime: this.calculateOvertime(data.createdAt, data.resolvedAt),
        desc: data.resolution || '',
        remark: ''
      }

      // 构建步骤信息
      this.buildSteps(data)
    },
    // 计算逾期时间
    calculateOvertime(createdAt, resolvedAt) {
      if (!createdAt || !resolvedAt) return ''
      const created = new Date(createdAt)
      const resolved = new Date(resolvedAt)
      const diff = resolved - created
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${days}天${hours}小时${minutes}分钟`
    },
    // 构建步骤信息
    buildSteps(data) {
      const steps = [
        { title: '已派发', time: data.createdAt ? new Date(data.createdAt).toLocaleString('zh-CN') : '', person: data.reporter || '' },
        { title: '已接单', time: '', person: '' },
        { title: '已到达', time: '', person: '' },
        { title: '完成', time: data.resolvedAt ? new Date(data.resolvedAt).toLocaleString('zh-CN') : '', person: data.resolvedBy || '' },
        { title: '已评价', time: '', person: '' }
      ]
      this.steps = steps
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
