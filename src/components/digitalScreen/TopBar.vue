<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap" rel="stylesheet"/>
<template>
  <div class="dashboard-container">
    <canvas ref="particles" />
    <!-- 顶部标题和右侧信息区域 -->
    <div class="header">
      <div class="left-group">
        <div class="datetime">{{ currentDateTime }}</div>
        <el-button type="primary" class="digital-screen" @click="digital">数字可视化大屏</el-button>
      </div>
      <div class="title">不凡消防技术服务管理系统</div>
      <el-button
        :style="{ backgroundColor: isClicked ? '#007bff' : 'black' }"
        type="primary"
        class="service-system"
        @click="servicesystem"
      >维保服务系统</el-button>
      <!-- <div class="navigation">
        <div class="nav-item">数字可视化大屏</div>
        <div class="nav-item">维保服务系统</div>
      </div> -->
    </div>

    <!-- 下方数据展示区域 -->
    <div class="data-display">
      <div class="data-card">
        <div class="icon-circle">
          <i class="el-icon-document" />
        </div>
        <div class="maintenance-info">
          <div class="info-item">
            <div class="info-title">例行维保</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">{{ maintainThisMonthCompleted }}</div>
            <div class="info-desc">(本月已完成)</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">{{ maintainLastMonthOverdue }}</div>
            <div class="info-desc">(上月逾期数)</div>
          </div>
        </div>
      </div>
      <div class="data-card">
        <div class="icon-circle">
          <i class="el-icon-setting" />
        </div>
        <div class="maintenance-info">
          <div class="info-item">
            <div class="info-title">故障工单</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">{{ faultUnresolved }}</div>
            <div class="info-desc">(当前未完成)</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">{{ faultOverdueUnresolved }}</div>
            <div class="info-desc">(逾期未完成)</div>
          </div>
        </div>
      </div>
      <div class="data-card">
        <div class="icon-circle">
          <i class="el-icon-lock" />
        </div>
        <div class="maintenance-info">
          <div class="info-item">
            <div class="info-title">附加维保</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">{{ additionalMaintainCount }}</div>
            <div class="info-desc">(当前共完成)</div>
          </div>

        </div>
      </div>
    </div>
  </div>
  <!-- 您可以根据需要添加更多数据卡片 -->
</template>

<script>

