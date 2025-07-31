<template>
  <div class="edit-person-info">
    <div class="page-header">
      <h3>编辑机构人员</h3>
      <el-button type="primary" @click="save">保存</el-button>
    </div>

    <div class="form-container">
      <el-form ref="personForm" :model="formData" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="居住地址" prop="residenceAddress">
              <el-input v-model="formData.residenceAddress" placeholder="请输入居住地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 性别" prop="gender">
              <el-select v-model="formData.gender" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="formData.age" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 电话" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="从业日期" prop="employmentDate">
              <el-date-picker v-model="formData.employmentDate" type="date" placeholder="请选择从业日期" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="* 资质级别" prop="qualificationLevel">
              <el-select v-model="formData.qualificationLevel" placeholder="请选择资质级别">
                <el-option label="一级注册消防工程师" value="一级注册消防工程师" />
                <el-option label="建(构)筑物消防员四级" value="建(构)筑物消防员四级" />
                <el-option label="消防设施操作员" value="消防设施操作员" />
                <el-option label="其他" value="其他" />
                <!-- 添加更多资质级别选项 <img v-if="certificateImageUrl" :src="certificateImageUrl" class="avatar"> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资质证书">
              <el-upload
                class="avatar-uploader"
                :http-request="handleCertificateUploadSuccess"
                :on-remove="handleRemovePhotos"
                :file-list="fileListcertificate"
                list-type="picture-card"
              >
                <div class="uploader-icon-text">
                  <i class="el-icon-camera" />
                  <span>上传图片</span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 人员照片">
              <el-upload
                class="avatar-uploader"
                :http-request="handlePersonPhotoUploadSuccess"
                :on-remove="handleRemovePhotos"
                :file-list="personPhotoList"
                list-type="picture-card"
              > <!-- 上传前钩子 -->
                <div class="uploader-icon-text">
                  <i class="el-icon-camera" />
                  <span>上传图片</span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>

      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { createStaff, getStaffById, updateRole } from '@/api/staff'
