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
    this.$nextTick(() => {
      const container = document.getElementById('map-container') || this.$el.querySelector('.map-container')
      if (container) {
        this.chart = echarts.init(container)
        this.loadData().then(() => {
          this.renderMap()
        })
        window.addEventListener('resize', this.handleResize)
      }
    })
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
        if (res && res.data) {
          this.mapData = res.data.cityStats.map(item => ({
            name: item.city,
            value: item.ownerCompanyCount,
            area: (item.totalArea / 10000).toFixed(2) // 转成万平方米
          }))
          console.log('地图数据 mapData:', this.mapData) // 确认数据是否为空，格式是否正确
        }
      } catch (error) {
        console.error('加载地图数据失败:', error)
      }
    },
    renderMap() {
      const option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderColor: '#00ffff',
          borderWidth: 1,
          textStyle: { color: '#00ffff' },
          formatter: params => {
            const data = params.data || {}
            return [
              params.name,
              `单位数：${data.value || 0} 家`,
              `维保面积：${data.area || 0} 万㎡`
            ].join('<br/>')
          }
        },
        visualMap: {
          show: true,
          left: 'left',
          bottom: '20px',
          min: 0,
          max: Math.max(...this.mapData.map(d => d.value || 0), 1),
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#00c0ff', '#0088cc', '#004466', '#001f3f']
          },
          textStyle: {
            color: '#00ffff',
            fontSize: 11
          },
          itemWidth: 15,
          itemHeight: 100
        },
        series: [
          {
            name: '四川',
            type: 'map',
            map: '四川',
            roam: false,
            label: {
              show: true,
              color: '#00ffff',
              fontSize: 12
            },
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
              borderWidth: 2,
              shadowColor: '#00ffff',
              shadowBlur: 30,
              shadowOffsetX: 0,
              shadowOffsetY: 0
            },
            emphasis: {
              label: { 
                show: true, 
                color: '#ffff00',
                fontSize: 14,
                fontWeight: 'bold',
                textShadowBlur: 10,
                textShadowColor: '#ffff00'
              },
              itemStyle: { 
                areaColor: '#0077aa', 
                shadowColor: '#00ffff', 
                shadowBlur: 50,
                borderColor: '#00ffff',
                borderWidth: 3
              }
            },
            data: this.mapData
          }
        ]
      }
      this.chart.setOption(option)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border: none;
  border-radius: 8px;
}

/* Responsive styles */
@media (max-width: 1440px) {
  .map-chart {
    width: 36%;
    min-width: 350px;
  }
  
  .map-container {
    max-width: 500px;
  }
}

@media (max-width: 1024px) {
  .map-chart {
    width: 100%;
    min-width: auto;
    order: -1;
  }
  
  .map-container {
    max-width: 100%;
    min-height: 350px;
  }
}

@media (max-width: 768px) {
  .map-chart {
    padding: 10px;
  }
  
  .map-container {
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .map-chart {
    padding: 8px;
  }
  
  .map-container {
    min-height: 250px;
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
