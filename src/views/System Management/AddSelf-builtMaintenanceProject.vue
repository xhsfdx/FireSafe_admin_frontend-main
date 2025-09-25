<template>
  <div class="add-maintenance-project-page">
    <div class="header-bar">
      <span class="title">新增自建维保项目</span>
      <el-button type="primary" size="medium" style="float: right;" @click="onSubmit">保存</el-button>
    </div>

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="left"
      class="main-form"
    >
      <!-- 第一行：点位名称 + 点位类型 -->
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="* 点位名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入点位名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="* 点位类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择点位类型" clearable>
              <el-option label="二维码" value="二维码" />
              <el-option label="NFC" value="NFC" />
              <el-option label="蓝牙" value="蓝牙" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="content-box">
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="* 详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="维保项目">
              <el-input
                v-model="form.maintenanceItems"
                type="textarea"
                rows="4"
                placeholder="请输入维保项目，多个项目用逗号分隔"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="启用" value="enabled" />
                <el-option label="禁用" value="disabled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="extra-actions">
          <el-button type="primary" icon="el-icon-plus" @click="addExtraContent">
            新增内容
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { createMaintainProject } from '@/api/maintainProject'

export default {
  name: 'AddSelfBuiltMaintenanceProject',
  data() {
    return {
      loading: false,
      form: {
        name: '',
        type: '',
        address: '',
        maintenanceItems: [],
        status: 'enabled'
      },
      rules: {
        name: [{ required: true, message: '请输入点位名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择点位类型', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const data = {
              name: this.form.name,
              type: this.form.type,
              address: this.form.address,
              maintenanceItems: this.form.maintenanceItems ? this.form.maintenanceItems.split(',').map(item => item.trim()).filter(item => item) : [],
              status: this.form.status
            }
            
            console.log('提交数据:', data)
            const res = await createMaintainProject(data)
            console.log('创建响应:', res)
            
            if (res.success) {
              this.$message.success('保存成功！')
              // 重置表单
              this.$refs.form.resetFields()
              // 返回上一页
              this.$router.back()
            } else {
              this.$message.error(res.message || '保存失败')
            }
          } catch (error) {
            console.error('保存失败:', error)
            this.$message.error('保存失败')
          } finally {
            this.loading = false
          }
        }
      })
    },
    
    addExtraContent() {
      this.$message.info('自定义内容扩展区域，可根据需要实现')
    }
  }
}
</script>

<style scoped>
.add-maintenance-project-page {
  padding: 24px 16px;
  background: #fafcff;
  min-height: 100vh;
}
.header-bar {
  background: #e9f3fc;
  border-radius: 6px 6px 0 0;
  padding: 20px 24px 10px 24px;
  margin-bottom: 20px;
  position: relative;
}
.title {
  font-size: 22px;
  font-weight: bold;
  color: #222;
  line-height: 38px;
}
.main-form {
  background: #fff;
  border-radius: 0 0 8px 8px;
  padding: 20px 20px 36px 20px;
  box-shadow: 0 2px 10px 0 #edf6ff3d;
}
.content-box {
  border: 1px dashed #2c80ff80;
  padding: 16px 18px 10px 18px;
  border-radius: 6px;
  margin-top: 16px;
  background: #fcfdff;
  margin-bottom: 30px;
}
.extra-actions {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
