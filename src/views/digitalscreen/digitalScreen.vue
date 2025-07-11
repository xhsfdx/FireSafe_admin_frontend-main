<template>
  <div class="big-screen">
    <TopBar />

    <div class="main-content">
      <LeftPanel />
      <MapChart />
      <RightPanel />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/digitalScreen/TopBar.vue'
import MapChart from '@/components/digitalScreen/MapChart.vue'
import LeftPanel from '@/components/digitalScreen/LeftPanel.vue'
import RightPanel from '@/components/digitalScreen/RightPanel.vue'

export default {
  name: 'DigitalScreen',
  components: {
    TopBar,
    MapChart,
    LeftPanel,
    RightPanel
  },
  mounted() {
    this.initParticles()
  },

  methods: {
    initParticles() {
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
    }

  }
}
</script>

<style scoped>
.big-screen {
  background: #001f3f;
  color: #fff;
  width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-content {
  /* position: relative; */
  background: #001f3f;
  display: flex;
  flex: 1;
  padding: 10px 20px;
}

/* 粒子背景层 */
#particles-js {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
}

/* .main-content canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
} */
</style>
