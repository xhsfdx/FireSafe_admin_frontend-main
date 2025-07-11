<template>
  <div class="left-panel">
    <div class="card">
      <!-- 業主單位总数区域 -->
      <h3 class="tech-title">业主单位状况</h3>
      <TotalOwer />
    </div>

    <div class="card">
      <h3 class="tech-title">任务统计</h3>
      <BusinessStats />
      <!-- <div id="task-ring" style="height: 180px;"></div> -->
    </div>

    <div class="card">
      <h3 class="tech-title">业务趋势</h3>
      <BusinessTrend />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import BusinessStats from '@/components/digitalScreen/BusinessStats.vue'
import BusinessTrend from '@/components/digitalScreen/BusinessTrend.vue'
import TotalOwer from '@/components/digitalScreen/TotalOwer.vue'

export default {
  name: 'LeftPanel',
  components: {
    BusinessStats,
    BusinessTrend,
    TotalOwer
  },
  mounted() {
    this.drawRing()
    this.drawTrend()
  },
  methods: {
    // drawRing() {
    //   // this.chartRing = echarts.init(document.getElementById('task-ring'))
    //   const chart = echarts.init(document.getElementById('task-ring'))
    //   chart.setOption({
    //     series: [
    //       {
    //         type: 'pie',
    //         radius: ['60%', '80%'],
    //         label: { show: false },
    //         data: [
    //           { value: 2, name: '已完成' },
    //           { value: 3, name: '未完成' }
    //         ],
    //         color: ['#00c0ff', '#ff7f50']
    //       }
    //     ]
    //   })
    // },
    // drawTrend() {
    //   // this.chartTrend = echarts.init(document.getElementById('trend-line'))
    //   const chart = echarts.init(document.getElementById('trend-line'))
    //   chart.setOption({
    //     xAxis: {
    //       type: 'category',
    //       data: ['06', '07', '08', '09', '10', '11', '12'],
    //       axisLabel: { color: '#fff' }
    //     },
    //     yAxis: {
    //       type: 'value',
    //       axisLabel: { color: '#fff' }
    //     },
    //     series: [
    //       {
    //         data: [1, 2, 1, 3, 2, 4, 6],
    //         type: 'line',
    //         smooth: true,
    //         lineStyle: { color: '#00c0ff' }
    //       }
    //     ]
    //   })
    // }
  }
}
</script>

<style scoped>
.left-panel {
  width: 35%;
  padding-right: 10px;
  /* overflow-y: auto; */
}

.card {
  height: auto;
  background: rgba(0, 20, 40, 0.6);
  color: #fff;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  /* overflow: visible; */
}
/* .ower {
  padding: 20px;
  background: #c8d8ee;
} */

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

@keyframes techGlow {
  0% {
    text-shadow:
      0 0 10px rgba(0, 247, 255, 0.5),
      0 0 20px rgba(0, 247, 255, 0.7),
      0 0 30px rgba(0, 247, 255, 0.9);
  }
  100% {
    text-shadow:
      0 0 20px rgba(0, 247, 255, 1), 
      0 0 30px rgba(0, 247, 255, 1.2), 
      0 0 40px rgba(0, 247, 255, 1.5);
  }
}
</style>
