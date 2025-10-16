<template>
  <div class="map-location-picker">
    <div class="map-container">
      <div id="mapContainer" class="map-content"></div>
      <div class="map-overlay" v-if="!readonly">
        <div class="search-box">
          <el-input
            v-model="searchAddress"
            placeholder="搜索地址"
            size="small"
            @keyup.enter.native="searchLocation"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchLocation"></el-button>
          </el-input>
        </div>
        <div class="location-info" v-if="currentLocation">
          <div class="location-text">{{ currentLocation.address }}</div>
          <div class="coordinates">经度: {{ currentLocation.lng }}, 纬度: {{ currentLocation.lat }}</div>
        </div>
      </div>
    </div>
    <div class="map-actions" v-if="!readonly">
      <el-button size="mini" type="primary" @click="getCurrentLocation">
        <i class="el-icon-location"></i> 定位当前位置
      </el-button>
      <el-button size="mini" @click="clearLocation">
        <i class="el-icon-delete"></i> 清除标记
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapLocationPicker',
  props: {
    // 初始位置
    initialLocation: {
      type: Object,
      default: () => ({ lng: 106.1107, lat: 30.8379, address: '' })
    },
    // 是否只读模式（查看模式）
    readonly: {
      type: Boolean,
      default: false
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
      geocoder: null,
      searchAddress: '',
      currentLocation: null,
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
  methods: {
    // 初始化地图
    async initMap() {
      try {
        // 动态加载高德地图
        await this.loadAMap()
        
        // 创建地图实例
        this.map = new AMap.Map('mapContainer', {
          zoom: 15,
          center: [this.initialLocation.lng, this.initialLocation.lat],
          resizeEnable: true
        })

        // 初始化地理编码器
        this.geocoder = new AMap.Geocoder()

        // 如果有初始位置，设置标记
        if (this.initialLocation.address) {
          this.currentLocation = this.initialLocation
          this.setMarker([this.initialLocation.lng, this.initialLocation.lat])
        }

        // 如果不是只读模式，添加点击事件
        if (!this.readonly) {
          this.map.on('click', this.onMapClick)
        }

        this.isMapLoaded = true
        this.$emit('map-loaded')
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
        script.src = `https://webapi.amap.com/maps?v=2.0&key=9e88da7280b6a01c17010e78fdd66f1e&plugin=AMap.Geocoder,AMap.Geolocation`
        script.onload = () => {
          window.AMapLoader = {
            load: (config) => {
              return new Promise((res) => {
                res(window.AMap)
              })
            }
          }
          resolve(window.AMap)
        }
        script.onerror = reject
        document.head.appendChild(script)
      })
    },

    // 地图点击事件
    onMapClick(e) {
      const position = e.lnglat
      this.setMarker(position)
      this.reverseGeocode(position)
    },

    // 设置标记
    setMarker(position) {
      // 清除旧标记
      if (this.marker) {
        this.marker.setMap(null)
      }

      // 创建新标记
      this.marker = new AMap.Marker({
        position: position,
        map: this.map,
        draggable: !this.readonly
      })

      // 如果不是只读模式，添加拖拽事件
      if (!this.readonly) {
        this.marker.on('dragend', (e) => {
          this.reverseGeocode(e.lnglat)
        })
      }

      // 居中地图
      this.map.setCenter(position)
    },

    // 逆地理编码
    reverseGeocode(position) {
      this.geocoder.getAddress(position, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress
          this.currentLocation = {
            lng: position.lng,
            lat: position.lat,
            address: address
          }
          this.$emit('location-change', this.currentLocation)
        }
      })
    },

    // 搜索地址
    searchLocation() {
      if (!this.searchAddress.trim()) return

      this.geocoder.getLocation(this.searchAddress, (status, result) => {
        if (status === 'complete' && result.geocodes.length > 0) {
          const location = result.geocodes[0].location
          this.setMarker(location)
          this.reverseGeocode(location)
          this.searchAddress = ''
        } else {
          this.$message.warning('未找到该地址')
        }
      })
    },

    // 获取当前位置
    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.$message.warning('浏览器不支持地理定位')
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lng = position.coords.longitude
          const lat = position.coords.latitude
          const location = [lng, lat]
          
          this.setMarker(location)
          this.reverseGeocode(location)
        },
        (error) => {
          this.$message.error('获取当前位置失败')
        }
      )
    },

    // 清除位置
    clearLocation() {
      if (this.marker) {
        this.marker.setMap(null)
        this.marker = null
      }
      this.currentLocation = null
      this.$emit('location-change', null)
    },

    // 设置位置（外部调用）
    setLocation(location) {
      if (location && location.lng && location.lat) {
        this.currentLocation = location
        this.setMarker([location.lng, location.lat])
      }
    }
  }
}
</script>

<style scoped>
.map-location-picker {
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

.map-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 1000;
}

.search-box {
  background: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.location-info {
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.map-actions {
  margin-top: 10px;
  text-align: center;
}

.map-actions .el-button {
  margin: 0 5px;
}
</style> 