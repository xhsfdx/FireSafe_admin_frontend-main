<template>
  <div class="map-chart">
    <!-- 总面积组件 -->
    <TotalmaintenceArea />

    <!-- 地图容器 -->
    <div id="map-container" class="map-container" />

    <!-- 科幻光圈 -->
    <div class="sci-fi-radar">
      <div class="circle circle1" />
      <div class="circle circle2" />
      <div class="circle circle3" />
      <div class="pulse" />
    </div>
  </div>
</template>

<script>
import TotalmaintenceArea from '@/components/digitalScreen/TotalmaintenanceArea.vue'
import echarts from 'echarts'
import sichuan from '@/assets/geo/sichuan.json'
import { getDigitalScreenData } from '@/api/digitalScreen'

export default {
  name: 'MapChart',
  components: {
    TotalmaintenceArea
  },
  data() {
    return {
      mapData: [], // 用于存储地图数据
      chart: null
    }
  },
  async mounted() {
    echarts.registerMap('四川', sichuan)
    this.chart = echarts.init(document.getElementById('map-container'))
    await this.loadData()
    this.renderMap()
    window.addEventListener('resize', this.chart.resize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.chart.resize)
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
          max: 20,
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#3aa9ff', '#001f3f']
          },
          textStyle: {
            color: '#00ffff'
          }
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
              borderWidth: 1,
              shadowColor: '#00ffff',
              shadowBlur: 25
            },
            emphasis: {
              label: { show: true, color: '#ffff00' },
              itemStyle: { areaColor: '#0077aa', shadowColor: '#00ffff', shadowBlur: 40 }
            },
            data: this.mapData
          }
        ]
      }
      this.chart.setOption(option)
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
  width: 70%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 20, 40, 0.6);
  position: relative;
}
.map-container {
  width: 550px;
  height: 550px;
  border: none;
  border-radius: 12px;
  margin-top: 10px;
  align-items: center;
  margin-right: -20px;
  /* box-shadow: 0 0 30px #00c0ff inset; */
}

/* 科幻立体光圈容器 */
/* 立体光圈容器 */
.sci-fi-radar {
  position: relative;
  width: 400px;
  height: 400px;
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
