<template>
  <div class="map-dialog-container">
    <div class="search-box">
      <el-input
        id="map-search-input"
        v-model="searchKeyword"
        placeholder="输入关键字搜索地点"
        clearable
      />
      <div id="search-result-panel" />
    </div>
    <div class="map-container">
      <el-amap
        vid="amap-dialog"
        :zoom="zoom"
        :center="center"
        :plugin="plugin"
        class="amap-demo"
        :events="mapEvents"
      >
        <el-amap-marker :position="markerPosition" />
      </el-amap>
    </div>
    <div class="dialog-footer">
      <div class="selected-address">
        当前选中：{{ selectedAddress }}
      </div>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapDialog',
  data() {
    const self = this;
    return {
      searchKeyword: '',
      zoom: 15,
      center: [121.59996, 31.197646], // 默认上海
      markerPosition: [121.59996, 31.197646],
      selectedAddress: '尚未选择',
      selectedLocation: null,
      mapEvents: {
        init(map) {
          self.initSearch(map);
          // 单击地图获取经纬度和地址
          map.on('click', (e) => {
            const { lng, lat } = e.lnglat;
            self.markerPosition = [lng, lat];
            self.getAddressByLngLat([lng, lat]);
          });
        },
      },
      plugin: [
        {
          pName: 'Geocoder',
          events: {
            init(o) {
              self.geocoder = o;
            },
          },
        },
      ],
      geocoder: null,
    };
  },
  methods: {
    initSearch(map) {
      const AMap = window.AMap;
      const autoComplete = new AMap.Autocomplete({
        input: 'map-search-input',
      });

      const placeSearch = new AMap.PlaceSearch({
        map: map,
        panel: 'search-result-panel',
      });

      autoComplete.on('select', (e) => {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
      });

      placeSearch.on('listElementClick', (e) => {
        const { lng, lat } = e.data.location;
        this.center = [lng, lat];
        this.markerPosition = [lng, lat];
        this.selectedAddress = e.data.address + e.data.name;
        this.selectedLocation = {
          address: this.selectedAddress,
          longitude: lng,
          latitude: lat,
        };
      });
    },

    getAddressByLngLat(lnglat) {
      this.geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          this.selectedAddress = result.regeocode.formattedAddress;
          this.selectedLocation = {
            address: this.selectedAddress,
            longitude: lnglat[0],
            latitude: lnglat[1],
          };
        } else {
          this.selectedAddress = '地址解析失败';
          this.selectedLocation = null;
        }
      });
    },

    handleConfirm() {
      if (!this.selectedLocation) {
        this.$message.warning('请先在地图上选择一个地点');
        return;
      }
      this.$emit('confirm', this.selectedLocation);
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.map-dialog-container {
  position: relative;
  height: 500px;
}
.map-container {
  height: 100%;
}
.search-box {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  width: 300px;
  background: #fff;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
}
#search-result-panel {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 5px;
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 0 0;
}
.selected-address {
  font-size: 14px;
  color: #606266;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 