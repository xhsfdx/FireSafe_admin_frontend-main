<template>
  <div class="top10-container">
    <!-- Canvas 星空背景 -->
    <canvas ref="starCanvas" class="star-canvas" />
    <!-- 排行表 -->
    <div class="top10-table">
      <div class="header">
        <span>排名</span>
        <span>姓名</span>
        <span>完成量(单)</span>
        <span>维保面积(㎡)</span>
        <span>综合得分</span>
      </div>
      <ul>
        <li v-for="(item, index) in list" :key="item.name">
          <span>{{ index + 1 }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.completed }}</span>
          <span>{{ item.area }}</span>
          <span>{{ item.score }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getDigitalScreenData } from '@/api/digitalScreen'
export default {
  name: 'ComprehensiveRanking',
  data() {
    return {
      list: [],
      stars: []
    }
  },
  mounted() {
    this.initCanvas()
    window.addEventListener('resize', this.resizeCanvas)
    this.fetchTop5Maintainers()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCanvas)
    cancelAnimationFrame(this.animationId)
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.starCanvas
      const ctx = canvas.getContext('2d')

      const resize = () => {
        canvas.width = this.$el.clientWidth
        canvas.height = this.$el.clientHeight
      }
      resize()
      this.resizeCanvas = resize

      // 创建星星
      const starCount = 80
      this.stars = []
      for (let i = 0; i < starCount; i++) {
        this.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.2,
          dy: (Math.random() - 0.5) * 0.2,
          opacity: Math.random(),
          dOpacity: (Math.random() - 0.5) * 0.02
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const star of this.stars) {
          // 移动
          star.x += star.dx
          star.y += star.dy
          if (star.x < 0) star.x = canvas.width
          if (star.x > canvas.width) star.x = 0
          if (star.y < 0) star.y = canvas.height
          if (star.y > canvas.height) star.y = 0

          // 闪烁
          star.opacity += star.dOpacity
          if (star.opacity <= 0) {
            star.opacity = 0
            star.dOpacity = -star.dOpacity
          }
          if (star.opacity >= 1) {
            star.opacity = 1
            star.dOpacity = -star.dOpacity
          }

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${star.opacity})`
          ctx.fill()
        }

        this.animationId = requestAnimationFrame(animate)
      }

      animate()
    },
    async fetchTop5Maintainers() {
      try {
        const res = await getDigitalScreenData()
        if (res?.data?.maintainerStats) {
          this.list = res.data.maintainerStats.map(item => ({
            name: item.staffName,
            completed: item.taskCount,
            area: item.totalArea,
            score: item.totalScore
          }))
        }
      } catch (err) {
        console.error('获取Top维保人员数据失败：', err)
      }
    }
  }
}
</script>

<style scoped>
.top10-container {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}

/* Canvas 背景 */
.star-canvas {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: rgba(0, 20, 40, 0.3);
}

/* 表格 */
.top10-table {
  position: relative;
  z-index: 1;
  width: 400px;
  margin: 0 auto;
  background: rgba(0, 0, 20, 0.6);
  padding: 20px;
  border-radius: 10px;
  font-size: 14px;
  color: #00f7ff;
  box-shadow: 0 0 20px rgba(0, 247, 255, 0.3);
}

.top10-table .header,
.top10-table ul li {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 2fr 2fr;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 247, 255, 0.2);
}
.top10-table .header {
  font-weight: bold;
  color: #00f7ff;
  background: rgba(0, 31, 63, 0.8);
}
.top10-table ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.top10-table ul li {
  background: rgba(0, 0, 30, 0.3);
}
.top10-table ul li:nth-child(1) {
  background: rgba(0, 255, 255, 0.1);
}
.top10-table ul li:nth-child(2) {
  background: rgba(0, 255, 255, 0.05);
}
.top10-table ul li:nth-child(3) {
  background: rgba(0, 255, 255, 0.02);
}
</style>
