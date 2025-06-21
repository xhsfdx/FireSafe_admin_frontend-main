<template>
  <div class="left-panel">
    <div class="card">
      <!-- 業主單位总数区域 -->
      <h3>业主单位状况</h3>
      <TotalOwer />
    </div>

    <div class="card">
      <h3>任务统计</h3>
      <BusinessStats />
      <!-- <div id="task-ring" style="height: 180px;"></div> -->
    </div>

    <div class="card">
      <h3>业务趋势</h3>
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
  background: #003366;
  color: #fff;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  /* overflow: visible; */
}
.ower {
  padding: 20px;
  background: #c8d8ee;
}

.total-unit {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.total-unit-icon {
  font-size: 30px;
  color: #5caaff;
  background-color: green;
  padding: 20px;
  border-radius: 50%;
  margin-left: 8px;
}

.total-unit-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: -10px;
}

.total-unit-info span {
  font-size: 30px;
  color: white;
  font-weight: bold;
  background-color: green;
  padding: 10px 20px;
  border-radius: 10px;
}
.total-unit-info .total-word {
  font-size: 15px;
  color: #fff;
  margin-top: 30px;
  white-space: nowrap;
}

.statistics {
  display: flex;
  /* grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); */
  justify-content: space-around;
  margin-bottom: -2px;
}

.statistics .item {
  min-width: 0;
  text-align: center;
  align-items: baseline;
  /* background-color: #4e0404; */
}

.statistics .item div:first-child {
  font-size: 30px;
  color: rgb(221, 11, 11);
  margin-bottom: 5px;
}

.statistics .item div:last-child {
  color:rgb(67, 60, 60);
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .left-panel {
    width: 100%;
    padding-right: 0;
  }

  .total-unit {
    flex-direction: column;
    align-items: flex-start;
  }

  .statistics {
    flex-direction: column;
  }

  .statistics .item {
    width: 100%;
  }
}
</style>
