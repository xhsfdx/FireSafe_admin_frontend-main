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

    <!-- 今日关键指标 - 顶部突出显示 -->
    <div class="today-metrics-bar">
      <div class="today-metric-item urgent">
        <div class="today-metric-label">今日打卡</div>
        <div class="today-metric-value">{{ formatNumber(getTodayData('todayChecked')) }}</div>
        <div class="today-metric-icon">📋</div>
      </div>
      <div class="today-metric-item">
        <div class="today-metric-label">今日完成</div>
        <div class="today-metric-value">{{ formatNumber(getTodayData('todayCompleted')) }}</div>
        <div class="today-metric-icon">✅</div>
      </div>
      <div class="today-metric-item">
        <div class="today-metric-label">今日评价</div>
        <div class="today-metric-value">{{ formatNumber(getTodayData('todayReviews')) }}</div>
        <div class="today-metric-icon">⭐</div>
      </div>
      <div class="today-metric-item urgent" v-if="getMaintainData('urgent') > 0 || getFaultData('overdueUnresolved') > 0">
        <div class="today-metric-label">紧急任务</div>
        <div class="today-metric-value">{{ (getMaintainData('urgent') || 0) + (getFaultData('overdueUnresolved') || 0) }}</div>
        <div class="today-metric-icon">⚠️</div>
      </div>
      <div class="today-metric-item">
        <div class="today-metric-label">今日故障</div>
        <div class="today-metric-value">{{ formatNumber(getTodayData('todayFaults')) }}</div>
        <div class="today-metric-icon">🔧</div>
      </div>
    </div>

    <!-- Grid Layout -->
    <div class="dashboard-grid">
      <!-- Top Left: 例行维保核心指标 -->
      <div class="panel panel-large panel-tl">
        <div class="panel-header">
          <span class="panel-title">例行维保核心指标</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="core-metrics-grid">
            <div class="core-metric-card">
              <div class="core-metric-label">待处理</div>
              <div class="core-metric-value">{{ formatNumber(getMaintainData('pending')) }}</div>
            </div>
            <div class="core-metric-card">
              <div class="core-metric-label">处理中</div>
              <div class="core-metric-value">{{ formatNumber(getMaintainData('processing')) }}</div>
            </div>
            <div class="core-metric-card">
              <div class="core-metric-label">已完成</div>
              <div class="core-metric-value">{{ formatNumber(getMaintainData('finished')) }}</div>
            </div>
            <div class="core-metric-card highlight">
              <div class="core-metric-label">完成率</div>
              <div class="core-metric-value">{{ getMaintainData('completionRate') }}%</div>
            </div>
          </div>
          <div class="urgent-alert" v-if="getMaintainData('urgent') > 0">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <div class="alert-title">逾期任务：{{ getMaintainData('urgent') }} 个</div>
              <div class="alert-desc">需要紧急处理</div>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-title">本月完成情况</div>
            <div class="progress-bar-large">
              <div class="progress-fill-large" :style="{ width: getMaintainData('completionRate') + '%' }"></div>
              <span class="progress-text-large">{{ getMaintainData('completionRate') }}%</span>
            </div>
            <div class="progress-stats">
              <span>本月完成：{{ formatNumber(getMaintainData('thisMonthCompleted')) }}</span>
              <span class="warning" v-if="getMaintainData('lastMonthOverdue') > 0">
                上月逾期：{{ formatNumber(getMaintainData('lastMonthOverdue')) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Middle: 四川省维保服务区域地图 -->
      <div class="panel panel-large panel-tm panel-map">
        <div class="panel-header">
          <span class="panel-title">四川省维保服务区域</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content map-content">
          <MapChart ref="mapChart" class="map-container" />
        </div>
      </div>

      <!-- Top Right: 故障工单核心指标 -->
      <div class="panel panel-large panel-tr">
        <div class="panel-header">
          <span class="panel-title">故障工单核心指标</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="core-metrics-grid">
            <div class="core-metric-card">
              <div class="core-metric-label">待处理</div>
              <div class="core-metric-value">{{ formatNumber(getFaultData('pending')) }}</div>
            </div>
            <div class="core-metric-card">
              <div class="core-metric-label">处理中</div>
              <div class="core-metric-value">{{ formatNumber(getFaultData('processing')) }}</div>
            </div>
            <div class="core-metric-card">
              <div class="core-metric-label">已完成</div>
              <div class="core-metric-value">{{ formatNumber(getFaultData('finished')) }}</div>
            </div>
            <div class="core-metric-card highlight">
              <div class="core-metric-label">完成率</div>
              <div class="core-metric-value">{{ getFaultData('completionRate') }}%</div>
            </div>
          </div>
          <div class="urgent-alert critical" v-if="getFaultData('overdueUnresolved') > 0">
            <div class="alert-icon">🚨</div>
            <div class="alert-content">
              <div class="alert-title">逾期未解决：{{ getFaultData('overdueUnresolved') }} 个</div>
              <div class="alert-desc">需要立即处理</div>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-title">故障处理情况</div>
            <div class="progress-bar-large">
              <div class="progress-fill-large" :style="{ width: getFaultData('completionRate') + '%' }"></div>
              <span class="progress-text-large">{{ getFaultData('completionRate') }}%</span>
            </div>
            <div class="progress-stats">
              <span>未解决：{{ formatNumber(getFaultData('unresolved')) }}</span>
              <span class="critical" v-if="getFaultData('overdueUnresolved') > 0">
                逾期未解决：{{ formatNumber(getFaultData('overdueUnresolved')) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Left: 业务规模 & 设备健康度 -->
      <div class="panel panel-large panel-bl">
        <div class="panel-header">
          <span class="panel-title">业务规模 & 设备健康度</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="scale-metrics">
            <div class="scale-item">
              <div class="scale-label">业主单位</div>
              <div class="scale-value">{{ formatNumber(getScaleData('ownerCompanyTotal')) }} 家</div>
            </div>
            <div class="scale-item">
              <div class="scale-label">维保面积</div>
              <div class="scale-value">{{ formatLargeNumber(getScaleData('warrantyAreaTotal')) }} m²</div>
            </div>
            <div class="scale-item">
              <div class="scale-label">活跃项目</div>
              <div class="scale-value">{{ formatNumber(getScaleData('activeProjects')) }} 个</div>
            </div>
            <div class="scale-item">
              <div class="scale-label">附加维保</div>
              <div class="scale-value">{{ formatNumber(getScaleData('additionalMaintainCount')) }} 个</div>
            </div>
          </div>
          <div class="health-section">
            <div class="health-header">
              <span>设备健康度</span>
              <span class="health-rate">{{ getHealthData('healthRate') }}%</span>
            </div>
            <div class="progress-bar-large">
              <div class="progress-fill-large health" :style="{ width: getHealthData('healthRate') + '%' }"></div>
              <span class="progress-text-large">{{ getHealthData('healthRate') }}%</span>
            </div>
            <div class="health-stats">
              <span>总检查：{{ formatNumber(getHealthData('totalChecks')) }}</span>
              <span>通过：{{ formatNumber(getHealthData('totalPassed')) }}</span>
              <span class="warning">异常：{{ formatNumber(getHealthData('totalAbnormal')) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Middle: 月度趋势 -->
      <div class="panel panel-large panel-bm">
        <div class="panel-header">
          <span class="panel-title">月度趋势分析</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content">
          <div class="trend-header">
            <div class="trend-metric">
              <div class="trend-label">环比增长</div>
              <div class="trend-value" :class="getMonthGrowth() >= 0 ? 'positive' : 'negative'">
                {{ getMonthGrowth() >= 0 ? '+' : '' }}{{ getMonthGrowth() }}%
              </div>
            </div>
          </div>
          <TrendChart ref="trendChart" :data="getTrendData()" />
        </div>
      </div>

      <!-- Bottom Right: 维保人员排名 -->
      <div class="panel panel-large panel-br">
        <div class="panel-header">
          <span class="panel-title">维保人员排名 TOP 5</span>
          <div class="panel-decoration"></div>
        </div>
        <div class="panel-content ranking-list">
          <div 
            v-for="(maintainer, index) in getTopMaintainers()" 
            :key="index" 
            class="ranking-item"
            :class="{ 'top-three': index < 3 }"
          >
            <div class="ranking-number">{{ maintainer.rank }}</div>
            <div class="ranking-info">
              <div class="ranking-name">{{ maintainer.staffName }}</div>
              <div class="ranking-details">
                <span>任务：{{ maintainer.taskCount }}</span>
                <span>面积：{{ formatLargeNumber(maintainer.totalArea) }}m²</span>
                <span>评分：{{ maintainer.avgScore }}</span>
              </div>
            </div>
            <div class="ranking-badge" v-if="index < 3">
              {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
            </div>
          </div>
          <div class="no-ranking" v-if="getTopMaintainers().length === 0">
            <div class="no-ranking-text">暂无排名数据</div>
          </div>
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
import TrendChart from '@/components/digitalScreen/TrendChart.vue'
import MapChart from '@/components/digitalScreen/MapChart.vue'
import { getDigitalScreenData } from '@/api/digitalScreen'
import store from '@/store'

export default {
  name: 'DigitalScreen',
  components: {
    TrendChart,
    MapChart
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
  beforeRouteLeave(to, from, next) {
    // Clean up when leaving the route
    this.restoreUI()
    next()
  },
  watch: {
    '$route'(to, from) {
      // If navigating away from digital screen, restore UI
      if (!to.path.includes('/digital-screen') && from.path.includes('/digital-screen')) {
        this.restoreUI()
      }
    }
  },
  methods: {
    // 获取今日数据
    getTodayData(key) {
      if (this.screenData.important && this.screenData.important.today) {
        return this.screenData.important.today[key] || 0
      }
      // 向后兼容
      if (key === 'todayChecked') return this.screenData.todayChecked || 0
      if (key === 'todayCompleted') return this.screenData.todayCompleted || 0
      if (key === 'todayReviews') return this.screenData.todayReviews || 0
      if (key === 'todayFaults') return this.screenData.todayFaults || 0
      return 0
    },
    // 获取例行维保数据
    getMaintainData(key) {
      if (this.screenData.important && this.screenData.important.maintain) {
        return this.screenData.important.maintain[key] || 0
      }
      // 向后兼容
      if (key === 'pending') return this.screenData.maintainPendingCount || 0
      if (key === 'processing') return this.screenData.maintainProcessingCount || 0
      if (key === 'finished') return this.screenData.maintainFinishedCount || 0
      if (key === 'completionRate') return this.screenData.maintainCompletionRate || 0
      if (key === 'thisMonthCompleted') return this.screenData.maintainThisMonthCompleted || 0
      if (key === 'lastMonthOverdue') return this.screenData.maintainLastMonthOverdue || 0
      if (key === 'urgent') return this.screenData.maintainLastMonthOverdue || 0
      return 0
    },
    // 获取故障工单数据
    getFaultData(key) {
      if (this.screenData.important && this.screenData.important.fault) {
        return this.screenData.important.fault[key] || 0
      }
      // 向后兼容
      if (key === 'pending') return this.screenData.faultPendingCount || 0
      if (key === 'processing') return this.screenData.faultProcessingCount || 0
      if (key === 'finished') return this.screenData.faultFinishedCount || 0
      if (key === 'completionRate') return this.screenData.faultCompletionRate || 0
      if (key === 'unresolved') return this.screenData.faultUnresolved || 0
      if (key === 'overdueUnresolved') return this.screenData.faultOverdueUnresolved || 0
      return 0
    },
    // 获取业务规模数据
    getScaleData(key) {
      if (this.screenData.important && this.screenData.important.scale) {
        return this.screenData.important.scale[key] || 0
      }
      // 向后兼容
      if (key === 'ownerCompanyTotal') return this.screenData.ownerCompanyTotal || 0
      if (key === 'warrantyAreaTotal') return this.screenData.warrantyAreaTotal || 0
      if (key === 'activeProjects') return (this.screenData.maintainFinishedCount || 0) + (this.screenData.maintainProcessingCount || 0)
      if (key === 'additionalMaintainCount') return this.screenData.additionalMaintainCount || 0
      return 0
    },
    // 获取设备健康度数据
    getHealthData(key) {
      if (this.screenData.important && this.screenData.important.health) {
        return this.screenData.important.health[key] || 0
      }
      // 向后兼容
      if (this.screenData.healthData) {
        if (key === 'healthRate') return this.screenData.healthData.healthRate || 100
        if (key === 'totalChecks') return this.screenData.healthData.totalChecks || 0
        if (key === 'totalPassed') return this.screenData.healthData.totalPassed || 0
        if (key === 'totalAbnormal') return this.screenData.healthData.totalAbnormal || 0
      }
      return key === 'healthRate' ? 100 : 0
    },
    // 获取月度趋势数据
    getTrendData() {
      if (this.screenData.important && this.screenData.important.trend) {
        return this.screenData.important.trend
      }
      return this.screenData.monthlyTrendData || []
    },
    // 获取月度环比增长
    getMonthGrowth() {
      if (this.screenData.important && this.screenData.important.monthOverMonthGrowth !== undefined) {
        return parseFloat(this.screenData.important.monthOverMonthGrowth) || 0
      }
      return parseFloat(this.screenData.monthOverMonthGrowth) || 0
    },
    // 获取维保人员排名
    getTopMaintainers() {
      if (this.screenData.important && this.screenData.important.topMaintainers) {
        return this.screenData.important.topMaintainers
      }
      return this.screenData.maintainerStats || []
    },
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
      // 刷新趋势图和地图
      if (this.$refs.trendChart && this.$refs.trendChart.updateChart) {
        this.$refs.trendChart.updateChart()
      }
      if (this.$refs.mapChart && this.$refs.mapChart.loadData) {
        this.$refs.mapChart.loadData().then(() => {
          if (this.$refs.mapChart.renderMap) {
            this.$refs.mapChart.renderMap()
          }
        })
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
      this.restoreUI()
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
      
      // Clean up and restore UI first
      this.restoreUI()
      
      // Wait a bit for UI to restore, then navigate
      setTimeout(() => {
        this.performNavigation('/agency/basic')
      }, 150)
    },
    toggleNavMenu() {
      this.showNavMenu = !this.showNavMenu
    },
    navigateTo(path) {
      this.showNavMenu = false
      
      // Clean up and restore UI first
      this.restoreUI()
      
      // Clear cache and navigate using redirect (single refresh)
      const targetRoute = this.$router.resolve({ path })
      if (targetRoute && targetRoute.route && targetRoute.route.name) {
        // Clear cache to force component re-mount
        store.dispatch('tagsView/delCachedView', { name: targetRoute.route.name }).then(() => {
          // Navigate using redirect mechanism (forces single refresh)
          this.performNavigation(path)
        }).catch(() => {
          // If cache clearing fails, still navigate
          this.performNavigation(path)
        })
      } else {
        // If we can't resolve the route, navigate directly
        this.performNavigation(path)
      }
    },
    performNavigation(path) {
      // Navigate directly to the path, then reload window
      try {
        const pushResult = this.$router.push({ path })
        
        // Check if push returns a Promise
        if (pushResult && typeof pushResult.then === 'function') {
          pushResult.then(() => {
            // Reload window after navigation completes
            window.location.reload()
          }).catch((err) => {
            if (err.name !== 'NavigationDuplicated') {
              console.error('Navigation error:', err)
              // Still reload even if navigation has error
              window.location.reload()
            }
          })
        } else {
          // If push doesn't return a Promise, reload after a short delay
          setTimeout(() => {
            window.location.reload()
          }, 100)
        }
      } catch (err) {
        console.error('Navigation error:', err)
        // Reload on error as well
        window.location.reload()
      }
    },
    restoreUI() {
      // Stop countdown if still running
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
      
      // Exit fullscreen if active
      if (this.isFullscreen) {
        this.exitFullscreen()
      }
      
      // Force remove the body class immediately
      document.body.classList.remove('digital-screen-active')
      
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        // Force show layout elements by removing any inline styles
        const mainContainer = document.querySelector('.main-container')
        if (mainContainer) {
          mainContainer.style.marginLeft = ''
          mainContainer.style.width = ''
        }
        
        const appMain = document.querySelector('.app-main')
        if (appMain) {
          appMain.style.minHeight = ''
          appMain.style.paddingTop = ''
        }
        
        // Force show sidebar, navbar, etc.
        const elements = [
          '.sidebar-container',
          '.navbar',
          '.tags-view-container',
          '.app-breadcrumb',
          '.hamburger-container',
          '.right-menu'
        ]
        
        elements.forEach(selector => {
          const el = document.querySelector(selector)
          if (el) {
            el.style.display = ''
            // Also remove any inline styles that might hide it
            el.style.visibility = ''
            el.style.opacity = ''
          }
        })
        
        // Trigger a resize event to ensure layout recalculates
        window.dispatchEvent(new Event('resize'))
        
        // Force Vue to re-render by triggering a route update
        this.$forceUpdate()
      }, 50)
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

/* Today Metrics Bar */
.today-metrics-bar {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 30px;
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.9) 0%, rgba(0, 40, 80, 0.85) 100%);
  border-bottom: 2px solid rgba(0, 192, 255, 0.3);
  margin-bottom: 15px;
  box-shadow: 0 4px 20px rgba(0, 192, 255, 0.2);
}

.today-metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 25px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 192, 255, 0.3);
  min-width: 120px;
  transition: all 0.3s ease;
  position: relative;
}

.today-metric-item.urgent {
  border-color: rgba(255, 107, 107, 0.6);
  background: rgba(255, 107, 107, 0.1);
  animation: pulse-urgent 2s infinite;
}

@keyframes pulse-urgent {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 107, 107, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.6); }
}

.today-metric-item:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 192, 255, 0.6);
  box-shadow: 0 5px 20px rgba(0, 192, 255, 0.4);
}

.today-metric-label {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 8px;
}

.today-metric-value {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.8);
  font-family: 'Orbitron', monospace;
  margin-bottom: 5px;
}

