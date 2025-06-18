<template>
  <div class="map-chart">
    <!-- <div class="map-title">维保总面积</div>
    <div class="map-value">0102500 ㎡</div> -->
    <TotalmaintenceArea />
    <div id="map-container" class="map-container" />
  </div>
</template>

<script>
import TotalmaintenceArea from '@/components/digitalScreen/TotalmaintenanceArea.vue'
import echarts from 'echarts'
import nanchong from '@/assets/geo/nanchong.json' // 如使用自定义地图请改为 registerMap

export default {
  name: 'MapChart',
  components: {
    TotalmaintenceArea
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      const myChart = echarts.init(document.getElementById('map-container'))
      echarts.registerMap('南充', nanchong)
      const data = [
        { name: '顺庆区', value: 12, area: 0.25 },
        { name: '高坪区', value: 8, area: 0.18 },
        { name: '嘉陵区', value: 5, area: 0.1 },
        { name: '南部区', value: 4, area: 0.08 },
        { name: '仪陇区', value: 6, area: 0.12 }
        // 可添加更多市
      ]

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: params => {
            const data = params.data || {}
            return `
              ${params.name}<br/>
              单位数：${data.value || 0} 家<br/>
              维保面积：${data.area || 0} 万㎡
            `
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
            color: ['#9bd8ff', '#006edd']
          },
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '南充市维保地图',
            type: 'map',
            map: '南充',
            roam: false,
            label: {
              show: true,
              color: '#fff',
              fontSize: 12
            },
            itemStyle: {
              areaColor: '#003366',
              borderColor: '#38a5f5',
              borderWidth: 1
            },
            emphasis: {
              label: {
                show: true,
                color: '#ffff00'
              },
              itemStyle: {
                areaColor: '#4ecaff'
              }
            },
            data
          }
        ]
      }

      myChart.setOption(option)

      // 地图点击事件（可拓展）
      myChart.on('click', params => {
        console.log(`点击了：${params.name}`)
        // 可跳转或触发其他图表联动
      })

      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style scoped>
.map-chart {
  width: 50%;
  padding: 10px 10px;
  /* padding-bottom: 10px; */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.map-title {
  font-size: 20px;
  font-weight: bold;
  color: #00c0ff;
  margin-top: 10px;
}
.map-value {
  font-size: 36px;
  color: #00ffff;
  margin-bottom: 10px;
}
.map-container {
  width: 100%;
  height: 550px;
  border: 2px solid #006edd;
  border-radius: 12px;
  margin-top: 10px;
}
</style>
