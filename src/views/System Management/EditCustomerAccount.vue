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
              <el-select v-model="form.org" placeholder="请选择单位">
                <el-option label="高坪汽车站" value="高坪汽车站" />
                <el-option label="小学" value="小学" />
              </el-select>
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
export default {
  name: 'EditCustomerAccount',
  data() {
    return {
      form: {
        org: '高坪汽车站',
        name: '王攀',
        username: 'wangpan',
        phone: '17683231030',
        role: '社会单位管理员',
        password: '',
        confirmPassword: ''
      },
      rules: {
        org: [{ required: true, message: '请选择业主单位', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              if (value !== this.form.password) {
                callback(new Error('两次密码输入不一致'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('保存成功！')
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
