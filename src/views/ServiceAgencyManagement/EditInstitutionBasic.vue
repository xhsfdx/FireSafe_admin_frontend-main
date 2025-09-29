<template>
  <div class="edit-enterprise-info">
    <div class="page-header">
      <h3>编辑机构基础信息</h3>
      <el-button type="primary" @click="saveInfo">保存</el-button>
    </div>

    <div class="form-container">
      <el-form ref="enterpriseForm" :model="formData" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 企业名称" prop="organizationName">
              <el-input v-model="formData.organizationName" placeholder="请输入企业名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入企业邮箱" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 统一社会信用代码" prop="unifiedSocialCreditCode">
              <el-input v-model="formData.unifiedSocialCreditCode" placeholder="请输入统一社会信用代码" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="* 企业法人" prop="legalPerson">
              <el-input v-model="formData.legalPerson" placeholder="请输入企业法人" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* 企业地址" prop="organizationAddress">
              <el-input v-model="formData.organizationAddress" placeholder="请输入企业地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人电话" prop="legalPersonPhone">
              <el-input v-model="formData.legalPersonPhone" placeholder="请输入法人电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业电话" prop="organizationPhone">
              <el-input v-model="formData.organizationPhone" placeholder="请输入企业电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维保主管" prop="maintenanceSupervisor">
              <el-input v-model="formData.maintenanceSupervisor" placeholder="请输入维保主管" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业网址" prop="organizationWebsite">
              <el-input v-model="formData.organizationWebsite" placeholder="请输入企业网址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主管电话" prop="supervisorPhone">
              <el-input v-model="formData.supervisorPhone" placeholder="请输入主管电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业简介" prop="organizationIntroduction">
              <el-input
                v-model="formData.organizationIntroduction"
                type="textarea"
                placeholder="请输入企业简介"
                :rows="4"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="* 系统标题" prop="systemTitle">
              <el-input v-model="formData.systemTitle" placeholder="请输入系统标题" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12" />
          <el-col :span="12">
            <el-form-item label="服务区域" prop="serviceRegion">
              <el-select v-model="formData.serviceRegion" placeholder="请选择服务区域">
                <el-option label="南充市" value="南充市" />
                <el-option label="成都市" value="成都市" />
                <!-- 添加更多服务区域选项 -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业照片">
              <el-upload
                class="upload-demo"
                :http-request="customUploadPhotos"
                :on-remove="handleRemovePhotos"
                :file-list="fileListPhotos"
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="是否有四川省网账号" prop="hasSichuanNetAccount">
              <div style="display: flex; align-items: center;" />
              <el-radio-group v-model="formData.hasSichuanNetAccount">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业LOGO">
              <el-upload
                class="upload-demo"
                :http-request="customUploadLogo"
                :on-remove="handleRemoveLogo"
                :file-list="fileListLogo"
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="* 业务类型" prop="businessType">
              <el-select v-model="formData.businessType" placeholder="请选择业务类型">
                <el-option label="消防设施检测" value="消防设施检测" />
                <el-option label="消防维护保养" value="消防维护保养" />
                <el-option label="消防安全评估" value="消防安全评估" />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="营业执照">
              <el-upload
                class="upload-demo"
                :http-request="customUploadLicense"
                :on-remove="handleRemoveLicense"
                :file-list="fileListLicense"
                list-type="picture-card"
                :limit="1"
                :on-exceed="() => $message.warning('最多上传 1 张营业执照')"
              >
                <i class="el-icon-plus" />
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
import { uploadImage } from '@/api/upload'
import { getOrganization, updateOrganization } from '@/api/organization'
export default {
  data() {
    return {
      // ImageUrl: 'http://localhost:9527/#/agency/basic/edit',
      formData: {
        organizationName: '四川不凡消防科技有限公司', // 绑定企业名称数据
        email: '', // 绑定企业邮箱数据
        unifiedSocialCreditCode: '91511302MA7FXFWY6L', // 绑定统一社会信用代码数据
        legalPerson: '', // 绑定企业法人数据
        organizationAddress: '四川省南充市顺庆区濛华南路二段115号法拉利', // 绑定企业地址数据
        legalPersonPhone: '', // 绑定法人电话数据
        organizationPhone: '13438783735', // 绑定企业电话数据
        maintenanceSupervisor: '', // 绑定维保主管数据
        organizationWebsite: '', // 绑定企业网址数据
        supervisorPhone: '', // 绑定主管电话数据
        organizationIntroduction: '', // 绑定企业简介数据
        systemTitle: '四川不凡消防科技有限公司', // 绑定系统标题数据
        serviceRegion: '南充市', // 绑定服务区域数据
        hasSichuanNetAccount: false, // 绑定是否有四川省网平台账号数据
        businessTypes: [], // 绑定业务类型数据
        enterprisePhotos: [], // 企业照片数组
        organizationPhoto: '', // 企业logo 单张
        businessLicense: '' // 营业执照 单张
      },
      // 表单验证规则
      rules: {
        enterpriseName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        socialCreditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
          // 可以添加更多格式验证规则
        ],
        enterpriseAddress: [
          { required: true, message: '请输入企业地址', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入企业法人', trigger: 'blur' }
        ],
        systemTitle: [
          { required: true, message: '请输入系统标题', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ]
        // 可以添加更多字段的验证规则
      },
      // 图片上传文件列表
      fileListPhotos: [], // 企业照片文件列表
      fileListLogo: [], // 企业LOGO文件列表
      fileListLicense: [], // 营业执照文件列表
      licenseImageUrl: '', // 营业执照图片预览 URL
      PhotoImageUrl: '', // 企业照片预览 URL
      LogoImageUrl: '' // 企业logo图片预览 URL
    }
  },
  // created() {
  //   this.fetchEnterpriseInfo(this.$route.params.id)
  // },
  mounted() {
    this.onLoad()
  },
  methods: {
    // 保存按钮点击事件
    async onLoad() {
      try {
        const res = await getOrganization()
        console.log(res)
        this.formData = res.data
      } catch (error) {
        this.$message.error(`出现错误${error.msg}`)
      }
    },
    saveInfo() {
      this.$refs.enterpriseForm.validate(async(valid) => {
        if (valid) {
          // 表单验证通过，可以提交数据到后端
          console.log('表单数据:', this.formData)
          // 触发保存数据的后端请求

          const res = await updateOrganization(this.formData)
          console.log(res.data)
          // 这里只是模拟保存成功
          this.$message.success('保存成功')
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
    // 上传企业照片
    customUploadPhotos(option) {
      uploadImage(option.file)
        .then(response => {
          if (response.code === 200) {
            this.PhotoImageUrl = response.filePath // Set preview image URL
            this.formData.PhotoImageUrl = response.filePath
            this.$message.success('企业照片上传成功')
          } else {
            this.$message.error('企业照片上传失败: ' + response.message)
          }
        })
        .catch(error => {
          this.$message.error('企业照片上传失败: ' + error.message)
        })
    },
    handleRemovePhotos(file) {
      this.fileListPhotos = this.fileListPhotos.filter(f => f.url !== file.url)
      this.formData.enterprisePhotos = this.formData.enterprisePhotos.filter(url => url !== file.url)
    },

    // 上传企业LOGO
    customUploadLogo(option) {
      uploadImage(option.file)
        .then(response => {
          // console.log('资质证书上传成功:', response);
          if (response.code === 200) {
            this.LogoImageUrl = response.filePath // Set preview image URL
            this.formData.LogoImageUrl = response.filePath
            this.$message.success('企业LOGO上传成功')
          } else {
            this.$message.error('企业LOGO上传失败: ' + response.message)
          }
        })
        .catch(error => {
          this.$message.error('企业LOGO上传失败: ' + error.message)
        })
    },
    handleRemoveLogo() {
      this.fileListLogo = []
      this.formData.enterpriseLogo = ''
    },

    // 上传营业执照
    customUploadLicense(option) {
      uploadImage(option.file)
        .then(response => {
          // console.log('资质证书上传成功:', response);
          if (response.code === 200) {
            this.licenseImageUrl = response.filePath // Set preview image URL
            this.formData.licenseImageUrl = response.filePath
            this.$message.success('营业执照上传成功')
          } else {
            this.$message.error('营业执照上传失败: ' + response.message)
          }
        })
        .catch(error => {
          this.$message.error('营业执照上传失败: ' + error.message)
        })
    },
    handleRemoveLicense() {
      this.fileListLicense = []
      this.licenseImageUrl = ''
      this.formData.businessLicense = ''
    },
    fetchEnterpriseInfo() {
      this.formData.enterprisePhotos = ['url1', 'url2']
      this.formData.enterpriseLogo = 'url3'
      this.formData.businessLicense = 'url4'
    }
  }
}
</script>

<style scoped>
.edit-enterprise-info {
  padding: 20px;
  background-color: #f0f2f5; /* 背景颜色 */
}

.page-header {
  background-color: #fff;
  padding: 15px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8; /* 添加底部细线 */
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
  font-weight: bold; /* 标签加粗 */
  /* width: 450px; */
}

.el-input .el-input__inner {
    background-color: #f5f7fa; /* 模拟输入框背景色 */
    border-color: #dcdfe6;
}

.el-textarea textarea {
     background-color: #f5f7fa; /* 模拟文本域背景色 */
      border-color: #dcdfe6;
}

.upload-tips {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
}

.upload-license-img {
    width: 50px;
    height: 50px;
    object-fit: contain; /* 保持图片比例 */
}

</style>

