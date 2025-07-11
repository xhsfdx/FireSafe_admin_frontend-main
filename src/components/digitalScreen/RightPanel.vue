<template>
  <div class="right-panel">
    <div class="card">
      <h3 class="tech-title">打卡记录</h3>
      <CheckinRecord />
    </div>

    <div class="card">
      <h3 class="tech-title">人员统计</h3>
      <PersonnelStatistics />
    </div>

    <div class="card">
      <h3 class="tech-title">综合排名</h3>
      <ComprehensiveRanking />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import CheckinRecord from '@/components/digitalScreen/CheckinRecord.vue'
import PersonnelStatistics from '@/components/digitalScreen/PersonnelStatistics.vue'
import ComprehensiveRanking from '@/components/digitalScreen/ComprehensiveRanking.vue'

export default {
  name: 'RightPanel',
  components: {
    CheckinRecord,
    PersonnelStatistics,
    ComprehensiveRanking
  },
  mounted() {
    this.drawRoleRing()
  },
  methods: {
    // drawRoleRing() {
    //   const chart = echarts.init(document.getElementById('role-ring'))
    //   chart.setOption({
    //     series: [
    //       {
    //         type: 'pie',
    //         radius: ['60%', '80%'],
    //         label: { show: false },
    //         data: [
    //           { value: 3, name: '现场维保' },
    //           { value: 1, name: '技术经理' },
    //           { value: 1, name: '项目负责人' }
    //         ],
    //         color: ['#00eaff', '#ffc107', '#8e44ad']
    //       }
    //     ]
    //   })
    // }
  }
}
</script>

<style scoped>
.right-panel {
  width: 35%;
  padding-left: 10px;
}
.card {
  background: rgba(0, 20, 40, 0.6);
  color: #fff;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.tech-title {
  font-size: 20px;
  font-weight: 600;
  color: #00f7ff;
  text-align: center;
  text-shadow:
    0 0 10px rgba(0, 247, 255, 0.5), 
    0 0 20px rgba(0, 247, 255, 0.7), 
    0 0 30px rgba(0, 247, 255, 0.9);
  letter-spacing: 2px;
  animation: techGlow 1.5s infinite alternate;
  margin-bottom: 20px;
}
table {
  width: 100%;
  color: #fff;
  border-collapse: collapse;
}
th, td {
  padding: 6px;
  text-align: center;
}
</style>
