<template>
  <div class="business-stats">
    <!-- 粒子背景容器 -->
    <!-- <div id="particles-js" /> -->

    <!-- 主内容 -->
    <div class="content">
      <div class="header">
        <span
          v-for="(item, index) in tabs"
          :key="index"
          :class="{ active: activeTab === item }"
          @click="activeTab = item"
        
      >
          {{ item }}
        </span>
      </div>

      <div class="chart-and-info">
        <div ref="echarts" class="echarts" />
        <div class="info">
          <div v-for="item in tabStatuses[activeTab]" :key="item.name" class="info-item">
            <span :style="{ background: item.color }" class="dot" />
            {{ item.name }}
            <span>{{ item.value }}</span> 条
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { random } from 'core-js/core/number'
import echarts from 'echarts'
// 如果用npm安装particles.js，需引入

export default {
  name: 'BusinessStats',
  data() {
    return {
      activeTab: '例行维护',
      tabs: ['例行维护', '故障工单'],
      tabStatuses: {
        '例行维护': [
          { name: '待处理', color: '#ff794b', value: 3 },
          { name: '处理中', color: '#ffcc5b', value: 0 },
          { name: '待审批', color: '#47c9ff', value: 0 },
          { name: '已完成', color: '#39f5ff', value: 2 }
        ],
        '故障工单': [
          { name: '待处理', color: '#ff794b', value: 5 },
          { name: '处理中', color: '#ffcc5b', value: 2 },
          // { name: '待审批', color: '#47c9ff', value: 1 },
          { name: '已完成', color: '#39f5ff', value: 10 }
        ]
      },
      chart: null
    }
  },
  watch: {
    activeTab() {
      this.updateChart()
    }
  },
  mounted() {
    this.initChart()
    // this.initParticles()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.echarts)
      this.updateChart()
    },
    updateChart() {
      if (!this.chart) return
      this.chart.setOption(this.getOption(), true)
    },
    getOption() {
      const data = this.tabStatuses[this.activeTab];
      const finished = data.find(item => item.name === '已完成')?.value || 0;
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percent = total > 0 ? Math.round((finished / total) * 100) : 0;
      return {
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: { show: false },
            data: [
              {
                value: percent,
                itemStyle: {
                  color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [
                      { offset: 0, color: 'rgba(0,255,255,0.8)' },
                      { offset: 0.5, color: 'rgba(0,255,255,0.6)' },
                      { offset: 1, color: 'rgba(0,255,255,0.3)' }
                    ]
                  },
                  shadowBlur: 60,
                  shadowColor: 'rgba(0,255,255,0.7)',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 100 - percent,
                itemStyle: {
                  color: 'rgba(0,204,204,0.7)'
                }
              }
            ]
          }
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: `{percent|${percent}%}\n{complete|完成率}`,
              fill: 'white',
              rich: {
                percent: {
                  fontSize: 28,
                  fontFamily: 'Orbitron',
                  fontWeight: 'bold',
                  fill: 'red',
                  textShadowBlur: 40,
                  textShadowColor: '#00ffff'
                },
                complete: {
                  fontSize: 14,
                  fontFamily: 'Orbitron',
                  fontWeight: 'normal',
                  fill: 'white' // 完成率文字颜色
                }
              },
              textAlign: 'center'
            }
          }
        ]
      }
    }

    // initParticles() {
    //   if (typeof particlesJS === 'undefined') {
    //     console.error('particles.js is not loaded!')
    //     return
    //   }
    //   particlesJS('particles-js', {
    //     particles: {
    //       number: { value: 150 },
    //       color: { value: '#00ffff' },
    //       shape: { type: 'circle' },
    //       opacity: { value: 0.9, random: true, anim: {
    //         enable: true,
    //         speed: 0.8,
    //         opacity_min: 0.2,
    //         sync: false
    //       }
    //       },
    //       size: { value: 6, random: true },
    //       // line_linked: {
    //       //   enable: true,
    //       //   distance: 150,
    //       //   color: '#00ffff',
    //       //   opacity: 0.4,
    //       //   width: 1
    //       // },
    //       move: {
    //         enable: true,
    //         speed: 2,
    //         direction: 'none',
    //         out_mode: 'out'
    //       }
    //     },
    //     interactivity: {
    //       events: {
    //         onhover: { enable: true, mode: 'grab' },
    //         onclick: { enable: true, mode: 'push' }
    //       },
    //       modes: {
    //         grab: { distance: 200, line_linked: { opacity: 0.6 } },
    //         push: { particles_nb: 4 }
    //       }
    //     },
    //     retina_detect: true
    //   })
    // }

  }
}
</script>

<style scoped>
.business-stats {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(0, 20, 40, 0.3);
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}

.content {
  position: relative;
  z-index: 1;
  padding: 24px;
}

.header {
  margin-bottom: 24px;
  display: flex;
}

.header span {
  margin-right: 24px;
  padding-bottom: 6px;
  cursor: pointer;
  color: white;
  font-weight: 500;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
  position: relative;
  transition: all 0.3s;
}
.header span::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background: #00ffff;
  transition: width 0.3s;
}
.header span:hover::after {
  width: 100%;
}
.header .active {
  color: #00ffff;
  text-shadow: 0 0 6px #00ffff;
}
.header .active::after {
  width: 100%;
}

.chart-and-info {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
}

.echarts {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  position: relative;
}
.echarts::before {
  content: '';
  position: absolute;
  top: -16px;
  left: -16px;
  right: -16px;
  bottom: -16px;
  border-radius: 50%;
  /* border: 1px dashed rgba(255,255,0,0.3); */
  animation: rotate 12s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.info {
  margin-left: 22px;
  display: flex;
  flex-direction: column;
  color: #ddd;
  font-family: 'Orbitron', sans-serif;
  position: relative;
  width:120px;
}
.info::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, transparent, rgba(0,255,255,0.5), transparent);
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-block;
  box-shadow: 0 0 6px currentColor;
}

/* 呼吸闪烁数字 */
.echarts .echarts-number {
  animation: breathe 2s infinite alternate;
}
@keyframes breathe {
  0% { opacity: 0.8; text-shadow: 0 0 6px #00ffff; }
  100% { opacity: 1; text-shadow: 0 0 12px #00ffff; }
}

</style>