import { getDigitalScreenData } from '@/api/digitalScreen'
export default {
  data() {
    return {
      isClicked: false,
      currentDateTime: '',
      maintainThisMonthCompleted: 0,
      maintainLastMonthOverdue: 0,
      faultUnresolved: 0,
      faultOverdueUnresolved: 0,
      additionalMaintainCount: 0
      // screenData: null
    }
  },
  // computed: {
  //   maintainThisMonthCompleted() {
  //     return this.screenData ? this.screenData.maintainThisMonthCompleted : 0;
  //   },
  //   maintainLastMonthOverdue() {
  //     return this.screenData ? this.screenData.maintainLastMonthOverdue : 0;
  //   },
  //   faultUnresolved() {
  //     return this.screenData ? this.screenData.faultUnresolved : 0;
  //   },
  //   faultOverdueUnresolved() {
  //     return this.screenData ? this.screenData.faultOverdueUnresolved : 0;
  //   },
  //   additionalMaintainCount() {
  //     return this.screenData ? this.screenData.additionalMaintainCount : 0;
  //   }
  // },

  mounted() {
    // 定时更新时间
    this.updateDateTime()
    this.timer = setInterval(this.updateDateTime, 1000)
    this.initParticles()
    this.particleInterval = setInterval(this.drawParticles, 33)
    this.loadScreenData()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    // 清除定时器
    if (this.timer) clearInterval(this.timer)
    if (this.particleInterval) clearInterval(this.particleInterval)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    digital() {
      // 数字可视化大屏按钮点击事件
      this.$message.info('您当前已在数字可视化大屏页面')
    },
    servicesystem() {
      this.$router.push({ name: 'AgencyBasicInfo' })
    },
    updateDateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = ('0' + (now.getMonth() + 1)).slice(-2)
      const day = ('0' + now.getDate()).slice(-2)
      const hours = ('0' + now.getHours()).slice(-2)
      const minutes = ('0' + now.getMinutes()).slice(-2)
      const seconds = ('0' + now.getSeconds()).slice(-2)
      this.currentDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
    },
    initParticles() {
      const canvas = this.$refs.particles
      const ctx = canvas.getContext('2d')
      this.ctx = ctx
      this.w = window.innerWidth
      this.h = window.innerHeight
      canvas.width = this.w
      canvas.height = this.h
      this.particles = []
      this.numParticles = 80
      this.angle = 0
      for (let i = 0; i < this.numParticles; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          r: Math.random() * 2 + 1,
          d: Math.random() * this.numParticles
        })
      }
    },
    drawParticles() {
      const ctx = this.ctx
      ctx.clearRect(0, 0, this.w, this.h)
      ctx.fillStyle = '#00f0ff'
      ctx.shadowBlur = 20
      ctx.shadowColor = '#00f0ff'

      for (let i = 0; i < this.numParticles; i++) {
        const p = this.particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true)
        ctx.fill()
      }

      this.updateParticles()
    },
    updateParticles() {
      this.angle += 0.01
      for (let i = 0; i < this.numParticles; i++) {
        const p = this.particles[i]
        p.y += Math.cos(this.angle + p.d) + 0.5
        p.x += Math.sin(this.angle) * 0.5

        if (p.x > this.w + 5 || p.x < -5 || p.y > this.h) {
          if (i % 3 > 0) {
            this.particles[i] = { x: Math.random() * this.w, y: -10, r: p.r, d: p.d }
          } else {
            if (Math.sin(this.angle) > 0) {
              this.particles[i] = { x: -5, y: Math.random() * this.h, r: p.r, d: p.d }
            } else {
              this.particles[i] = { x: this.w + 5, y: Math.random() * this.h, r: p.r, d: p.d }
            }
          }
        }
      }
    },
    async loadScreenData() {
      try {
        const res = await getDigitalScreenData()
        if (res && res.data) {
          const data = res.data
          this.maintainThisMonthCompleted = data.maintainThisMonthCompleted || 0
          this.maintainLastMonthOverdue = data.maintainLastMonthOverdue || 0
          this.faultUnresolved = data.faultUnresolved || 0
          this.faultOverdueUnresolved = data.faultOverdueUnresolved || 0
          this.additionalMaintainCount = data.additionalMaintainCount || 0
        }
      } catch (err) {
        console.error('获取数字屏数据失败:', err)
      }
    },
    handleResize() {
      this.w = window.innerWidth
      this.h = window.innerHeight
      if (this.$refs.particles) {
        this.$refs.particles.width = this.w
        this.$refs.particles.height = this.h
      }
    }

  }
}
</script>

<style scoped>
.dashboard-container {
  position: relative;
  font-family: 'Orbitron', sans-serif;
  background: transparent;
  color: #00f0ff;
  overflow: hidden;
  width: 100%;
}

/* 粒子背景canvas */
.dashboard-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}

/* 头部 */
.header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.8) 0%, rgba(0, 40, 80, 0.6) 100%);
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #00f0ff, #0088cc, #00f0ff) 1;
  border-radius: 12px;
  box-shadow: 
    0 0 30px rgba(0, 240, 255, 0.6),
    inset 0 0 30px rgba(0, 240, 255, 0.2),
    0 0 60px rgba(0, 136, 204, 0.4);
  padding: 15px 25px;
  margin: 10px;
  backdrop-filter: blur(10px);
  animation: borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(0, 240, 255, 0.6),
      inset 0 0 30px rgba(0, 240, 255, 0.2),
      0 0 60px rgba(0, 136, 204, 0.4);
  }
  50% {
    box-shadow: 
      0 0 50px rgba(0, 240, 255, 0.9),
      inset 0 0 40px rgba(0, 240, 255, 0.4),
      0 0 90px rgba(0, 136, 204, 0.6);
  }
}

.left-group {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 10px;
}