.today-metric-item.urgent .today-metric-value {
  color: #ff6b6b;
  text-shadow: 0 0 15px rgba(255, 107, 107, 0.8);
}

.today-metric-icon {
  font-size: 20px;
  opacity: 0.7;
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
  height: calc(100vh - 200px);
}

.panel-map {
  grid-column: 2;
  grid-row: 1;
}

.map-content {
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
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

/* Core Metrics Grid */
.core-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.core-metric-card {
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 192, 255, 0.2);
  transition: all 0.3s ease;
}

.core-metric-card:hover {
  border-color: rgba(0, 192, 255, 0.5);
  transform: translateY(-2px);
}

.core-metric-card.highlight {
  background: rgba(0, 192, 255, 0.1);
  border-color: rgba(0, 192, 255, 0.5);
}

.core-metric-label {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 8px;
}

.core-metric-value {
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  font-family: 'Orbitron', monospace;
}

/* Urgent Alert */
.urgent-alert {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.5);
  border-radius: 8px;
  margin-bottom: 20px;
  animation: pulse-warning 2s infinite;
}

.urgent-alert.critical {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.6);
  animation: pulse-critical 1.5s infinite;
}

@keyframes pulse-warning {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 193, 7, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.6); }
}

@keyframes pulse-critical {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 107, 107, 0.4); }
  50% { box-shadow: 0 0 30px rgba(255, 107, 107, 0.8); }
}

