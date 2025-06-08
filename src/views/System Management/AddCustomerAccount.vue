<template>
  <div class="add-account-page">
    <div class="header-bar">
      <span class="title">新增客户单位账号</span>
      <el-button type="primary" size="medium" style="float:right" @click="onSubmit">保存</el-button>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
      class="main-form"
    >
      <el-row :gutter="40">
        <el-col :span="8">
          <el-form-item label="业主单位" prop="unit">
            <el-select v-model="form.unit" placeholder="请选择业主单位" clearable>
              <el-option v-for="item in units" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="* 姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="* 用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="* 电话号码" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入电话号码" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="* 用户角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择角色" clearable>
              <el-option label="社会单位人员" value="社会单位人员" />
              <el-option label="社会单位管理员" value="社会单位管理员" />
            </el-select>
          </el-form-item>
          <el-form-item label="* 输入密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入用户名的密码" />
          </el-form-item>
          <el-form-item label="* 确认密码" prop="confirmPwd">
            <el-input v-model="form.confirmPwd" type="password" placeholder="请再次输入密码" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddCustomerAccount',
  data() {
    return {
      form: {
        unit: '',
        name: '',
        username: '',
        phone: '',
        role: '',
        password: '',
        confirmPwd: ''
      },
      units: ['小学', '高坪汽车站'],
      rules: {
        unit: [{ required: true, message: '请选择业主单位', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value !== this.form.password) callback(new Error('两次输入的密码不一致'))
            else callback()
          }, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('保存成功！（这里只做演示，实际应提交后端）')
        }
      })
    }
  }
}
</script>

<style scoped>
.add-account-page {
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
  padding: 26px 20px 36px 20px;
  box-shadow: 0 2px 10px 0 #edf6ff3d;
}
</style>
