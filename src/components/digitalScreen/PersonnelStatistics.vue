<template>
  <div class="donut-wrapper" style="margin-top:-18px;">
    <div ref="echartsDom" style="width: 329px;height: 300px;"/>
  </div>
</template>

<script>
import echarts from 'echarts'
import { color } from 'echarts/lib/export'

export default {
  name: 'PersonStatistics',
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.echartsDom)
      const option = {
        color: ['#ff9f7f', '#47e9cc', '#37c9cc'], // 按设计调整主体块的颜色
        title: {
          text: '岗位占比',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#000',
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'Microsoft YaHei'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}人'
        },
        legend: {
          orient: 'horizontal',
          bottom: 20,
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            color: '#000',
            fontSize: 14,
            fontFamily: 'Microsoft YaHei'
          }
        },
        series: [
          {
            name: '人员统计',
            type: 'pie',
            radius: ['30%', '45%'],
            label: {
              show: true,
              fontSize: 14,
              color: 'black',
              fontFamily: 'Microsoft YaHei',
              formatter: '{name|{b}}\n{value|{c}}人',
              rich: {
                name: { color: 'black', fontSize: 14, fontFamily: 'Microsoft YaHei' },
                value: { color: '#47e9cc', fontSize: 18, fontFamily: 'Microsoft YaHei' }
              }
            },
            labelLine: {
              length: 10,
              length2: 20
            },
            data: [
              { value: 1, name: '项目负责人' },
              { value: 3, name: '现场维护人员' },
              { value: 1, name: '技术负责人' }
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
  background-color: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0px 4px 10px #a5c9ff;
}
</style>
