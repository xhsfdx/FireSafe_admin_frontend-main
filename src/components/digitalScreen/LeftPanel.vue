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
    // this.drawRing() // 已注释，使用BusinessStats组件
    // this.drawTrend() // 已注释，使用BusinessTrend组件
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
  min-width: 300px;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  height: auto;
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.8) 0%, rgba(0, 40, 80, 0.6) 100%);
  color: #fff;
  padding: 20px;
  margin-bottom: 0;
  border-radius: 12px;
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, rgba(0, 247, 255, 0.4), rgba(0, 136, 204, 0.4)) 1;
  box-shadow: 
    0 0 25px rgba(0, 247, 255, 0.4),
    inset 0 0 20px rgba(0, 247, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 247, 255, 0.1), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 0 35px rgba(0, 247, 255, 0.6),
    inset 0 0 25px rgba(0, 247, 255, 0.15);
  border-image: linear-gradient(135deg, rgba(0, 247, 255, 0.7), rgba(0, 136, 204, 0.7)) 1;
}

.tech-title {
  font-size: clamp(16px, 1.8vw, 22px);
  font-weight: 700;
  color: #00f7ff;
  text-align: center;
  text-shadow:
    0 0 10px rgba(0, 247, 255, 0.6),
    0 0 20px rgba(0, 247, 255, 0.8),
    0 0 30px rgba(0, 247, 255, 1);
  letter-spacing: 3px;
  animation: techGlow 2s ease-in-out infinite alternate;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(0, 247, 255, 0.3);
  position: relative;
}

.tech-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f7ff, transparent);
  box-shadow: 0 0 10px #00f7ff;
}

@keyframes techGlow {
  0% {
    text-shadow:
      0 0 10px rgba(0, 247, 255, 0.6),
      0 0 20px rgba(0, 247, 255, 0.8),
      0 0 30px rgba(0, 247, 255, 1);
  }
  100% {
    text-shadow:
      0 0 20px rgba(0, 247, 255, 1),
      0 0 30px rgba(0, 247, 255, 1.2),
      0 0 40px rgba(0, 247, 255, 1.5),
      0 0 60px rgba(0, 247, 255, 0.8);
  }
}

/* Responsive styles */
@media (max-width: 1440px) {
  .left-panel {
    width: 32%;
    min-width: 280px;
  }
  
  .card {
    padding: 15px;
  }
}

@media (max-width: 1024px) {
  .left-panel {
    width: 100%;
    min-width: auto;
    padding-right: 0;
  }
  
  .card {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .card {
    padding: 12px;
  }
  
  .tech-title {
    font-size: 18px;
    margin-bottom: 15px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 10px;
  }
  
  .tech-title {
    font-size: 16px;
    letter-spacing: 2px;
  }
}
</style>
