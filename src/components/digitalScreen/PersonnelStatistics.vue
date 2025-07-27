<template>
  <div class="donut-wrapper" style="margin-top:-18px;">
    <div ref="echartsDom" style="width: 329px;height: 300px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { getDigitalScreenData } from '@/api/digitalScreen'
export default {
  name: 'PersonStatistics',
  data() {
    return {
      chartData: [] // 用于存储岗位人员统计数据
    }
  },
  mounted() {
    this.fetchPersonStatistics()
    // this.initChart()
  },
  methods: {
    async fetchPersonStatistics() {
      try {
        const res = await getDigitalScreenData()
        if (res) {
          const stats = res.data.staffRoleStats
          // 更新 chartData
          this.chartData = [
            { value: stats.leaderCount, name: '项目负责人' },
            { value: stats.technicalCount, name: '技术负责人' },
            { value: stats.maintainerCount, name: '现场维护人员' }
          ]
          this.initChart()
        }
      } catch (e) {
        console.error('获取人员统计数据失败', e)
      }
    },
    initChart() {
      const chart = echarts.init(this.$refs.echartsDom)
      const option = {
        backgroundColor: 'rgba(0, 20, 40, 0.3)', // 深色背景
        color: [
          new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
            { offset: 0, color: '#00ffff' },
            { offset: 1, color: '#008bff' }
          ]),
          new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
            { offset: 0, color: '#00d9ff' },
            { offset: 1, color: '#007d99' }
          ]),
          new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
            { offset: 0, color: '#00ff90' },
            { offset: 1, color: '#00c27a' }
          ])
        ],
        title: {
          text: '岗位占比',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#00ffff',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Orbitron'
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderColor: '#00ffff',
          borderWidth: 1,
          textStyle: {
            color: '#00ffff',
            fontFamily: 'Orbitron'
          },
          formatter: '{b}<br/>{c}人 ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          textStyle: {
            color: '#00ffff',
            fontSize: 14,
            fontFamily: 'Orbitron'
          },
          itemWidth: 14,
          itemHeight: 14
        },
        series: [
          {
            name: '人员统计',
            type: 'pie',
            radius: ['35%', '55%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              color: '#ffffff',
              fontSize: 14,
              fontFamily: 'Orbitron',
              formatter: '{name|{b}}\n{value|{c}}人',
              rich: {
                name: { color: '#00ffff', fontSize: 14 },
                value: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' }
              }
            },
            labelLine: {
              length: 15,
              length2: 20,
              lineStyle: {
                color: '#00ffff'
              }
            },
            emphasis: {
              scale: true,
              itemStyle: {
                shadowBlur: 30,
                shadowColor: '#00ffff'
              }
            },
            data: this.chartData.length ? this.chartData : [
              { value: 0, name: '项目负责人' },
              { value: 0, name: '技术负责人' },
              { value: 0, name: '现场维护人员' }
            ]
          }
        ]
      }
      chart.setOption(option)
    }
  }
}
</script>

<style scoped>
.donut-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 20, 40, 0.3);
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0,255,255,0.6);
  border: 1px solid rgba(0,255,255,0.2);
}
</style>

