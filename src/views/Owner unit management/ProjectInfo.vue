<template>
  <div class="project-info-root">
    <el-form :model="form" label-width="110px" :rules="rules" ref="projectForm" class="project-form">
      <!-- 上方两栏 -->
      <el-row :gutter="38">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name" required>
            <el-input v-model="form.name" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目地址" prop="address" required>
            <el-input v-model="form.address" placeholder="请输入项目地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业主单位名称" prop="owner" required>
            <el-input v-model="form.owner" placeholder="请输入业主单位名称" />
          </el-form-item>
          <el-form-item label="项目单位联系人" prop="linkman" required>
            <el-input v-model="form.linkman" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 地图 + 地区 -->
      <el-row :gutter="38">
        <el-col :span="12" style="display: flex; flex-direction: column;">
          <el-form-item label="项目定位" required class="map-form-item" label-width="110px">
            <div class="map-block">
              <div id="amapContainer" style="width:100%;height:320px;border-radius:8px;overflow:hidden"></div>
            </div>
          </el-form-item>
          <el-form-item label="项目区域" label-width="110px" required style="margin-bottom:0;">
            <el-select v-model="form.area" placeholder="请选择区域" style="width: 96%;">
              <el-option label="顺庆区" value="顺庆区" />
              <el-option label="高坪区" value="高坪区" />
              <el-option label="其他区域" value="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人电话" prop="phone" required>
            <el-input v-model="form.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="进场报告">
            <el-upload action="#" :show-file-list="false">
              <el-button size="mini" type="primary">+ 上传进场报告</el-button>
            </el-upload>
            <span class="upload-tips">上传支持: DOCX/PDF/PNG/JPG等格式</span>
          </el-form-item>
          <el-form-item label="项目/单位logo">
            <el-upload class="logo-uploader" action="#" :show-file-list="false">
              <i class="el-icon-camera logo-upload-icon"></i>
              <div class="el-upload__text">上传图片</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 底部按钮 -->
      <div class="footer-bar">
        <el-button type="primary" size="large" style="width: 160px;font-size:18px;" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ProjectInfo',
  data() {
    return {
      form: {
        name: 'ue',
        address: '四川省南充市顺庆区舞凤街道中梁壹号院',
        area: '顺庆区',
        owner: '小学',
        linkman: '我算了',
        phone: '17683231030',
        lnglat: [106.115, 30.803], // 可存地图坐标
      },
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入项目地址', trigger: 'blur' }],
        owner: [{ required: true, message: '请输入业主单位', trigger: 'blur' }],
        linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      },
      amap: null,
      marker: null,
    }
  },
  mounted() {
    this.initAMap()
  },
  methods: {
    onSubmit() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          this.$message.success('保存成功（演示）')
        }
      })
    },
    // 初始化高德地图
    initAMap() {
      if (!window.AMap) {
        // 防止AMap加载失败
        this.$message.error('地图加载失败，请检查 key 或网络')
        return
      }
      this.amap = new window.AMap.Map('amapContainer', {
        resizeEnable: true,
        zoom: 15,
        center: this.form.lnglat,
      })
      this.marker = new window.AMap.Marker({
        position: this.form.lnglat,
        draggable: true,
        cursor: "move"
      })
      this.amap.add(this.marker)

      // 拖动marker可更新表单坐标
      this.marker.on('dragend', (e) => {
        this.form.lnglat = [e.lnglat.lng, e.lnglat.lat]
      })

      // 点击地图可移动marker
      this.amap.on('click', (e) => {
        this.marker.setPosition([e.lnglat.lng, e.lnglat.lat])
        this.form.lnglat = [e.lnglat.lng, e.lnglat.lat]
      })
    }
  }
}
</script>

<style scoped>
.project-info-root {
  background: #fff;
  border-radius: 10px;
  padding: 28px 20px 34px 20px;
  margin-top: 0;
}
.project-form {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
.map-form-item .el-form-item__content {
  display: flex;
  flex-direction: column;
}
.map-block {
  border: 1px solid #e3e7ed;
  border-radius: 8px;
  background: #f7f9fb;
  margin-bottom: 8px;
  overflow: hidden;
}
.upload-tips {
  font-size: 13px;
  color: #888;
  margin-left: 18px;
}
.logo-uploader {
  border: 2px dashed #d8e2f0;
  border-radius: 8px;
  width: 150px;
  height: 150px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 2px;
}
.logo-upload-icon {
  font-size: 36px;
  color: #b8c5db;
  margin-bottom: 4px;
}
.footer-bar {
  text-align: center;
  margin: 38px 0 12px 0;
}
@media (max-width: 1200px) {
  .project-info-root { padding: 10px 2vw 16px 2vw;}
}
</style>
