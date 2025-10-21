<template>
  <div class="edit-customer-account-page">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span>系统管理</span> &gt;
      <span>业主单位账号</span> &gt;
      <span>编辑客户单位账号</span>
    </div>

    <div class="main-card">
      <div class="card-header">
        <span class="title">编辑客户单位账号</span>
        <el-button type="primary" style="float:right;" @click="onSave">保存</el-button>
        <el-button icon="el-icon-back" class="back-btn" @click="onBack">返回</el-button>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="edit-form">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="业主单位" prop="org">
              <el-input v-model="form.organization" placeholder="请选择单位" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" disabled />
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户角色" prop="role">
              <el-select v-model="form.role" disabled>
                <el-option label="社会单位管理员" value="社会单位管理员" />
              </el-select>
            </el-form-item>
            <el-form-item label="输入密码" prop="password">
              <el-input v-model="form.password" type="password" placeholder="请输入用户名的密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
  </div>
</template>

<script>
import { getcustomerDetail, Updatecustomer } from '@/api/customer'

export default {
  name: 'EditCustomerAccount',
  data() {
    return {
      form: {
        organization: '',
        name: '',
        username: '',
        phone: '',
        role: '',
        password: '',
        confirmPassword: ''
      },
      originForm: {},
      rules: {
        organization: [{ required: true, message: '请选择业主单位', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
        password: [{ required: false, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [
          { required: false, message: '请再次输入密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次密码输入不一致'))
              } else {
                 console.log('fuck password')
                callback()
              }
            }, trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const id = this.$route.query.id
        if (!id) {
          this.$message.error('缺少用户ID')
          return
        }

        const res = await getcustomerDetail(id)
        if (res.code === 200 && res.data) {
          const data = res.data

          // 填充 this.form（保留响应式）
          Object.assign(this.form, {
            organization: data.organization,
            name: data.name,
            username: data.username,
            phone: data.mobile,
            role: data.role,
            password: '',
            confirmPassword: ''
          })

          // 保存一份原始数据用于对比
          this.originForm = { ...this.form }
          console.log('fuck A')
          this.$message.success('加载成功')
        } else {
          this.$message.error(res.msg || '获取详情失败')
        }
      } catch (err) {
        console.error(err)
        this.$message.error('接口请求失败')
      }
    },
    async onSave() {
      console.log('fuck B')
      const self = this; // 保存 this
      this.$refs.form.validate(async valid => {
        if (valid) {
          const id = this.$route.query.id
          if (!id) {
            this.$message.error('缺少用户ID')
            return
          }
          // 生成变更字段对象
          const updateData = {}

          // 对比初始数据和当前表单，生成差异字段
          const fields = ['organization', 'name', 'username', 'phone', 'role', 'password']
          console.log('fuck c')
          fields.forEach(key => {
            if (key === 'password') {
              if (self.form.password) {
                updateData.password = self.form.password // 密码不做对比，填写了就更新
              }
            } else if (self.form[key] !== self.originForm[key]) {
              updateData[key] = self.form[key]
            }
          })

          if (Object.keys(updateData).length === 0) {
            this.$message.info('没有需要更新的内容')
            return
          }

          try {
            const res = await Updatecustomer(id, updateData)
            if (res.code === 200) {
              this.$message.success('保存成功！')
              this.$router.back()
            } else {
              this.$message.error(res.msg || '保存失败')
            }
          } catch (err) {
            console.error(err)
            this.$message.error('接口请求失败')
          }

          // 提交逻辑
        }
      })
    },
    onBack() {
      this.$router.back()
    },
    onSetting() {
      this.$message.info('设置按钮')
    }
  }
}

</script>

<style scoped>
.edit-customer-account-page {
  min-height: 100vh;
  background: #f8fafd;
  padding: 18px 24px;
  position: relative;
}

.breadcrumb {
  color: #aaa;
  margin-bottom: 16px;
  font-size: 14px;
}

.main-card {
  background: #fff;
  border-radius: 10px;
  padding: 28px 34px 28px 34px;
  min-height: 350px;
  box-shadow: 0 2px 14px #ebeefa55;
  position: relative;
}

.card-header {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  background: #eaf3ff;
  border-radius: 6px 6px 0 0;
  padding: 20px 24px 10px 14px;
  position: relative;
}

.title {
  margin-right: 15px;
}

.back-btn {
  float: right;
  margin-left: 8px;
}

.edit-form {
  margin-top: 12px;
}

.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
