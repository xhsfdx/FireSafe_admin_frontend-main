<template>
  <div ref="chartContainer" class="donut-chart"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'DonutChart',
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

      const chartData = this.data.map(item => ({
        value: item.value,
        name: item.name
      }))

      const colors = this.data.map(item => item.color || '#00c0ff')

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#00ffff',
          borderWidth: 1,
          textStyle: { color: '#00ffff' },
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            color: '#00ffff',
            fontSize: 12
          },
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 10
        },
        series: [
          {
            name: '任务分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#000',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outside',
              color: '#00ffff',
              fontSize: 12,
              formatter: '{b}\n{d}%'
            },
            labelLine: {
              show: true,
              lineStyle: {
                color: '#00ffff'
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 240, 255, 0.8)'
              }
            },
            data: chartData,
            color: colors
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
.donut-chart {
  width: 100%;
  height: 100%;
  min-height: 250px;
}
</style>
