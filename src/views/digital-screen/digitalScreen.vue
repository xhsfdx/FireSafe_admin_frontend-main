<template>
  <div class="big-screen" ref="bigScreen">
    <!-- Animated background -->
    <div class="animated-background">
      <div class="hex-grid"></div>
      <div class="glow-lines"></div>
    </div>
    
    <!-- Main Title -->
    <div class="main-title">
      <div class="title-text">不凡消防技术服务管理系统</div>
      <div class="title-subtitle">FireSafe Maintenance Management System</div>
      <div class="current-time">{{ currentDateTime }}</div>
    </div>

    <!-- Grid Layout -->
    <div class="dashboard-grid">
      <!-- Top Left: City Enterprise Data & Map -->
      <div class="panel panel-large panel-tl">
        <div class="panel-header">
          <span class="panel-title">城市维保大数据</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="big-numbers-row">
            <div class="big-number-item">
              <div class="number-label">业主单位总数</div>
              <div class="big-number">{{ formatNumber(screenData.ownerCompanyTotal || 0) }}</div>
              <div class="number-unit">家</div>
            </div>
            <div class="big-number-item">
              <div class="number-label">今日打卡</div>
              <div class="big-number">{{ formatNumber(screenData.todayChecked || 0) }}</div>
            </div>
            <div class="big-number-item">
              <div class="number-label">今日完成</div>
              <div class="big-number">{{ formatNumber(screenData.todayCompleted || 0) }}</div>
            </div>
            <div class="big-number-item">
              <div class="number-label">今日评价</div>
              <div class="big-number">{{ formatNumber(screenData.todayReviews || 0) }}</div>
            </div>
          </div>
          <MapChart ref="mapChart" class="map-container" />
        </div>
      </div>

      <!-- Top Middle: Central Cityscape with Overlays -->
      <div class="panel panel-large panel-tm">
        <div class="panel-header">
          <span class="panel-title">维保运营大数据</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content cityscape-bg">
          <div class="overlay-cards">
            <div class="overlay-card">
              <div class="card-title">例行维保大数据</div>
              <div class="progress-item">
                <span>本月完成率</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: screenData.maintainCompletionRate + '%' }"></div>
                  <span class="progress-text">{{ screenData.maintainCompletionRate }}%</span>
                </div>
              </div>
            </div>
            <div class="overlay-card">
              <div class="card-title">故障工单大数据</div>
              <div class="progress-item">
                <span>完成率</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: screenData.faultCompletionRate + '%' }"></div>
                  <span class="progress-text">{{ screenData.faultCompletionRate }}%</span>
                </div>
              </div>
            </div>
            <div class="overlay-card">
              <div class="card-title">设备健康度</div>
              <div class="progress-item">
                <span>检测达标率</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: ((screenData.healthData && screenData.healthData.healthRate) || 100) + '%' }"></div>
                  <span class="progress-text">{{ (screenData.healthData && screenData.healthData.healthRate) || 100 }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="data-sources">
            <div class="source-tag">例行维保系统</div>
            <div class="source-tag">故障工单系统</div>
            <div class="source-tag">设备检测系统</div>
            <div class="source-tag">人员管理系统</div>
            <div class="source-tag">合同管理系统</div>
            <div class="source-tag">评价反馈系统</div>
          </div>
        </div>
      </div>

      <!-- Top Right: Performance and Trend Analysis -->
      <div class="panel panel-large panel-tr">
        <div class="panel-header">
          <span class="panel-title">维保趋势分析</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="metrics-row">
            <div class="metric-card">
              <div class="metric-value">{{ formatNumber(screenData.thisMonthInspections || 0) }}</div>
              <div class="metric-label">本月巡检</div>
              <div class="metric-change positive">对比上月 {{ screenData.monthOverMonthGrowth || 0 }}%</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{{ (screenData.healthData && screenData.healthData.healthRate) || 100 }}%</div>
              <div class="metric-label">本月检测达标率</div>
              <div class="metric-change positive">对比上月 {{ (screenData.healthData && screenData.healthData.healthMonthOverMonth) || 0 }}%</div>
            </div>
          </div>
          <TrendChart ref="trendChart" :data="screenData.monthlyTrendData || []" />
        </div>
      </div>

      <!-- Bottom Left: Industrial Data & Distribution -->
      <div class="panel panel-large panel-bl">
        <div class="panel-header">
          <span class="panel-title">维保任务分布</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="distribution-stats">
            <div class="stat-item">
              <span class="stat-label">库内项目数</span>
              <span class="stat-value">{{ formatNumber(screenData.ownerCompanyTotal || 0) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">任务类型</span>
              <span class="stat-value">{{ (screenData.taskTypeDistribution && screenData.taskTypeDistribution.length) || 3 }} 种</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">活跃项目</span>
              <span class="stat-value">{{ formatNumber((screenData.maintainFinishedCount || 0) + (screenData.maintainProcessingCount || 0)) }}</span>
            </div>
          </div>
          <DonutChart ref="donutChart" :data="screenData.taskTypeDistribution || []" />
        </div>
      </div>

      <!-- Bottom Middle: Data Center Assets & Technology Stack -->
      <div class="panel panel-large panel-bm">
        <div class="panel-header">
          <span class="panel-title">维保数据中心总资产</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="mega-number">
            <div class="mega-number-value">{{ formatLargeNumber(screenData.warrantyAreaTotal || 0) }}</div>
            <div class="mega-number-unit">m²</div>
          </div>
          <div class="tech-stack">
            <div class="tech-item">分布式部署</div>
            <div class="tech-item">MongoDB</div>
            <div class="tech-item">Node.js</div>
            <div class="tech-item">Vue.js</div>
            <div class="tech-item">ECharts</div>
            <div class="tech-item">微服务</div>
          </div>
          <div class="interface-stats">
            <div class="interface-item">
              <span class="interface-label">数据接口数</span>
              <span class="interface-value">{{ (screenData.cityStats && screenData.cityStats.length) || 0 }} 个</span>
            </div>
            <div class="interface-item">
              <span class="interface-label">成功接入</span>
              <span class="interface-value">{{ formatNumber(screenData.ownerCompanyTotal || 0) }} 家</span>
            </div>
            <div class="interface-item">
              <span class="interface-label">数据入库数</span>
              <span class="interface-value">{{ formatLargeNumber(screenData.warrantyAreaTotal || 0) }} m²</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Right: Competitive Analysis & Specific Metrics -->
      <div class="panel panel-large panel-br">
        <div class="panel-header">
          <span class="panel-title">综合评分分析</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="radar-stats">
            <div class="radar-stat-item">
              <span class="radar-label">系统</span>
              <span class="radar-value">{{ screenData.ownerCompanyTotal || 0 }}</span>
            </div>
            <div class="radar-stat-item">
              <span class="radar-label">历史数据</span>
              <span class="radar-value">{{ formatNumber(screenData.maintainFinishedCount || 0) }}</span>
            </div>
            <div class="radar-stat-item">
              <span class="radar-label">数据入库</span>
              <span class="radar-value">{{ formatLargeNumber(screenData.warrantyAreaTotal || 0) }}</span>
            </div>
          </div>
          <RadarChart ref="radarChart" :data="screenData.radarData || {}" />
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="nav-menu-container">
      <div class="nav-menu-button" @click="toggleNavMenu" title="导航菜单">
        <i class="el-icon-menu"></i>
        <span class="nav-text">菜单</span>
      </div>
      <transition name="menu-fade">
        <div v-if="showNavMenu" class="nav-menu-dropdown">
          <div class="nav-menu-item" @click="navigateTo('/')">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </div>
          <div class="nav-menu-item" @click="navigateTo('/agency/basic')">
            <i class="el-icon-office-building"></i>
            <span>服务机构管理</span>
          </div>
          <div class="nav-menu-item" @click="navigateTo('/owner/plan')">
            <i class="el-icon-s-custom"></i>
            <span>项目管理</span>
          </div>
          <div class="nav-menu-item" @click="navigateTo('/maintenance/routine')">
            <i class="el-icon-setting"></i>
            <span>例行维护</span>
          </div>
          <div class="nav-menu-item" @click="navigateTo('/maintenance/fault')">
            <i class="el-icon-warning"></i>
            <span>故障工单</span>
          </div>
          <div class="nav-menu-divider"></div>
          <div class="nav-menu-item exit-item" @click="exitDigitalScreen">
            <i class="el-icon-close"></i>
            <span>退出数字大屏</span>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Click outside to close menu -->
    <div v-if="showNavMenu" class="menu-overlay" @click="showNavMenu = false"></div>

    <!-- Fullscreen indicator -->
    <div v-if="fullscreenCountdown > 0" class="fullscreen-countdown">
      全屏模式将在 {{ fullscreenCountdown }} 秒后启动
    </div>
  </div>
</template>

<script>
import MapChart from '@/components/digitalScreen/MapChart.vue'
import TrendChart from '@/components/digitalScreen/TrendChart.vue'
import DonutChart from '@/components/digitalScreen/DonutChart.vue'
import RadarChart from '@/components/digitalScreen/RadarChart.vue'
import { getDigitalScreenData } from '@/api/digitalScreen'

export default {
  name: 'DigitalScreen',
  components: {
    MapChart,
    TrendChart,
    DonutChart,
    RadarChart
  },
  data() {
    return {
      fullscreenCountdown: 15,
      countdownTimer: null,
      dataRefreshTimer: null,
      isFullscreen: false,
      currentDateTime: '',
      screenData: {},
      showNavMenu: false
    }
  },
  mounted() {
    this.updateDateTime()
    this.datetimeTimer = setInterval(this.updateDateTime, 1000)
    this.startFullscreenCountdown()
    this.setupDataRefresh()
    this.hideLayoutElements()
    this.loadScreenData()
  },
  beforeDestroy() {
    this.cleanup()
  },
  methods: {
    updateDateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = ('0' + (now.getMonth() + 1)).slice(-2)
      const day = ('0' + now.getDate()).slice(-2)
      const hours = ('0' + now.getHours()).slice(-2)
      const minutes = ('0' + now.getMinutes()).slice(-2)
      const seconds = ('0' + now.getSeconds()).slice(-2)
      this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    startFullscreenCountdown() {
      this.countdownTimer = setInterval(() => {
        this.fullscreenCountdown--
        if (this.fullscreenCountdown <= 0) {
          clearInterval(this.countdownTimer)
          this.enterFullscreen()
        }
      }, 1000)
    },
    enterFullscreen() {
      const elem = this.$refs.bigScreen || document.documentElement
      if (!elem) return

      try {
        if (elem.requestFullscreen) {
          elem.requestFullscreen().then(() => {
            this.isFullscreen = true
            this.fullscreenCountdown = 0
          }).catch(err => {
            console.error('Fullscreen error:', err)
          })
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen()
          this.isFullscreen = true
          this.fullscreenCountdown = 0
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen()
          this.isFullscreen = true
          this.fullscreenCountdown = 0
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen()
          this.isFullscreen = true
          this.fullscreenCountdown = 0
        }
        
        document.addEventListener('fullscreenchange', this.handleFullscreenChange)
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange)
        document.addEventListener('mozfullscreenchange', this.handleFullscreenChange)
        document.addEventListener('MSFullscreenChange', this.handleFullscreenChange)
      } catch (error) {
        console.error('Failed to enter fullscreen:', error)
      }
    },
    handleFullscreenChange() {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      this.isFullscreen = isFullscreen
      if (!isFullscreen) {
        this.fullscreenCountdown = 0
      }
    },
    setupDataRefresh() {
      this.dataRefreshTimer = setInterval(() => {
        this.loadScreenData()
      }, 30000)
    },
    async loadScreenData() {
      try {
        const res = await getDigitalScreenData()
        if (res && res.data) {
          this.screenData = res.data
          this.$nextTick(() => {
            this.refreshCharts()
          })
        }
      } catch (err) {
        console.error('获取数字屏数据失败:', err)
      }
    },
    refreshCharts() {
      if (this.$refs.mapChart && this.$refs.mapChart.loadData) {
        this.$refs.mapChart.loadData().then(() => {
          if (this.$refs.mapChart.renderMap) {
            this.$refs.mapChart.renderMap()
          }
        })
      }
      if (this.$refs.trendChart && this.$refs.trendChart.updateChart) {
        this.$refs.trendChart.updateChart()
      }
      if (this.$refs.donutChart && this.$refs.donutChart.updateChart) {
        this.$refs.donutChart.updateChart()
      }
      if (this.$refs.radarChart && this.$refs.radarChart.updateChart) {
        this.$refs.radarChart.updateChart()
      }
    },
    hideLayoutElements() {
      document.body.classList.add('digital-screen-active')
    },
    showLayoutElements() {
      document.body.classList.remove('digital-screen-active')
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    formatLargeNumber(num) {
      if (num >= 100000000) {
        return (num / 100000000).toFixed(2) + '亿'
      } else if (num >= 10000) {
        return (num / 10000).toFixed(2) + '万'
      }
      return this.formatNumber(num)
    },
    cleanup() {
      if (this.countdownTimer) clearInterval(this.countdownTimer)
      if (this.dataRefreshTimer) clearInterval(this.dataRefreshTimer)
      if (this.datetimeTimer) clearInterval(this.datetimeTimer)
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange)
      this.showLayoutElements()
      if (this.isFullscreen) {
        this.exitFullscreen()
      }
    },
    exitFullscreen() {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.isFullscreen = false
      } catch (error) {
        console.error('Failed to exit fullscreen:', error)
      }
    },
    exitDigitalScreen() {
      // Close menu if open
      this.showNavMenu = false
      
      // Stop countdown if still running
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
      
      // Exit fullscreen if active
      if (this.isFullscreen) {
        this.exitFullscreen()
      }
      
      // Show layout elements
      this.showLayoutElements()
      
      // Navigate to dashboard or home
      this.$router.push({ path: '/dashboard' }).catch(err => {
        // If dashboard doesn't exist, try root
        if (err.name !== 'NavigationDuplicated') {
          this.$router.push({ path: '/' })
        }
      })
    },
    toggleNavMenu() {
      this.showNavMenu = !this.showNavMenu
    },
    navigateTo(path) {
      this.showNavMenu = false
      
      // Exit fullscreen if active
      if (this.isFullscreen) {
        this.exitFullscreen()
      }
      
      // Show layout elements
      this.showLayoutElements()
      
      // Navigate to the selected path
      this.$router.push({ path }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err)
        }
      })
    }
  }
}
</script>

