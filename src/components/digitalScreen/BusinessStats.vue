<template>
  <div class="business-stats">
    <div class="header">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        :class="{'active': activeTab === item}"
        @click="activeTab = item"
      >
        {{ item }}
      </span>
    </div>

    <div class="chart-and-info">
      <div ref="echarts" class="echarts" />
      <div class="info">
        <div v-for="item in tabStatuses[activeTab]" :key="item.name" class="info-item">
          <span :style="{ background: item.color }" class="dot" />{{ item.name }}
          <span>{{ item.value }}</span>条
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { active } from 'sortablejs'

export default {
  name: 'BusinessStats',
  data() {
    return {
      activeTab: '例行维护',
      tabs: ['例行维护', '故障工单', '附加维护'],
      tabStatuses: {
        '例行维护': [
          { name: '待处理', color: '#ff794b', value: 3 },
          { name: '处理中', color: '#ffcc5b', value: 0 },
          { name: '待审批', color: '#47c9ff', value: 0 },
          { name: '已完成', color: '#39f5ff', value: 2 }
        ],
        '故障工单': [
          { name: '待处理', color: '#ff794b', value: 5 },
          { name: '处理中', color: '#ffcc5b', value: 2 },
          { name: '待审批', color: '#47c9ff', value: 1 },
          { name: '已完成', color: '#39f5ff', value: 10 }
        ],
        '附加维护': [
          { name: '待处理', color: '#ff794b', value: 0 },
          { name: '处理中', color: '#ffcc5b', value: 0 },
          { name: '待审批', color: '#47c9ff', value: 0 },
          { name: '已完成', color: '#39f5ff', value: 4 }
        ]
      },
      chart: null
    }
  },
  watch: {
    activeTab() {
      this.updateChart()
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.echarts)
      this.updateChart()
    },
    updateChart() {
      if (!this.chart) return
      this.chart.setOption(this.getOption(), true)
    },
    getOption() {
      const data = this.tabStatuses[this.activeTab]
      const finished = data.find(item => item.name === '已完成')?.value || 0
      const total = data.reduce((sum, item) => sum + item.value, 0)
      const percent = total > 0 ? Math.round((finished / total) * 100) : 0
      return {
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: { show: false },
            data: [
              { value: percent, itemStyle: { color: '#39f5ff' }},
              { value: 100 - percent, itemStyle: { color: '#ff794b' }}
            ]
          }
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: `${percent}%\n完成率`,
              color: '#000',
              fontSize: 16,
              align: 'center'
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.business-stats {
  padding: 20px;
  background: #f7f7f8;
}
.header {
  margin-bottom: 20px;
}
.header span {
  margin-right: 10px;
  padding-bottom: 5px;
  cursor: pointer;
  color: grey;
}
.header .active {
  color: #39f5ff;
  border-bottom: 2px solid #39f5ff;
}

.chart-and-info {
  display: flex;
  align-items: center;
  color: grey;
}

.echarts {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.info {
  /* margin-left: 30px; */
  margin-right: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-shrink: 0;
  /* margin-right: 150px; */
  margin-left: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-block;
}
</style>
