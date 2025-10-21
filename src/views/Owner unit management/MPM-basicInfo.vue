<template>
  <div class="basic-info-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">业主单位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">维保点位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">维保点位管理详情</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">基础信息</span>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">基础信息</h1>
        <div class="point-info" v-if="pointInfo.pointName">
          <span class="point-name-label">点位名称：</span>
          <span class="point-name-value">{{ pointInfo.pointName }}</span>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="goBack">
            <i class="el-icon-back"></i> 返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-container" v-loading="loading" element-loading-text="加载中...">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="basic-form">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="点位名称" prop="pointName" required>
              <el-input v-model="form.pointName" placeholder="请输入点位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="点位类型" prop="pointType" required>
              <el-select v-model="form.pointType" placeholder="请选择" style="width: 100%">
                <el-option label="NFC" value="NFC" />
                <el-option label="二维码" value="二维码" />
                <el-option label="普通" value="普通" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="点位照片">
              <el-upload
                class="upload-demo"
                action="#"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
              >
                <div class="upload-area">
                  <i class="el-icon-camera upload-icon"></i>
                  <div class="upload-text">上传图片</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'MPMBasicInfo',
  data() {
    return {
      form: {
        pointName: '',
        pointType: '',
        address: '',
        photo: ''
      },
      rules: {
        pointName: [{ required: true, message: '请输入点位名称', trigger: 'blur' }],
        pointType: [{ required: true, message: '请选择点位类型', trigger: 'change' }]
      },
      pointInfo: {
        pointName: '',
        pointType: '',
        address: '',
        photo: '',
        projectName: '',
        entrustName: ''
      },
      loading: false
    }
  },
  mounted() {
    this.loadPointInfo()
  },
  methods: {
    // 加载点位信息
    async loadPointInfo() {
      try {
        this.loading = true
        const pointId = this.$route.params.pointId
        const planId = this.$route.query.planId // 从查询参数获取planId
        console.log('加载点位基础信息，点位ID:', pointId, '计划ID:', planId)
        
        if (!pointId) {
          this.$message.error('缺少点位ID')
          return
        }
        
        if (!planId) {
          this.$message.error('缺少维保计划ID')
          return
        }
        
        // 调用后端API获取维保计划的所有点位
        const response = await request.get(`/point/maintainPoint/${planId}/checkpoint`)
        console.log('维保计划点位API响应:', response)
        
        if (response.success && response.data) {
          const planData = response.data
          console.log('维保计划数据:', planData)
          
          // 从checkpoints中查找对应的点位
          if (planData.checkpoints && Array.isArray(planData.checkpoints)) {
            const targetPoint = planData.checkpoints.find(checkpoint => checkpoint._id === pointId)
            
            if (targetPoint) {
              console.log('找到目标点位:', targetPoint)
              
              // 更新表单数据
              this.form = {
                pointName: targetPoint.name || '',
                pointType: targetPoint.type || '',
                address: targetPoint.address || '',
                photo: targetPoint.photo || ''
              }
              
              // 更新显示用的点位信息
              this.pointInfo = {
                pointName: targetPoint.name || '',
                pointType: targetPoint.type || '',
                address: targetPoint.address || '',
                photo: targetPoint.photo || '',
                projectName: planData.plan?.projectName || '未知项目',
                entrustName: planData.plan?.ownerName || '未知委托单位'
              }
              
              console.log('点位基础信息加载完成:', this.form)
              console.log('点位显示信息:', this.pointInfo)
            } else {
              this.$message.error('未找到对应的点位信息')
              this.setDefaultData()
            }
          } else {
            this.$message.error('维保计划中没有点位数据')
            this.setDefaultData()
          }
        } else {
          this.$message.error(response.message || '获取点位信息失败')
          this.setDefaultData()
        }
        
      } catch (error) {
        console.error('加载点位基础信息失败:', error)
        this.$message.error('加载点位信息失败: ' + (error.message || '未知错误'))
        this.setDefaultData()
      } finally {
        this.loading = false
      }
    },

    // 设置默认数据
    setDefaultData() {
      this.form = {
        pointName: '未知点位',
        pointType: '未知类型',
        address: '未知地址',
        photo: ''
      }
      this.pointInfo = {
        pointName: '未知点位',
        pointType: '未知类型',
        address: '未知地址',
        photo: '',
        projectName: '未知项目',
        entrustName: '未知委托单位'
      }
    },

    // 上传相关方法
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }
      return true
    },

    handleUploadSuccess(response, file) {
      this.form.photo = response.url || file.url
      this.$message.success('图片上传成功')
    },

    // 保存方法
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.savePointInfoToServer(this.form)
        } else {
          this.$message.error('请填写必填字段')
          return false
        }
      })
    },

    // 保存点位信息到后端
    async savePointInfoToServer(formData) {
      try {
        const pointId = this.$route.params.pointId
        console.log('保存点位基础信息:', formData)
        
        if (!pointId) {
          this.$message.error('缺少点位ID')
          return
        }
        
        // 构建请求数据
        const requestData = {
          name: formData.pointName,
          type: formData.pointType,
          address: formData.address,
          photo: formData.photo
        }
        
        console.log('发送到后端的请求数据:', requestData)
        
        // 调用后端API更新点位信息
        // 这里需要根据实际的API结构来调用
        const response = await request.put(`/point/checkpoint/${pointId}`, requestData)
        console.log('后端响应:', response)
        
        if (response.success) {
          this.$message.success('保存成功')
          
          // 保存成功后返回上一页
          setTimeout(() => {
            this.goBack()
          }, 1500)
        } else {
          this.$message.error(response.message || '保存失败')
        }
        
      } catch (error) {
        console.error('保存点位基础信息失败:', error)
        
        // 处理不同类型的错误
        if (error.response) {
          const errorMessage = error.response.data?.message || '服务器错误'
          this.$message.error(`保存失败: ${errorMessage}`)
        } else if (error.request) {
          this.$message.error('网络连接失败，请检查网络后重试')
        } else {
          this.$message.error('保存失败: ' + (error.message || '未知错误'))
        }
      }
    },
    
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.basic-info-page {
  padding: 20px;
  background: #f9fbfd;
  min-height: 100vh;
}

/* 面包屑导航 */
.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #666;
}

.breadcrumb-item.active {
  color: #409EFF;
  font-weight: bold;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: white;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.point-info {
  margin-top: 10px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 14px;
}

.point-name-label {
  color: rgba(255, 255, 255, 0.8);
  margin-right: 8px;
}

.point-name-value {
  color: white;
  font-weight: bold;
}

/* 表单容器 */
.form-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.basic-form {
  margin-bottom: 20px;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  width: 120px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409EFF;
}

.upload-icon {
  font-size: 24px;
  color: #999;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .basic-form .el-col {
    margin-bottom: 16px;
  }
}
</style>