<style scoped>
.big-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #000428 0%, #001f3f 50%, #000428 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  color: #fff;
  overflow: hidden;
  position: relative;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Animated Background */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.hex-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(0, 192, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
  opacity: 0.3;
}

.glow-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(90deg, transparent 0%, rgba(0, 192, 255, 0.1) 50%, transparent 100%),
    linear-gradient(0deg, transparent 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%);
  animation: lineMove 15s linear infinite;
}

@keyframes lineMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(100px, 100px); }
}

/* Main Title */
.main-title {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(180deg, rgba(0, 20, 40, 0.8) 0%, transparent 100%);
}

.title-text {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 
    0 0 20px rgba(0, 240, 255, 0.8),
    0 0 40px rgba(0, 240, 255, 0.6),
    0 0 60px rgba(0, 240, 255, 0.4);
  letter-spacing: 4px;
  margin-bottom: 5px;
}

.title-subtitle {
  font-size: clamp(12px, 1.5vw, 18px);
  color: rgba(0, 240, 255, 0.7);
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.current-time {
  font-size: clamp(14px, 1.8vw, 20px);
  color: #00f0ff;
  font-family: 'Orbitron', monospace;
  letter-spacing: 2px;
}

/* Dashboard Grid */
.dashboard-grid {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  padding: 15px;
  height: calc(100vh - 120px);
}

.panel {
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.85) 0%, rgba(0, 40, 80, 0.75) 100%);
  border: 2px solid rgba(0, 192, 255, 0.3);
  border-radius: 8px;
  box-shadow: 
    0 0 30px rgba(0, 192, 255, 0.3),
    inset 0 0 30px rgba(0, 192, 255, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.panel:hover {
  border-color: rgba(0, 192, 255, 0.6);
  box-shadow: 
    0 0 40px rgba(0, 192, 255, 0.5),
    inset 0 0 40px rgba(0, 192, 255, 0.15);
}

.panel-header {
  padding: 12px 20px;
  border-bottom: 1px solid rgba(0, 192, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(0, 192, 255, 0.1) 0%, transparent 100%);
}

.panel-title {
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
  letter-spacing: 2px;
}

.panel-decoration {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f0ff, transparent);
  box-shadow: 0 0 10px #00f0ff;
}