.alert-icon {
  font-size: 32px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 16px;
  font-weight: bold;
  color: #ffc107;
  margin-bottom: 5px;
}

.urgent-alert.critical .alert-title {
  color: #ff6b6b;
}

.alert-desc {
  font-size: 12px;
  color: rgba(255, 193, 7, 0.8);
}

.urgent-alert.critical .alert-desc {
  color: rgba(255, 107, 107, 0.8);
}

/* Progress Section */
.progress-section {
  margin-top: 20px;
}

.progress-title {
  font-size: 14px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 10px;
}

.progress-bar-large {
  height: 30px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  border: 1px solid rgba(0, 192, 255, 0.3);
  position: relative;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill-large {
  height: 100%;
  background: linear-gradient(90deg, #00c0ff, #00f0ff);
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
  transition: width 0.5s ease;
}

.progress-fill-large.health {
  background: linear-gradient(90deg, #4caf50, #8bc34a);
}

.progress-text-large {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #00f0ff;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.8);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
}

.progress-stats .warning {
  color: #ffc107;
}

.progress-stats .critical {
  color: #ff6b6b;
}

/* Scale Metrics */
.scale-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.scale-item {
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 192, 255, 0.2);
}

.scale-label {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 8px;
}

.scale-value {
  font-size: clamp(18px, 2vw, 24px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

/* Health Section */
.health-section {
  margin-top: 20px;
}

.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: rgba(0, 240, 255, 0.8);
}

.health-rate {
  font-size: 20px;
  font-weight: bold;
  color: #4caf50;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
}

.health-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-top: 10px;
}

.health-stats .warning {
  color: #ffc107;
}


/* Trend Header */
.trend-header {
  margin-bottom: 15px;
}

.trend-metric {
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 192, 255, 0.2);
}

.trend-label {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.8);
  margin-bottom: 8px;
}

