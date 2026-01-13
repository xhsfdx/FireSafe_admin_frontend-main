<template>
  <div class="map-chart">
    <!-- 地图容器 -->
    <div id="map-container" class="map-container" />
  </div>
</template>

<script>
import echarts from 'echarts'
import sichuan from '@/assets/geo/sichuan.json'
import { getDigitalScreenData } from '@/api/digitalScreen'

export default {
  name: 'MapChart',
  data() {
    return {
      mapData: [], // 用于存储地图数据
      chart: null
    }
  },
  async mounted() {
    echarts.registerMap('四川', sichuan)
    // 等待 DOM 完全渲染后再初始化
    await this.$nextTick()
    // 再等待一帧确保容器尺寸已确定
    await new Promise(resolve => requestAnimationFrame(resolve))
    
    const container = document.getElementById('map-container') || this.$el.querySelector('.map-container')
    if (container) {
      this.chart = echarts.init(container)
      this.loadData().then(() => {
        this.renderMap()
        // 渲染后立即调整大小
        this.$nextTick(() => {
          this.handleResize()
        })
      })
      window.addEventListener('resize', this.handleResize)
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    async loadData() {
      try {
        const res = await getDigitalScreenData()
        if (res && res.data && res.data.cityStats) {
          // 计算最大面积值，用于计算发光强度
          const areaValues = res.data.cityStats.map(item => item.totalArea || 0)
          const maxArea = Math.max(...areaValues, 1)
          
          // 使用维保面积作为 value，并为每个区域计算发光效果
          this.mapData = res.data.cityStats.map(item => {
            const area = item.totalArea || 0
            // 计算发光强度（0-1之间），面积越大，发光越强
            const intensity = maxArea > 0 ? Math.min(area / maxArea, 1) : 0
            // 根据强度计算阴影模糊半径（20-80之间）
            const shadowBlur = 20 + (intensity * 60)
            // 根据强度计算阴影透明度（0.3-1之间）
            const shadowOpacity = 0.3 + (intensity * 0.7)
            // 根据强度计算边框宽度（2-5之间）
            const borderWidth = 2 + (intensity * 3)
            
            return {
              name: item.city,
              value: area, // 使用维保面积作为主要值
              area: area ? (area / 10000).toFixed(2) : '0.00', // 转成万平方米，用于显示
              ownerCount: item.ownerCompanyCount || 0, // 业主单位数，用于显示
              // 为每个区域设置动态发光效果
              itemStyle: {
                areaColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: `rgba(0, 68, 102, ${0.6 + intensity * 0.4})` },
                    { offset: 1, color: `rgba(0, 17, 34, ${0.4 + intensity * 0.3})` }
                  ]
                },
                borderColor: `rgba(0, 192, 255, ${0.5 + intensity * 0.5})`,
                borderWidth: borderWidth,
                shadowColor: `rgba(0, 255, 255, ${shadowOpacity})`,
                shadowBlur: shadowBlur,
                shadowOffsetX: 0,
                shadowOffsetY: 0
              }
            }
          })
          console.log('地图数据 mapData:', this.mapData) // 确认数据是否为空，格式是否正确
          console.log('城市统计数据:', res.data.cityStats)
        } else {
          console.warn('地图数据为空或格式不正确:', res)
          this.mapData = []
        }
      } catch (error) {
        console.error('加载地图数据失败:', error)
        this.mapData = []
      }
    },
    renderMap() {
      if (!this.chart || !this.mapData || this.mapData.length === 0) {
        console.warn('地图数据为空，无法渲染')
        return
      }
      
      // 计算最大和最小面积值，用于 visualMap
      const areaValues = this.mapData.map(d => d.value || 0).filter(v => v > 0)
      const maxArea = Math.max(...areaValues, 1)
      const minArea = Math.min(...areaValues, 0)
      
      const option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.9)',
          borderColor: '#00ffff',
          borderWidth: 2,
          textStyle: { 
            color: '#00ffff',
            fontSize: 20
          },
          padding: [12, 16],
          formatter: params => {
            const data = params.data || {}
            return [
              `<div style="font-size: 22px; font-weight: bold; margin-bottom: 8px;">${params.name}</div>`,
              `<div style="font-size: 18px; margin: 4px 0;">维保面积：${data.area || '0.00'} 万㎡</div>`,
              `<div style="font-size: 18px; margin: 4px 0;">业主单位：${data.ownerCount || 0} 家</div>`
            ].join('')
          }
        },
        visualMap: {
          show: true,
          left: 'left',
          bottom: '30px',
          min: minArea,
          max: maxArea,
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#001f3f', '#004466', '#0088cc', '#00c0ff', '#00f0ff'] // 从深到浅的蓝色渐变
          },
          textStyle: {
            color: '#00ffff',
            fontSize: 20
          },
          itemWidth: 25,
          itemHeight: 150,
          itemGap: 8,
          formatter: function(value) {
            // 显示为万平方米
            return (value / 10000).toFixed(0) + '万㎡'
          }
        },
        series: [
          {
            name: '四川',
            type: 'map',
            map: '四川',
            roam: false,
            // 使用 layoutCenter 和 layoutSize 控制地图在容器中的位置和大小
            layoutCenter: ['50%', '50%'],
            layoutSize: '98%', // 地图占据容器的98%空间，最大化显示
            // 确保地图使用容器的全部可用空间
            aspectScale: 0.75, // 调整地图的宽高比，使其更好地适应容器
            label: {
              show: true,
              color: '#00ffff',
              fontSize: 18,
              fontWeight: 'bold',
              textShadowBlur: 8,
              textShadowColor: 'rgba(0, 240, 255, 0.8)'
            },
            // 默认样式（会被 data 中的 itemStyle 覆盖）
            itemStyle: {
              areaColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#004466' },
                  { offset: 1, color: '#001122' }
                ]
              },
              borderColor: '#00c0ff',
              borderWidth: 3,
              shadowColor: 'rgba(0, 255, 255, 0.4)',
              shadowBlur: 40,
              shadowOffsetX: 0,
              shadowOffsetY: 0
            },
            emphasis: {
              label: { 
                show: true, 
                color: '#ffff00',
                fontSize: 24,
                fontWeight: 'bold',
                textShadowBlur: 15,
                textShadowColor: '#ffff00'
              },
              itemStyle: { 
                areaColor: '#0077aa', 
                shadowColor: '#00ffff', 
                shadowBlur: 80, // 悬停时更强的发光
                borderColor: '#00ffff',
                borderWidth: 5
              }
            },
            data: this.mapData
          }
        ]
      }
      this.chart.setOption(option, true)
      
      // 设置完 option 后立即调整大小，确保地图占据最大空间
      this.$nextTick(() => {
        // 多次调用 resize 确保图表正确调整大小
        setTimeout(() => {
          if (this.chart) {
            this.chart.resize({
              width: 'auto',
              height: 'auto'
            })
          }
        }, 50)
        setTimeout(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 200)
      })
    },
    handleResize() {
      if (this.chart) {
        // 使用 setTimeout 确保在 DOM 更新后执行
        setTimeout(() => {
          this.chart.resize({
            width: 'auto',
            height: 'auto'
          })
        }, 100)
      }
    }
  }
  // mounted() {
  //   this.fetchMapData()
  //   this.initMap()
  // },
  // methods: {
  //   async fetchMapData() {
  //     try {
  //       const res = await getDigitalScreenData()
  //       if (res) {
  //         // 根据后端返回的数据格式更新地图数据
  //         this.mapData = res.data.cityStats.map(item => ({
  //           name: item.district, // 区域名称
  //           value: item.ownerCompanyCount, // 维保单位数
  //           area: (item.totalArea / 10000).toFixed(2) // 维保总面积，转换为万㎡
  //         }))
  //       }
  //     } catch (err) {
  //       console.error('获取地图数据失败', err)
  //     }
  //   },
  //   initMap() {
  //     const myChart = echarts.init(document.getElementById('map-container'))
  //     echarts.registerMap('四川', sichuan)

  //     const option = {
  //       tooltip: {
  //         trigger: 'item',
  //         backgroundColor: 'rgba(0,0,0,0.8)',
  //         borderColor: '#00ffff',
  //         borderWidth: 1,
  //         textStyle: { color: '#00ffff' },
  //         formatter: params => {
  //           const data = params.data || {}
  //           return [
  //             params.name,
  //             `单位数：${data.value || 0} 家`,
  //             `维保面积：${data.area || 0} 万㎡`
  //           ].join('<br/>')
  //         }
  //       },
  //       visualMap: {
  //         show: true,
  //         left: 'left',
  //         bottom: '20px',
  //         min: 0,
  //         max: 20,
  //         text: ['高', '低'],
  //         calculable: true,
  //         inRange: {
  //           color: ['#3aa9ff', '#001f3f']
  //         },
  //         textStyle: {
  //           color: '#00ffff'
  //         }
  //       },
  //       series: [
  //         {
  //           name: '四川省维保地图',
  //           type: 'map',
  //           map: '四川',
  //           roam: false,
  //           label: {
  //             show: true,
  //             color: '#00ffff',
  //             fontSize: 12
  //           },
  //           itemStyle: {
  //             areaColor: {
  //               type: 'linear',
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [
  //                 { offset: 0, color: '#004466' },
  //                 { offset: 1, color: '#001122' }
  //               ]
  //             },
  //             borderColor: '#00c0ff',
  //             borderWidth: 1,
  //             shadowColor: '#00ffff',
  //             shadowBlur: 25,
  //             shadowOffsetX: 0,
  //             shadowOffsetY: 0
  //           },
  //           emphasis: {
  //             label: {
  //               show: true,
  //               color: '#ffff00'
  //             },
  //             itemStyle: {
  //               areaColor: '#0077aa',
  //               shadowColor: '#00ffff',
  //               shadowBlur: 40
  //             }
  //           },
  //           data: this.mapData
  //         }
  //       ]

  //     }

  //     myChart.setOption(option)

  //     myChart.on('click', params => {
  //       console.log(`点击了：${params.name}`)
  //     })

  //     window.addEventListener('resize', () => {
  //       myChart.resize()
  //     })
  //   }
  // }
}
</script>

