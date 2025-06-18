<template>
  <div class="business-trend">
    <div ref="chart" style="width: 100%; height: 250px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { color } from 'echarts/lib/export'

export default {
  name: 'BusinessTrend',
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.chart
      const myChart = echarts.init(chartDom)

      const option = {
        // title: { text: '业务趋势', left: 'center' },rgba(0, 0, 0, 0.7)#00bcd4
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'black',
          textStyle: { color: '#ffffff' }
        },
        xAxis: {
          name: '月',
          type: 'category',
          data: ['0', '1', '2', '3', '4', '5', '6'],
          boundaryGap: false
        },
        yAxis: {
          name: '个数',
          type: 'value',
          splitLine: { show: false }
        },
        series: [
          {
            name: '数据量',
            type: 'line', // 折线图类型
            smooth: true,
            symbol: 'circle', // 数据点标记为圆形
            symbolSize: 6, // 数据点大小为8px
            itemStyle: {
              color: '#ffeb3b',
              borderWidth: 2,
              borderColor: '#00bcd4'
            },
            lineStyle: { // 线条样式
              width: 3,
              color: '#00bcd4',
              shadowColor: 'rgba(0,188,212,0.5)',
              shadowBlur: 10,
              shadowOffsetY: 3
            },
            areaStyle: { // 面积渐变效果
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(0, 188, 212, 0.7)' },
                  { offset: 1, color: 'rgba(0, 188, 212, 0.3)' }
                ]
              }
            },
            emphasis: { // 高亮样式
              itemStyle: {
                color: '#ffeb3b',
                borderColor: '#ff9800'
              }
            },
            data: [0, 3, 1, 0, 4, 4, 5]
            // markPoint: {
            //   data: [{
            //     type: 'max',
            //     name: '峰值',
            //     symbolOffset: [0, -20] // 上移标记点
            //   }],
            //   symbolSize: 25,
            //   label: {
            //     color: '#333',
            //     fontSize: 12,
            //     backgroundColor: '#ffeb3b',
            //     padding: [3, 5],
            //     borderRadius: 4
            //   }
            // }
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}

</script>

<style scoped>
.business-trend {
  background: linear-gradient(to bottom, rgb(240, 248, 255),rgb(173, 216, 230));
  width: 100%;
  height: auto;
}
</style>
