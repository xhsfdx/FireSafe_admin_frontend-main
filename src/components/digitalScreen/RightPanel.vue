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
    // this.drawRoleRing() // 已注释，使用PersonnelStatistics组件
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
  min-width: 300px;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
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

table {
  width: 100%;
  color: #fff;
  border-collapse: collapse;
}

th, td {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 247, 255, 0.2);
}

th {
  background: rgba(0, 247, 255, 0.1);
  color: #00f7ff;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.5);
}

tr:hover {
  background: rgba(0, 247, 255, 0.05);
}

/* Responsive styles */
@media (max-width: 1440px) {
  .right-panel {
    width: 32%;
    min-width: 280px;
  }
  
  .card {
    padding: 15px;
  }
}

@media (max-width: 1024px) {
  .right-panel {
    width: 100%;
    min-width: auto;
    padding-left: 0;
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
  
  th, td {
    padding: 8px 6px;
    font-size: 14px;
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
  
  th, td {
    padding: 6px 4px;
    font-size: 12px;
  }
}
</style>