.panel-content {
  padding: 20px;
  height: calc(100% - 50px);
  overflow: auto;
}

/* Big Numbers */
.big-numbers-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.big-number-item {
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 192, 255, 0.2);
}

.number-label {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 8px;
}

.big-number {
  font-size: clamp(20px, 2.5vw, 32px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.8);
  font-family: 'Orbitron', monospace;
}

.number-unit {
  font-size: 14px;
  color: rgba(0, 240, 255, 0.6);
  margin-top: 5px;
}

.map-container {
  height: calc(100% - 120px);
  min-height: 300px;
}

/* Cityscape Background */
.cityscape-bg {
  background: 
    radial-gradient(ellipse at center, rgba(0, 192, 255, 0.1) 0%, transparent 70%),
    linear-gradient(135deg, rgba(0, 20, 40, 0.5) 0%, rgba(0, 40, 80, 0.3) 100%);
  position: relative;
}

.overlay-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.overlay-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 192, 255, 0.3);
  border-radius: 8px;
  padding: 15px;
  backdrop-filter: blur(5px);
}

.card-title {
  font-size: 14px;
  color: #00f0ff;
  margin-bottom: 10px;
  font-weight: bold;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-item span {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  min-width: 80px;
}

.progress-bar {
  flex: 1;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(0, 192, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00c0ff, #00f0ff);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #00f0ff;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.8);
}

.data-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.source-tag {
  padding: 6px 12px;
  background: rgba(0, 192, 255, 0.2);
  border: 1px solid rgba(0, 192, 255, 0.4);
  border-radius: 15px;
  font-size: 12px;
  color: rgba(0, 240, 255, 0.9);
}

/* Metrics Row */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.metric-card {
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 192, 255, 0.2);
}

.metric-value {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.8);
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 5px;
}

