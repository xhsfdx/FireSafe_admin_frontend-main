<template>
  <div class="map-location-viewer">
    <div class="map-container">
      <div id="mapViewerContainer" class="map-content"></div>
      <div class="location-info" v-if="location">
        <div class="location-text">{{ location.address }}</div>
        <div class="coordinates">经度: {{ location.lng }}, 纬度: {{ location.lat }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapLocationViewer',
  props: {
    // 位置信息
    location: {
      type: Object,
      default: () => ({ lng: 106.1107, lat: 30.8379, address: '' })
    },
    // 地图高度
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      map: null,
      marker: null,
      isMapLoaded: false
    }
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    if (this.map) {
      this.map.destroy()
    }
  },
  watch: {
    location: {
      handler(newLocation) {
        if (newLocation && this.isMapLoaded) {
          this.setLocation(newLocation)
        }
      },
      deep: true
    }
  },
  methods: {
    // 初始化地图
    async initMap() {
      try {
        // 动态加载高德地图
        await this.loadAMap()
        
        // 创建地图实例
        this.map = new AMap.Map('mapViewerContainer', {
          zoom: 15,
          center: [this.location.lng, this.location.lat],
          resizeEnable: true
        })

        // 如果有位置信息，设置标记
        if (this.location.address) {
          this.setLocation(this.location)
        }

        this.isMapLoaded = true
      } catch (error) {
        console.error('地图初始化失败:', error)
        this.$message.error('地图加载失败')
      }
    },

    // 动态加载高德地图SDK
    loadAMap() {
      return new Promise((resolve, reject) => {
        if (window.AMap) {
          resolve(window.AMap)
          return
        }

        const script = document.createElement('script')
        script.src = `https://webapi.amap.com/maps?v=2.0&key=9e88da7280b6a01c17010e78fdd66f1e`
        script.onload = () => {
          resolve(window.AMap)
        }
        script.onerror = reject
        document.head.appendChild(script)
      })
    },

    // 设置位置标记
    setLocation(location) {
      if (!location || !location.lng || !location.lat) return

      // 清除旧标记
      if (this.marker) {
        this.marker.setMap(null)
      }

      // 创建新标记
      this.marker = new AMap.Marker({
        position: [location.lng, location.lat],
        map: this.map
      })

      // 居中地图
      this.map.setCenter([location.lng, location.lat])
    }
  }
}
</script>

<style scoped>
.map-location-viewer {
  width: 100%;
}

.map-container {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.map-content {
  width: 100%;
  height: 300px;
}

.location-info {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.location-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.coordinates {
  font-size: 12px;
  color: #666;
}
</style> 