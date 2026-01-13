<template>
  <div ref="chartContainer" class="trend-chart"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'TrendChart',
  props: {
    data: {
      type: Array,
      default: () => []
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
      if (!this.chart || !this.data || this.data.length === 0) return

      const months = this.data.map(item => item.month.substring(5))
      const completed = this.data.map(item => item.completed)
      const faults = this.data.map(item => item.faults)
      const completionRates = this.data.map(item => parseFloat(item.completionRate))
      const transactionRates = this.data.map(item => {
        const rate = item.total > 0 ? (item.completed / item.total) * 100 : 0
        return parseFloat(rate.toFixed(2))
      })

      const option = {
        backgroundColor: 'transparent',
        grid: {
          left: '12%',
          right: '12%',
          top: '18%',
          bottom: '18%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderColor: '#00ffff',
          borderWidth: 2,
          textStyle: { 
            color: '#00ffff',
            fontSize: 20
          },
          padding: [12, 16],
          axisPointer: {
            type: 'cross',
            lineStyle: {
              width: 2,
              color: '#00ffff'
            }
          }
        },
        legend: {
          data: ['完成数量', '故障数量', '完成率', '成交率'],
          textStyle: {
            color: '#00ffff',
            fontSize: 22
          },
          top: 15,
          itemGap: 25,
          itemWidth: 20,
          itemHeight: 14
        },
        xAxis: {
          type: 'category',
          data: months,
          axisLine: {
            lineStyle: { 
              color: '#00ffff',
              width: 2
            }
          },
          axisLabel: {
            color: '#00ffff',
            fontSize: 18,
            margin: 12
          },
          nameTextStyle: {
            color: '#00ffff',
            fontSize: 20
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '数量',
            position: 'left',
            axisLine: {
              lineStyle: { 
                color: '#00ffff',
                width: 2
              }
            },
            axisLabel: {
              color: '#00ffff',
              fontSize: 18,
              formatter: '{value}',
              margin: 12
            },
            nameTextStyle: {
              color: '#00ffff',
              fontSize: 20
            },
            splitLine: {
              lineStyle: { 
                color: 'rgba(0, 255, 255, 0.15)',
                width: 1
              }
            }
          },
          {
            type: 'value',
            name: '百分比',
            position: 'right',
            axisLine: {
              lineStyle: { 
                color: '#00ff00',
                width: 2
              }
            },
            axisLabel: {
              color: '#00ff00',
              fontSize: 18,
              formatter: '{value}%',
              margin: 12
            },
            nameTextStyle: {
              color: '#00ff00',
              fontSize: 20
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '完成数量',
            type: 'bar',
            yAxisIndex: 0,
            data: completed,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#00c0ff' },
                { offset: 1, color: '#0088cc' }
              ])
            },
            barWidth: '40%',
            label: {
              show: false
            }
          },
          {
            name: '故障数量',
            type: 'bar',
            yAxisIndex: 0,
            data: faults,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ffcc5b' },
                { offset: 1, color: '#ff794b' }
              ])
            },
            barWidth: '40%',
            label: {
              show: false
            }
          },
          {
            name: '完成率',
            type: 'line',
            yAxisIndex: 1,
            data: completionRates,
            smooth: true,
            lineStyle: {
              color: '#00ff00',
              width: 4
            },
            itemStyle: {
              color: '#00ff00',
              borderWidth: 2
            },
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 255, 0, 0.3)' },
                { offset: 1, color: 'rgba(0, 255, 0, 0.05)' }
              ])
            },
            label: {
              show: false
            }
          },
          {
            name: '成交率',
            type: 'line',
            yAxisIndex: 1,
            data: transactionRates,
            smooth: true,
            lineStyle: {
              color: '#ff00ff',
              width: 4
            },
            itemStyle: {
              color: '#ff00ff',
              borderWidth: 2
            },
            symbolSize: 8,
            label: {
              show: false
            }
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
.trend-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