import { uploadImage } from '@/api/upload'
import { BASE_URL } from '@/utils/request'
export default {
  data() {
    return {
      person: {},
      formData: {
        _id: '',
        name: '', // 绑定姓名数据
        gender: '', // 绑定性别数据
        phone: '', // 绑定电话数据
        idCard: '', // 绑定身份证号数据
        residenceAddress: '', // 绑定居住地址数据
        age: 0, // 绑定年龄数据
        employmentDate: null, // 绑定从业日期数据
        qualificationLevel: '', // 绑定资质级别数据
        qualificationCertificate: '', // 绑定资质证书图片URL
        avatar: '' // 绑定人员照片图片URL
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' }
          // 可以添加电话格式验证规则
        ],
        qualificationLevel: [
          { required: true, message: '请选择资质级别', trigger: 'change' }
        ],
        personPhoto: [
          { required: true, message: '请上传人员照片', trigger: 'change' }
        ]
        // 可以添加更多字段的验证规则
      },
      qualificationCertificate: '', // 资质证书图片预览 URL
      avatar: '', // 人员照片图片预览 URL
      fileListcertificate: [],
      personPhotoList: []

    }
  },
  watch: {
    // Watch the uploaded image URLs and set form validity for required uploads
    personPhotoUrl(newVal) {
      if (newVal) {
        this.$refs.personForm.clearValidate('personPhoto')
      }
    }
  },
  mounted() {
    // 组件挂载后获取初始数据
    this.fetchPersonInfo()
  },
  methods: {
    save() {
      this.$refs.personForm.validate(valid => {
        if (!valid) {
          this.$message.warning('请填写完整信息')
          return
        }
        const id = this.$route.params.id;
        if (id) {
          updateRole(id, this.formData)
            .then(response => {
              if (response.success === true) {
                this.$message.success('更新成功')
                this.$router.push({ name: 'PersonList' })
              } else {
                this.$message.error('更新失败: ' + response.message)
              }
            })
            .catch(error => {
              this.$message.error('更新失败: ' + error.message)
            })
        }
        else {
           createStaff(this.formData)
          .then(response => {
            // Handle successful response (e.g., navigate to the staff list)
            console.log(response)
            this.$router.push({ name: 'PersonList' })
            this.$message.success('员工保存成功!')
          })
          .catch(error => {
            // Handle error
            this.$message.error('员工保存失败!' + error.message)
          })
        }

        // Call addStaff to send the form data to the backend
      })
    },
    // 资质证书上传成功处理
    handleCertificateUploadSuccess(option) {
      uploadImage(option.file)
        .then(response => {
          // console.log('资质证书上传成功:', response);
          if (response.code === 200) {
            this.qualificationCertificate = BASE_URL + '/uploads' + response.filePath // Set preview image URL
            this.formData.qualificationCertificate = BASE_URL + '/uploads' + response.filePath
            this.$message.success('资质证书上传成功')
          } else {
            this.$message.error('资质证书上传失败: ' + response.message)
          }
        })
        .catch(error => {
          this.$message.error('资质证书上传失败: ' + error.message)
        })
    },

    // 资质证书上传前处理
    beforeCertificateUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2// 限制大小在2MB以内

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      return true // 返回 true 才会继续上传
    },

    // 人员照片上传成功处理
    handlePersonPhotoUploadSuccess(option) {
      uploadImage(option.file)
        .then(response => {
          console.log('人员照片上传成功:', response)
          if (response.code === 200) {
            this.avatar = BASE_URL + '/uploads' + response.filePath // Set preview image URL
            this.formData.avatar = BASE_URL + '/uploads' + response.filePath
            this.$message.success('人员照片上传成功')
          } else {
            this.$message.error('人员照片上传失败: ' + response.message)
          }
        })
        .catch(error => {
          this.$message.error('人员照片上传失败: ' + error.message)
        })
    },

    // 人员照片上传前处理
    beforePersonPhotoUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2// 限制大小在2MB以内

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      return true// 返回 true 才会继续上传
    },

    // 在组件创建时加载初始数据 (如果需要编辑现有人员信息)
    fetchPersonInfo() {
      // 这里模拟从后端获取人员信息
      const personId = this.$route.params.id // 假设从路由参数获取人员ID
      console.log('获取人员信息:', personId)
      if (personId) {
        getStaffById(personId).then(response => {
          this.formData = response.data
        })
      }
    }

  }
}
</script>

<style scoped>
.edit-person-info {
  padding: 20px;
  background-color: #f0f2f5;
  /* 背景颜色 */
}

.page-header {
  background-color: #fff;
  padding: 15px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  /* 添加底部细线 */
}

.page-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

/* 调整 Element UI 的一些默认样式 */
.el-form-item__label {
  font-weight: bold;
  /* 标签加粗 */
}

.el-input .el-input__inner,
.el-select .el-input__inner,
.el-date-editor .el-input__inner,
.el-input-number .el-input__inner {
  background-color: #f5f7fa;
  /* 模拟输入框背景色 */
  border-color: #dcdfe6;
}

/* 自定义头像上传样式 */
.avatar-uploader::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  /* 上传区域宽度 */
  height: 100px;
  /* 上传区域高度 */
  display: flex;
  /* flex 布局 */
  flex-direction: column;
  /* 垂直排列 */
  justify-content: center;
  /* 垂直居中 */
  align-items: center;
  /* 水平居中 */
  text-align: center;
  /* 文本居中 */
}

.avatar-uploader::v-deep .el-upload:hover {
  border-color: #409EFF;
}

.uploader-icon-text {
  color: #8c939d;
  font-size: 14px;
  /* 文字大小 */
  line-height: normal;
  /* 调整行高 */
}

.uploader-icon-text i {
  font-size: 28px;
  /* 相机图标大小 */
  margin-bottom: 8px;
  /* 图标和文字之间的间距 */
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
  /* 保持图片比例，填充容器 */
}

/* Puedes ajustar otros estilos según sea necesario */
</style>
