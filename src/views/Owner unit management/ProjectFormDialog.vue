<template>
  <div>
    <el-form ref="projectForm" :model="form" label-width="110px" :rules="rules" style="padding-right:24px;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name" required>
            <el-input v-model="form.name" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目地址" prop="address" required>
            <el-input v-model="form.address" placeholder="请输入项目地址">
              <el-button slot="append" icon="el-icon-location-outline" @click="mapDialogVisible = true" />
            </el-input>
          </el-form-item>
          <el-form-item label="项目定位">
            <div class="map-preview">
              <el-amap
                v-if="form.longitude && form.latitude"
                :vid="'preview-map-' + form.name"
                :center="[form.longitude, form.latitude]"
                :zoom="15"
                class="amap-demo"
              >
                <el-amap-marker :position="[form.longitude, form.latitude]" />
              </el-amap>
              <div v-else class="map-placeholder">
                在上方地址栏点击定位按钮或在地图上选点
              </div>
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
            <el-upload
              action="#"
              :show-file-list="false"
              style="display:inline-block"
            >
              <el-button size="mini" type="primary">+ 上传进场报告</el-button>
            </el-upload>
            <span class="upload-tips">上传支持: DOCX/PDF/PNG/JPG等格式</span>
          </el-form-item>
          <el-form-item label="项目/单位logo">
            <el-upload
              class="logo-uploader"
              action="#"
              :show-file-list="false"
            >
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

    <el-dialog
      title="地图选点"
      :visible.sync="mapDialogVisible"
      width="800px"
      append-to-body
      destroy-on-close
    >
      <MapDialog v-if="mapDialogVisible" @cancel="mapDialogVisible = false" @confirm="handleMapConfirm" />
    </el-dialog>
  </div>
</template>

<script>
import MapDialog from './MapDialog.vue'

export default {
  name: 'ProjectFormDialog',
  components: { MapDialog },
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
        longitude: null,
        latitude: null
      },
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
  watch: {
    formData: {
      handler(data) {
        if (data) {
          this.form = { ...this.form, ...data }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleMapConfirm(location) {
      this.form.address = location.address;
      this.form.longitude = location.longitude;
      this.form.latitude = location.latitude;
      this.mapDialogVisible = false;
    },
    onSave() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          this.$emit('save', this.form)
        }
      })
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
