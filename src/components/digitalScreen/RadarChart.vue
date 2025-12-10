<template>
  <div ref="chartContainer" class="radar-chart"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'RadarChart',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
    this.updateChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer)
    },
    updateChart() {
      if (!this.chart || !this.data || Object.keys(this.data).length === 0) return

      const indicators = [
        { name: '完成率', max: 100 },
        { name: '健康度', max: 100 },
        { name: '准时率', max: 100 },
        { name: '响应率', max: 100 },
        { name: '效率', max: 100 },
        { name: '质量', max: 100 }
      ]

      const values = [
        parseFloat(this.data.completionRate || 0),
        parseFloat(this.data.healthRate || 0),
        parseFloat(this.data.onTimeRate || 0),
        parseFloat(this.data.responseRate || 0),
        parseFloat(this.data.efficiencyRate || 0),
        parseFloat(this.data.qualityRate || 0)
      ]

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#00ffff',
          borderWidth: 1,
          textStyle: { color: '#00ffff' }
        },
        radar: {
          center: ['50%', '55%'],
          radius: '70%',
          indicator: indicators,
          name: {
            textStyle: {
              color: '#00ffff',
              fontSize: 12
            }
          },
          splitArea: {
            areaStyle: {
              color: [
                'rgba(0, 192, 255, 0.1)',
                'rgba(0, 192, 255, 0.05)'
              ]
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 192, 255, 0.3)'
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 192, 255, 0.5)'
            }
          }
        },
        series: [
          {
            name: '综合评分',
            type: 'radar',
            data: [
              {
                value: values,
                name: '当前评分',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(0, 192, 255, 0.4)' },
                    { offset: 1, color: 'rgba(0, 192, 255, 0.1)' }
                  ])
                },
                lineStyle: {
                  color: '#00c0ff',
                  width: 2
                },
                itemStyle: {
                  color: '#00c0ff',
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 192, 255, 0.8)'
                }
              }
            ]
          }
        ]
      }

      this.chart.setOption(option, true)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped>
.radar-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
