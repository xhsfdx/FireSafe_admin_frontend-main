<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap" rel="stylesheet"></link>
<template>
  <div class="dashboard-container">
    <canvas ref="particles"></canvas>
    <!-- 顶部标题和右侧信息区域 -->
    <div class="header">
      <div class="left-group">
        <div class="datetime">{{ currentDateTime }}</div>
        <el-button type="primary" class="digital-screen" @click="digital">数字可视化大屏</el-button>
      </div>
      <div class="title">不凡消防技术服务管理系统</div>
      <el-button :style="{ backgroundColor: isClicked ? '#007bff' : 'black' }" type="primary" class="service-system" @click="servicesystem">维保服务系统</el-button>
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
            <div class="info-value">3</div>
            <div class="info-desc">(本月已完成)</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">0</div>
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
            <div class="info-value">2</div>
            <div class="info-desc">(当前未完成)</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">2</div>
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
            <div class="info-value">2</div>
            <div class="info-desc">(当前未完成)</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">2</div>
            <div class="info-desc">(逾期未完成)</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 您可以根据需要添加更多数据卡片 -->
  </div>
</template>

<script>

export default {
  data() {
    return {
      isClicked: false,
      currentDateTime: '',
      routineMaintenance: {
        currentMonthCompleted: 3,
        lastMonthOverdue: 0
      },
      faultWorkOrder: {
        currentMonthCompleted: 2,
        overdue: 2
      },
      additionalMaintenance: {
        currentMonthCompleted: 3,
        overdue: 2
      }
      // 您可以根据需要添加更多数据属性
    }
  },
  mounted() {
    // 定时更新时间
    this.updateDateTime()
    this.timer = setInterval(this.updateDateTime, 1000)
    this.initParticles()
    setInterval(this.drawParticles, 33)
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.timer)
  },
  methods: {
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
    }

  }
}
</script>

<style scoped>
.dashboard-container {
  position: relative;
  font-family: 'Orbitron', sans-serif;
  background: #000;
  color: #00f0ff;
  /* min-height: 100vh; */
  overflow: hidden;
}

/* 粒子背景canvas */
.dashboard-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

/* 头部 */
.header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid #00f0ff55;
  border-radius: 10px;
  box-shadow: 0 0 20px #00f0ff88, inset 0 0 20px #00f0ff33;
  padding: 10px 20px;
  margin: 10px;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 10px;
}

.datetime {
  font-size: 14px;
  color: #00f0ff;
  margin-right: 20px;
}

.title {
  font-size: 30px;
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
  color: #00f0ff;
  text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  pointer-events: none;
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
}

.data-card {
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(12px);
  background: rgba(0, 20, 40, 0.4);
  border: 1px solid #00f0ff55;
  box-shadow: 0 0 20px #00f0ff88, inset 0 0 20px #00f0ff33;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px #00f0ffcc, inset 0 0 30px #00f0ff55;
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #00f0ff55;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #00f0ff;
  box-shadow: 0 0 20px #00f0ff88;
  margin-right: 20px;
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
  font-size: 28px;
  font-weight: bold;
  color: #00f0ff;
  animation: flicker 2s infinite alternate;
}
@keyframes flicker {
  0% {
    text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
  }
  100% {
    text-shadow: 0 0 20px #00f0ff, 0 0 40px #00f0ff;
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