.datetime {
  font-size: 16px;
  color: #00f0ff;
  margin-right: 20px;
  font-weight: 600;
  text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
  letter-spacing: 1px;
  padding: 8px 15px;
  background: rgba(0, 240, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.title {
  font-size: clamp(20px, 3vw, 36px);
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
  color: #00f0ff;
  text-shadow: 
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 30px #00f0ff,
    0 0 40px rgba(0, 240, 255, 0.5);
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  pointer-events: none;
  letter-spacing: 3px;
  animation: titleGlow 2s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% {
    text-shadow: 
      0 0 10px #00f0ff,
      0 0 20px #00f0ff,
      0 0 30px #00f0ff;
  }
  100% {
    text-shadow: 
      0 0 20px #00f0ff,
      0 0 30px #00f0ff,
      0 0 40px #00f0ff,
      0 0 50px rgba(0, 240, 255, 0.8);
  }
}

.digital-screen {
  color: #fff;
  background-color: rgba(0, 20, 40, 0.3);
  border: none;
  font-weight: bold;
  box-shadow: 0 0 10px #00f0ff;
}
.service-system {
  color: #fff;
  background-color: rgba(0, 20, 40, 0.3);
  border: none;
  font-weight: bold;
  box-shadow: 0 0 10px #00f0ff;
  margin-right: 20px;
}
.digital-screen:hover,
.service-system:hover {
  background-color: #59b4d0;
  box-shadow: 0 0 20px #00f0ff;
}

/* 卡片区 */
.data-display {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  flex-wrap: wrap;
}

.data-card {
  flex: 1;
  min-width: 250px;
  padding: 25px;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.6) 0%, rgba(0, 40, 80, 0.4) 100%);
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, rgba(0, 240, 255, 0.5), rgba(0, 136, 204, 0.5)) 1;
  box-shadow: 
    0 0 25px rgba(0, 240, 255, 0.5),
    inset 0 0 25px rgba(0, 240, 255, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.data-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%);
  animation: rotate  8s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.data-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 0 40px rgba(0, 240, 255, 0.8),
    inset 0 0 35px rgba(0, 240, 255, 0.25),
    0 12px 48px rgba(0, 0, 0, 0.4);
  border-image: linear-gradient(135deg, rgba(0, 240, 255, 0.8), rgba(0, 136, 204, 0.8)) 1;
}

.icon-circle {
  width: 60px;
  height: 60px;
  min-width: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.3) 0%, rgba(0, 136, 204, 0.3) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: #00f0ff;
  box-shadow: 
    0 0 25px rgba(0, 240, 255, 0.6),
    inset 0 0 15px rgba(0, 240, 255, 0.2);
  margin-right: 20px;
  border: 2px solid rgba(0, 240, 255, 0.4);
  animation: iconPulse 2s ease-in-out infinite;
  position: relative;
}

.icon-circle::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(0, 240, 255, 0.6);
  animation: iconRipple 2s ease-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    box-shadow: 
      0 0 25px rgba(0, 240, 255, 0.6),
      inset 0 0 15px rgba(0, 240, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 0 35px rgba(0, 240, 255, 0.9),
      inset 0 0 20px rgba(0, 240, 255, 0.3);
  }
}

@keyframes iconRipple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.maintenance-info {
  display: flex;
  flex-direction: row;
  gap: 8px;
  color: #00f0ff;
}

.info-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
}

.info-value {
  font-size: clamp(20px, 2.5vw, 32px);
  font-weight: bold;
  color: #00f0ff;
  animation: flicker 2s infinite alternate;
  text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
}

@keyframes flicker {
  0% {
    text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px rgba(0, 240, 255, 0.5);
  }
  100% {
    text-shadow: 0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 60px rgba(0, 240, 255, 0.8);
  }
}

/* Responsive styles */
@media (max-width: 1024px) {
  .header {
    padding: 12px 18px;
    margin: 8px;
  }
  
  .title {
    font-size: clamp(18px, 2.5vw, 28px);
  }
  
  .data-display {
    gap: 15px;
    padding: 15px;
  }
  
  .data-card {
    min-width: 200px;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 10px;
    padding: 10px 15px;
  }
  
  .title {
    position: static;
    margin: 10px 0;
  }
  
  .left-group {
    width: 100%;
    justify-content: space-between;
  }
  
  .data-display {
    flex-direction: column;
    gap: 12px;
  }
  
  .data-card {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .datetime {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .data-card {
    padding: 15px;
  }
  
  .icon-circle {
    width: 50px;
    height: 50px;
    min-width: 50px;
    font-size: 24px;
    margin-right: 15px;
  }
  
  .info-value {
    font-size: 24px;
  }
}
.info-desc {
  font-size: 12px;
  color: #00f0ff;
  text-align: center;
}

.horizontal {
  display: flex;
  flex-direction: row !important;
  align-items: baseline;
  gap: 8px;
}

</style>
