<template>
  <el-form ref="projectForm" :model="form" label-width="110px" :rules="rules" style="padding-right:24px;">
    <el-row :gutter="20">
      <el-col :span="12">
                 <el-form-item label="项目名称" prop="name" required>
           <el-input v-model="form.name" :placeholder="readonly ? '' : '请输入项目名称'" :disabled="readonly" />
         </el-form-item>
         <el-form-item label="项目地址" prop="address">
           <el-input
             v-model="form.address"
             :placeholder="readonly ? '' : '请输入地址'"
             :disabled="readonly"
           />
         </el-form-item>
                 <el-form-item label="项目定位" prop="position">
           <MapLocationPicker
             v-if="!readonly"
             ref="mapPicker"
             :initial-location="mapLocation"
             :readonly="false"
             @location-change="onLocationChange"
           />
           <MapLocationViewer
             v-else
             :location="mapLocation"
             height="300px"
           />
           <el-input
             v-model="form.position"
             type="textarea"
             :autosize="{ minRows: 2, maxRows: 3 }"
             :placeholder="readonly ? '' : '项目定位详细信息（可选）'"
             :disabled="readonly"
             style="margin-top: 10px;"
           />
         </el-form-item>
                 <el-form-item label="项目区域" prop="area" required>
           <el-select v-model="form.area" :placeholder="readonly ? '' : '请选择区域'" style="width:100%;" :disabled="readonly">
             <el-option label="顺庆区" value="顺庆区" />
             <el-option label="高坪区" value="高坪区" />
             <el-option label="嘉陵区" value="嘉陵区" />
             <el-option label="其他" value="其他" />
           </el-select>
         </el-form-item>
      </el-col>
      <el-col :span="12">
                 <el-form-item label="业主单位名称" prop="ownerName" required>
           <el-input v-model="form.ownerName" :placeholder="readonly ? '' : '请输入业主单位名称'" :disabled="readonly" />
         </el-form-item>
         <el-form-item label="项目单位联系人" prop="linkman" required>
           <el-input v-model="form.linkman" :placeholder="readonly ? '' : '请输入项目单位联系人姓名'" :disabled="readonly" />
         </el-form-item>
         <el-form-item label="联系人电话" prop="phone" required>
           <el-input v-model="form.phone" :placeholder="readonly ? '' : '请输入联系人电话'" :disabled="readonly" />
         </el-form-item>
                 <el-form-item label="进场报告" v-if="!readonly">
           <el-upload action="#" :show-file-list="false">
             <el-button size="mini" type="primary">+ 上传进场报告</el-button>
           </el-upload>
           <span class="upload-tips">上传支持: DOCX/PDF/PNG/JPG等格式</span>
         </el-form-item>
         <el-form-item label="项目/单位logo" v-if="!readonly">
           <el-upload class="logo-uploader" action="#" :show-file-list="false">
             <i class="el-icon-camera logo-upload-icon" />
             <div class="el-upload__text">上传图片</div>
           </el-upload>
         </el-form-item>
      </el-col>
    </el-row>
         <div style="text-align:center; margin-top:10px;" v-if="!readonly">
       <el-button type="primary" style="width:120px;" @click="onSave">保存</el-button>
       <el-button style="width:120px; margin-left:18px;" @click="$emit('cancel')">取消</el-button>
     </div>
     <div style="text-align:center; margin-top:10px;" v-else>
       <el-button style="width:120px;" @click="$emit('cancel')">关闭</el-button>
     </div>
  </el-form>
</template>

<script>
import MapLocationPicker from './MapLocationPicker.vue'
import MapLocationViewer from './MapLocationViewer.vue'

export default {
  name: 'ProjectFormDialog',
  components: {
    MapLocationPicker,
    MapLocationViewer
  },
  props: {
    formData: Object,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
                    form: {
         name: '',
         address: '',
         position: '',
         area: '',
         ownerName: '',
         linkman: '',
         phone: '',
         location: { lng: null, lat: null }
       },
       mapLocation: { lng: 106.1107, lat: 30.8379, address: '' },
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
       handler(newVal) {
         if (newVal) {
           this.form = { ...this.form, ...newVal }
           // 如果有位置信息，设置地图位置
           if (newVal.location && newVal.location.lng && newVal.location.lat) {
             this.mapLocation = {
               lng: newVal.location.lng,
               lat: newVal.location.lat,
               address: newVal.position || ''
             }
           }
         }
       },
       immediate: true,
       deep: true
     }
   },
   methods: {
     // 位置变化处理
     onLocationChange(location) {
       if (location) {
         this.form.location = {
           lng: location.lng,
           lat: location.lat
         }
         // 如果position字段为空，自动填充地址
         if (!this.form.position) {
           this.form.position = location.address
         }
       } else {
         this.form.location = { lng: null, lat: null }
       }
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