.metric-change {
  font-size: 11px;
  color: #00ff00;
}

.metric-change.positive {
  color: #00ff00;
}

.metric-change.negative {
  color: #ff6b6b;
}

/* Distribution Stats */
.distribution-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

/* Mega Number */
.mega-number {
  text-align: center;
  margin: 30px 0;
}

.mega-number-value {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 
    0 0 20px rgba(0, 240, 255, 1),
    0 0 40px rgba(0, 240, 255, 0.8),
    0 0 60px rgba(0, 240, 255, 0.6);
  font-family: 'Orbitron', monospace;
  letter-spacing: 2px;
}

.mega-number-unit {
  font-size: clamp(20px, 3vw, 32px);
  color: rgba(0, 240, 255, 0.8);
  margin-top: 10px;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.tech-item {
  padding: 8px 15px;
  background: rgba(0, 192, 255, 0.2);
  border: 1px solid rgba(0, 192, 255, 0.4);
  border-radius: 20px;
  font-size: 12px;
  color: rgba(0, 240, 255, 0.9);
}

.interface-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.interface-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(0, 192, 255, 0.2);
}

.interface-label {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
}

.interface-value {
  font-size: 14px;
  font-weight: bold;
  color: #00f0ff;
}

/* Radar Stats */
.radar-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.radar-stat-item {
  text-align: center;
}

