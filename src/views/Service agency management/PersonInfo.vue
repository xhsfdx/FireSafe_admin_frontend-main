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
            <el-form-item label="居住地址" prop="residentialAddress">
              <el-input v-model="formData.residentialAddress" placeholder="请输入居住地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 性别" prop="gender">
              <el-select v-model="formData.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
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
                <!-- 添加更多资质级别选项 -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资质证书">
              <el-upload class="avatar-uploader" action="handleCertificateUploadSuccess" :show-file-list="false"
                :on-success="handleCertificateUploadSuccess" :before-upload="beforeCertificateUpload"> <!-- 上传前钩子 -->
                <img v-if="certificateImageUrl" :src="certificateImageUrl" class="avatar"> <!-- 预览图片 -->
                <div v-else class="uploader-icon-text">
                  <i class="el-icon-camera"></i>
                  <span>上传图片</span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 人员照片">
              <el-upload class="avatar-uploader" action="hand" :show-file-list="false"
                :on-success="handlePersonPhotoUploadSuccess" :before-upload="beforePersonPhotoUpload"> <!-- 上传前钩子 -->
                <img v-if="personPhotoUrl" :src="personPhotoUrl" class="avatar"> <!-- 预览图片 -->
                <div v-else class="uploader-icon-text">
                  <i class="el-icon-camera"></i>
                  <span>上传图片</span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>

      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { addStaff } from '@/api/staff'
import { uploadImage } from '@/api/upload'
export default {
  data() {
    return {
      person: {},
      created() {
        const id = this.$route.params.id
        const people = JSON.parse(localStorage.getItem('people')) || []
        this.person = people.find(p => p.id === id) || {}
      },
      formData: {
        name: '', // 绑定姓名数据
        gender: '', // 绑定性别数据
        phone: '', // 绑定电话数据
        idCard: '', // 绑定身份证号数据
        residentialAddress: '', // 绑定居住地址数据
        age: 0, // 绑定年龄数据
        employmentDate: null, // 绑定从业日期数据
        qualificationLevel: '', // 绑定资质级别数据
        certificateImageUrl: '', // 绑定资质证书图片URL
        personPhotoUrl: '' // 绑定人员照片图片URL
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
      certificateImageUrl: '', // 资质证书图片预览 URL
      personPhotoUrl: '' // 人员照片图片预览 URL
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
      const formData = {
        name: this.formData.name,
        gender: this.formData.gender,
        phone: this.formData.phone,
        idCard: this.formData.idCard,
        residentialAddress: this.formData.residentialAddress,
        age: this.formData.age,
        employmentDate: this.formData.employmentDate,
        qualificationLevel: this.formData.qualificationLevel,
        certificateImageUrl: this.formData.certificateImageUrl,
        personPhotoUrl: this.formData.personPhotoUrl
      };

      // Call addStaff to send the form data to the backend
      addStaff(formData)
        .then(response => {
          // Handle successful response (e.g., navigate to the staff list)
          this.$router.push({ name: 'personList' });
          this.$message.success('Staff saved successfully!');
        })
        .catch(error => {
          // Handle error
          this.$message.error('Error saving staff: ' + error.message);
        });
    },
    // 保存按钮点击事件
    // savePerson() {
    //   this.$refs.personForm.validate((valid) => {
    //     if (valid) {
    //       // 表单验证通过，可以提交数据到后端
    //       console.log('表单数据:', this.formData)
    //       // 触发保存数据的后端请求
    //       axios.post('/api/savePersonInfo', this.formData)
    //         .then(response => {
    //           if (response.data.code === 200) {
    //             this.$message.success('保存成功')
    //             // 保存成功后跳转到 personList 页面
    //             this.$router.push({ name: 'personList' }) // 使用路由名称跳转
    //           } else {
    //             this.$message.error('保存失败: ' + response.data.message)
    //           }
    //         })
    //         .catch(error => {
    //           this.$message.error('保存失败')
    //           console.error('保存错误:', error)
    //         })

    //       // 这里只是模拟保存成功并跳转
    //       this.$message.success('保存成功 (模拟)')
    //       // 模拟成功后跳转
    //       this.$router.push({ name: 'personList' }) // 请确保你的路由配置中有一个名为 'personList' 的路由
    //     } else {
    //       console.log('表单验证失败')
    //       this.$message.warning('请检查填写信息') // 提示用户检查信息
    //       return false
    //     }
    //   })
    // },

    // 资质证书上传成功处理
    handleCertificateUploadSuccess(file) {
      // Assuming file contains the selected file for upload
      // Call uploadImage to handle the file upload
      uploadImage(file)
        .then(response => {
          console.log('资质证书上传成功:', response);

          // Handle the response (assuming structure: { code: 200, message: '上传成功', data: { url: '图片访问地址', fileId: '文件ID' } })
          if (response.code === 200) {
            this.certificateImageUrl = response.data.url; // Set preview image URL
            // Also update the formData with the URL
            this.formData.certificateImageUrl = response.data.url;
            this.$message.success('资质证书上传成功');
          } else {
            this.$message.error('资质证书上传失败: ' + response.message);
          }
        })
        .catch(error => {
          // Handle upload error
          this.$message.error('资质证书上传失败: ' + error.message);
        });
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
    handlePersonPhotoUploadSuccess(response, file, fileList) {
      console.log('人员照片上传成功:', response)
      if (response.code === 200) {
        this.personPhotoUrl = response.data.url// 设置预览图片URL
        // 可能需要同时更新 formData 中的照片URL
        this.formData.personPhotoUrl = response.data.url

        // 手动触发人员照片的表单验证更新 (解决必填项在上传后仍然提示的问题)
        this.$refs.personForm.validateField('personPhoto')

        this.$message.success('人员照片上传成功')
      } else {
        this.$message.error('人员照片上传失败: ' + response.message)
      }
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
      if (personId) {
        axios.get('/api/getPersonInfo/' + personId)
          .then(response => {
            if (response.data.code === 200) {
              this.formData = response.data.data
              // 初始化图片URL
              this.certificateImageUrl = this.formData.certificateImageUrl
              this.personPhotoUrl = this.formData.personPhotoUrl
            } else {
              this.$message.error('获取人员信息失败: ' + response.data.message)
            }
          })
          .catch(error => {
            this.$message.error('获取人员信息失败')
            console.error('获取错误:', error)
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
