<template>
  <div class="ower">
    <div id="particles-js" />
    <div class="total-unit">
      <div class="total-unit-icon">
        <i class="el-icon-user-solid" />
      </div>
      <div class="total-unit-info">
        <span>{{ ownerCompanyTotal }}</span>
        <div class="total-word">家业主单位</div>
      </div>
    </div>
    <div class="statistics">
      <div class="item sci-fi-card">
        <div>{{ todayChecked }}</div>
        <div>当日打卡数</div>
      </div>
      <div class="item sci-fi-card">
        <div>{{ todayCompleted }}</div>
        <div>当日完成数</div>
      </div>
      <div class="item sci-fi-card">
        <div>{{ todayReviews }}</div>
        <div>当日评价数</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDigitalScreenData } from '@/api/digitalScreen'
export default {
  name: 'TotalOwer',
  data() {
    return {
      ownerCompanyTotal: 0,
      todayChecked: 0,
      todayCompleted: 0,
      todayReviews: 0
    }
  },
  mounted() {
    this.initParticles()
    this.loadOwer()
  },
  methods: {
    initParticles() {
      /* global particlesJS */
      if (typeof particlesJS === 'undefined') {
        console.error('particles.js is not loaded!')
        return
      }

      particlesJS('particles-js', {
        particles: {
          number: {
            value: 120, // 粒子数量
            density: { enable: true, value_area: 800 }
          },
          color: { value: '#00ffff' }, // 粒子颜色
          shape: {
            type: 'circle',
            stroke: { width: 0, color: '#000' }
          },
          opacity: {
            value: 0.9,
            random: false
          },
          size: {
            value: 4,
            random: true
          },
          line_linked: {
            enable: false // 彻底关闭线条
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            out_mode: 'out'
          }
        },
        interactivity: {
          events: {
            onhover: { enable: true, mode: 'repulse' }, // 悬停时粒子分散
            onclick: { enable: true, mode: 'push' } // 点击时生成粒子
          },
          modes: {
            repulse: { distance: 100 },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      })
    },
    async loadOwer() {
      try {
        const res = await getDigitalScreenData()
        if (res) {
          const { ownerCompanyTotal, todayChecked, todayCompleted, todayReviews } = res.data
          this.ownerCompanyTotal = ownerCompanyTotal || 0
          this.todayChecked = todayChecked || 0
          this.todayCompleted = todayCompleted || 0
          this.todayReviews = todayReviews || 0
        } else {
          this.$message.error('获取统计数据失败')
        }
      } catch (err) {
        console.error('获取统计数据出错:', err)
        this.$message.error('服务器错误')
      }
    }

  }
}
</script>

<style scoped>
.ower {
  padding: 20px;
  background: rgba(0, 20, 40, 0.3);
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
}

/* 粒子背景层 */
#particles-js {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
}

.total-unit {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
}

.total-unit-icon {
  font-size: 36px;
  color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
  padding: 25px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.total-unit-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.total-unit-info span {
  font-size: 48px;
  color: #ffffff;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
}

.total-unit-info .total-word {
  font-size: 18px;
  color: #00ffff;
  text-shadow: 0 0 5px #00ffff;
  white-space: nowrap;
}

.statistics {
  display: flex;
  justify-content: space-between;
}

.sci-fi-card {
  flex: 1;
  margin: 0 10px;
  padding: 20px -10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  transition: transform 0.3s;
}
.sci-fi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}

.sci-fi-card div:first-child {
  font-size: 36px;
  color: #00ffff;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffff;
  margin-bottom: 8px;
}

.sci-fi-card div:last-child {
  font-size: 16px;
  color: #ffffff;
  text-shadow: 0 0 5px #00ffff;
  margin-bottom: 10px;
}
</style>