.radar-label {
  display: block;
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 5px;
}

.radar-value {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #00f0ff;
}

/* Navigation Menu */
.nav-menu-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10002;
}

.nav-menu-button {
  background: linear-gradient(135deg, rgba(0, 192, 255, 0.9) 0%, rgba(0, 136, 204, 0.9) 100%);
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 0 20px rgba(0, 192, 255, 0.6),
    inset 0 0 10px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-family: 'Microsoft YaHei', sans-serif;
}

.nav-menu-button:hover {
  background: linear-gradient(135deg, rgba(0, 220, 255, 1) 0%, rgba(0, 160, 220, 1) 100%);
  box-shadow: 
    0 0 30px rgba(0, 192, 255, 0.9),
    inset 0 0 15px rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.5);
}

.nav-menu-button:active {
  transform: translateY(0);
}

.nav-menu-button i {
  font-size: 18px;
}

.nav-text {
  letter-spacing: 1px;
}

.nav-menu-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.95) 0%, rgba(0, 40, 80, 0.95) 100%);
  border: 2px solid rgba(0, 192, 255, 0.5);
  border-radius: 8px;
  box-shadow: 
    0 0 30px rgba(0, 192, 255, 0.6),
    inset 0 0 20px rgba(0, 192, 255, 0.1);
  backdrop-filter: blur(15px);
  min-width: 200px;
  padding: 8px 0;
  overflow: hidden;
}

