<template>
  <el-form ref="projectForm" :model="form" label-width="110px" :rules="rules" style="padding-right:24px;">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="项目名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目地址" prop="address">
          <el-input
            v-model="form.address"
            placeholder="请输入地址"
            @input="onAddressManualInput"
          />
        </el-form-item>
        <el-form-item label="项目定位" required>
          <div style="border:1px solid #e0e0e0; border-radius:6px; height:250px;width: 280px; margin-bottom:12px;overflow:hidden;">
            <div id="mapContainer" style="width:100%; height:100%;"></div>
          </div>
        </el-form-item>
        <el-form-item label="项目区域" prop="area" required>
          <el-select v-model="form.area" placeholder="请选择区域" style="width:100%;">
            <el-option label="顺庆区" value="顺庆区" />
            <el-option label="高坪区" value="高坪区" />
            <el-option label="嘉陵区" value="嘉陵区" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="业主单位名称" prop="ownerName" required>
          <el-input v-model="form.ownerName" placeholder="请输入业主单位名称" />
        </el-form-item>
        <el-form-item label="项目单位联系人" prop="linkman" required>
          <el-input v-model="form.linkman" placeholder="请输入项目单位联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="phone" required>
          <el-input v-model="form.phone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="进场报告">
          <el-upload action="#" :show-file-list="false">
            <el-button size="mini" type="primary">+ 上传进场报告</el-button>
          </el-upload>
          <span class="upload-tips">上传支持: DOCX/PDF/PNG/JPG等格式</span>
        </el-form-item>
        <el-form-item label="项目/单位logo">
          <el-upload class="logo-uploader" action="#" :show-file-list="false">
            <i class="el-icon-camera logo-upload-icon" />
            <div class="el-upload__text">上传图片</div>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <div style="text-align:center; margin-top:10px;">
      <el-button type="primary" style="width:120px;" @click="onSave">保存</el-button>
      <el-button style="width:120px; margin-left:18px;" @click="$emit('cancel')">取消</el-button>
    </div>
  </el-form>
</template>

<script>
import MapDialog from './MapDialog.vue'

export default {
  name: 'ProjectFormDialog',
  props: {
    formData: Object
  },
  data() {
    return {
      mapDialogVisible: false,
      form: {
        name: '',
        address: '',
        area: '',
        ownerName: '',
        linkman: '',
        phone: '',
        location: { lng: null, lat: null }
      },
      map: null,
      marker: null,
      geocoder: null,
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入项目地址', trigger: 'blur' }],
        area: [{ required: true, message: '请选择项目区域', trigger: 'change' }],
        ownerName: [{ required: true, message: '请输入业主单位名称', trigger: 'blur' }],
        linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // 使用 AMapLoader 加载高德地图 SDK
    this.loadMap();
  },
  methods: {
    // 加载高德地图 API
    loadMap() {
      window.AMapLoader.load({
        key: '9e88da7280b6a01c17010e78fdd66f1e', // 替换为您自己的高德地图 API key
        version: '2.0', // 高德地图版本
        plugins: ['AMap.Geocoder'] // 如果需要使用 Geocoder 插件，添加到 plugins 数组中
      }).then(AMap => {
        this.initMap(AMap)
      }).catch(e => {
        console.error('地图加载失败', e);
      });
    },

    initMap(AMap) {
      this.map = new AMap.Map('mapContainer', {
        zoom: 16,
        center: [106.1107, 30.8379],
        resizeEnable: true
      });

      this.geocoder = new AMap.Geocoder();
    },

    // 手动输入地址后定位
    onAddressManualInput() {
      if (!this.form.address || !this.geocoder) return;
      console.log('正在进行地理编码...', this.form.address); // 调试日志
      this.geocoder.getLocation(this.form.address, (status, result) => {
        console.log('Geocoder status:', status);
        if (status === 'complete') {
          if (result.geocodes.length) {
            const point = result.geocodes[0].location;
            this.form.location = { lng: point.lng, lat: point.lat };
            this.setMarker(point);
          } else {
            console.error('No geocodes found for this address.')
          }
        } else {
          console.error('Geocoding failed with status:', status, 'Result:', result);
        }
      })
    },

    // 设置标记并回填地址
    setMarker(position) {
      if (!this.map) return

      // 清除旧的标注
      if (this.marker) {
        this.marker.setMap(null)
      }

      this.marker = new AMap.Marker({
        position: position,
        map: this.map
      })

      this.map.setCenter(position);

      // 逆地址解析：经纬度 → 地址
      this.geocoder.getAddress(position, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          this.form.address = result.regeocode.formattedAddress; // 回填地址
        } else {
          console.error('地址解析失败');
        }
      });
    },

    // 保存按钮
    onSave() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          this.$emit('save', this.form);
        }
      });
    }
  }
}
</script>

<style scoped>
.map-preview {
  border:1px solid #e0e0e0;
  border-radius:6px;
  height:180px;
  margin-bottom:12px;
  overflow:hidden;
}
.map-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
  background-color: #f5f7fa;
}

.upload-tips {
  font-size: 13px;
  color: #888;
  margin-left: 8px;
}
.logo-uploader {
  border: 2px dashed #d8e2f0;
  border-radius: 8px;
  width: 100px;
  height: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 2px;
}
.logo-upload-icon {
  font-size: 28px;
  color: #b8c5db;
  margin-bottom: 4px;
}
</style>