<style scoped>
.map-chart {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  margin: 0;
  padding: 0;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: none;
  border-radius: 0;
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
}

/* Ensure the ECharts canvas takes full space */
.map-container > div {
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  position: relative !important;
}

.map-container canvas {
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  display: block !important;
}

/* Responsive styles - Optimized for 65" TV */
@media (max-width: 1920px) {
  .map-chart {
    width: 30vw;
  }
}

@media (max-width: 1440px) {
  .map-chart {
    width: 30vw;
    min-width: 400px;
  }
}

@media (max-width: 1024px) {
  .map-chart {
    width: 100%;
    min-width: auto;
  }
  
  .map-container {
    min-height: 350px;
  }
}

@media (max-width: 768px) {
  .map-chart {
    width: 100%;
    padding: 10px;
  }
  
  .map-container {
    min-height: 300px;
  }
}

/* 科幻立体光圈容器 */
/* 立体光圈容器 */
.sci-fi-radar {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: auto;
  aspect-ratio: 1;
  margin-top: -50px;
  perspective: 800px;
}

/* 光圈：旋转+放射性渐变发射光线 */
.circle {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%) rotateX(65deg);
  opacity: 0.8;
  animation: rotate 6s linear infinite;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 255, 255, 0.25) 0%,
    rgba(0, 255, 255, 0.08) 60%,
    transparent 80%
  );
  /* 四周发射光线效果 */
  box-shadow:
  0 0 30px rgba(0, 255, 255, 0.8),
  0 0 80px rgba(0, 255, 255, 0.5),
  0 0 150px rgba(0, 255, 255, 0.3);

}

.circle1 {
  width: 400px;
  height: 400px;
}
.circle2 {
  width: 320px;
  height: 320px;
  animation-duration: 4s;
}
.circle3 {
  width: 200px;
  height: 200px;
  animation-duration: 3s;
}

/* 中心脉冲发光点 */
.pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #00ffff 0%, #0088cc 60%);
  box-shadow:
    0 0 30px #00ffff,
    0 0 60px rgba(0,255,255,0.3),
    0 0 120px rgba(0,255,255,0.15);
  animation: pulse 2s ease-out infinite;
}

/* 旋转动画 */
@keyframes rotate {
  0% { transform: translate(-50%, -50%) rotateX(65deg) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotateX(65deg) rotate(360deg); }
}

/* 脉冲扩散 */
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}
</style>