.nav-menu-item {
  padding: 12px 20px;
  color: #00f0ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-menu-item:hover {
  background: rgba(0, 192, 255, 0.2);
  border-left-color: #00f0ff;
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
}

.nav-menu-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.nav-menu-item.exit-item {
  color: #ff6b6b;
  border-top: 1px solid rgba(0, 192, 255, 0.3);
  margin-top: 4px;
  padding-top: 16px;
}

.nav-menu-item.exit-item:hover {
  background: rgba(255, 77, 77, 0.2);
  border-left-color: #ff6b6b;
  color: #ff9999;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

.nav-menu-divider {
  height: 1px;
  background: rgba(0, 192, 255, 0.3);
  margin: 8px 0;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
  background: transparent;
}

.menu-fade-enter-active, .menu-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu-fade-enter, .menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fullscreen Countdown */
.fullscreen-countdown {
  position: fixed;
  top: 20px;
  right: 80px;
  background: rgba(0, 0, 0, 0.8);
  color: #00ffff;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  z-index: 10000;
  font-family: 'Orbitron', sans-serif;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Responsive */
@media (max-width: 1920px) {
  .dashboard-grid {
    gap: 12px;
    padding: 12px;
  }
}

@media (max-width: 1440px) {
  .dashboard-grid {
    gap: 10px;
    padding: 10px;
  }
  
  .big-numbers-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
  
  .panel-tm {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .big-numbers-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .metrics-row {
    grid-template-columns: 1fr;
  }
  
  .nav-menu-container {
    top: 10px;
    right: 10px;
  }
  
  .nav-menu-button {
    padding: 10px 15px;
    font-size: 12px;
  }
  
  .nav-menu-button i {
    font-size: 16px;
  }
  
  .nav-menu-dropdown {
    min-width: 180px;
  }
  
  .nav-menu-item {
    padding: 10px 15px;
    font-size: 13px;
  }
  
  .fullscreen-countdown {
    top: 10px;
    right: 80px;
    padding: 8px 15px;
    font-size: 12px;
  }
}
</style>