.trend-value {
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: bold;
  font-family: 'Orbitron', monospace;
}

.trend-value.positive {
  color: #4caf50;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
}

.trend-value.negative {
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.6);
}

/* Ranking List */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 192, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.ranking-item:hover {
  border-color: rgba(0, 192, 255, 0.5);
  transform: translateX(5px);
}

.ranking-item.top-three {
  background: rgba(0, 192, 255, 0.1);
  border-color: rgba(0, 192, 255, 0.4);
}

.ranking-number {
  font-size: 24px;
  font-weight: bold;
  color: rgba(0, 240, 255, 0.6);
  min-width: 40px;
  text-align: center;
}

.ranking-item.top-three .ranking-number {
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-size: 16px;
  font-weight: bold;
  color: #00f0ff;
  margin-bottom: 5px;
}

.ranking-details {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: rgba(0, 240, 255, 0.7);
}

.ranking-badge {
  font-size: 32px;
}

.no-ranking {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(0, 240, 255, 0.6);
}

.no-ranking-text {
  font-size: 14px;
}

/* Responsive */
@media (max-width: 1920px) {
  .dashboard-grid {
    gap: 12px;
    padding: 12px;
  }
  
  .today-metrics-bar {
    padding: 12px 20px;
  }
  
  .today-metric-item {
    min-width: 100px;
    padding: 12px 20px;
  }
}

@media (max-width: 1440px) {
  .dashboard-grid {
    gap: 10px;
    padding: 10px;
    height: calc(100vh - 180px);
  }
  
  .today-metrics-bar {
    padding: 10px 15px;
  }
  
  .today-metric-item {
    min-width: 90px;
    padding: 10px 15px;
  }
  
  .core-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .scale-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
  
  .panel-map {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  
  .today-metrics-bar {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .today-metric-item {
    min-width: 80px;
    padding: 8px 12px;
  }
  
  .core-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
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
