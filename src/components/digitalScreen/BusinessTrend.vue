<template>
  <div class="business-trend">
    <div ref="chart" style="width: auto; height: 300px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { getDigitalScreenData } from '@/api/digitalScreen'
export default {
  name: 'BusinessTrend',
  data() {
    return {
      myChart: null,
      labels: [],
      baseData: [],
      pulseState: true,
      timer: null
    }
  },
  async mounted() {
    await this.fetchTrendData()
    this.$nextTick(() => {
      this.initChart()
      this.startPulseAnimation()
    })
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
    if (this.myChart) this.myChart.dispose()
  },
  methods: {
    async fetchTrendData() {
      try {
        const res = await getDigitalScreenData()
        if (res) {
          const trend = res.data.contractMonthlyCounts
          this.labels = trend.map(i => i.yearMonth)
          this.baseData = trend.map(i => i.count)
        }
      } catch (err) {
        console.error('获取趋势数据失败', err)
      }
    },
    initChart() {
      const chartDom = this.$refs.chart
      this.myChart = echarts.init(chartDom)

      const option = {
        backgroundColor: 'rgba(0, 20, 40, 0.3)', // 深色背景
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.8)',
          textStyle: { color: '#00ffff', fontFamily: 'Orbitron' }
        },
        xAxis: {
          name: '月',
          type: 'category',
          data: this.labels,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#00ffff', width: 2 }},
          axisLabel: { color: '#00ffff', fontFamily: 'Orbitron' },
          splitLine: { show: false }
        },
        yAxis: {
          name: '个数',
          type: 'value',
          min: 0,
          max: 20,
          interval: 5,
          axisLine: { lineStyle: { color: '#00ffff', width: 2 }},
          axisLabel: { color: '#00ffff', fontFamily: 'Orbitron' },
          splitLine: { lineStyle: { color: 'rgba(0,255,255,0.1)' }}
        },
        series: [
          {
            name: '合同签订数',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#00ffff',
              borderColor: '#00ffff',
              shadowBlur: 10,
              shadowColor: '#00ffff'
            },
            lineStyle: {
              width: 3,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#00ffff' },
                { offset: 1, color: '#00bcd4' }
              ]),
              shadowColor: 'rgba(0,255,255,0.5)',
              shadowBlur: 15
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0,255,255,0.4)' },
                { offset: 1, color: 'rgba(0,255,255,0)' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: '#ffffff',
                borderColor: '#00ffff',
                borderWidth: 2,
                shadowBlur: 20,
                shadowColor: '#00ffff'
              }
            },
            data: this.baseData
          }
        ]
      }
      this.myChart.setOption(option)
    },
    startPulseAnimation() {
      this.timer = setInterval(() => {
        // 1. 切换脉冲大小
        this.pulseState = !this.pulseState
        const pulseSize = this.pulseState ? 8 : 12

        // 2. 更新数据点大小，保持线条不动
        this.myChart.setOption({
          series: [
            {
              data: this.baseData,
              symbolSize: pulseSize // 通过 symbolSize 改变数据点大小
            }
          ]
        })
      }, 500) // 每0.5秒更新一次数据点大小
    }
  }
}
</script>

<style scoped>
.business-trend {
  width: auto;
  background: rgba(0, 20, 40, 0.3);
  border: 1px solid rgba(0,255,255,0.2);
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(0,255,255,0.2);
  padding: 8px;
}
</style>
