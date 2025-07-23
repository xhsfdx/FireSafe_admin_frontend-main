<template>
  <div class="container">
    <!-- 顶部保存按钮 -->
    <div class="header">
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>

    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="form-content">
      <el-row :gutter="20">
        <!-- 左列 -->
        <el-col :span="12">
          <!-- 业主单位 -->
          <el-form-item label="业主单位" prop="company">
            <el-select v-model="form.company" placeholder="请选择业主单位" filterable :loading="loadingCompanies">
              <el-option v-for="item in companyOptions" :key="item.value" :label="item.lable"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <!-- 姓名 -->
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>

          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <!-- 电话号码 -->
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入电话号码"></el-input>
          </el-form-item>
        </el-col>

        <!-- 右列 -->
        <el-col :span="12">
          <!-- 用户角色 -->
          <el-form-item label="用户角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择用户角色">
              <el-option label="社会单位管理员" value="社会单位管理员"></el-option>
              <el-option label="社会单位人员" value="社会单位人员"></el-option>
            </el-select>
          </el-form-item>

          <!-- 输入密码 -->
          <el-form-item label="输入密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input v-model="form.confirmpassword" type="password" placeholder="请再次输入密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getcustomers, Createcustomer } from '@/api/customer'
export default {
  name: 'AddCustomerForm',
  data() {
    const validateConfirmpassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      // 表单数据
      form: {
        company: '',
        name: '',
        username: '',
        phone: '',
        role: '',
        password: '',
        confirmPassword: ''
      },
      // 业主单位选项
      companyOptions: [],
      // 加载状态
      loadingCompanies: false,
      // 表单验证规则
      rules: {
        company: [{ required: true, message: '请选择业主单位', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        role: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmpassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmpassword, trigger: 'blur' }
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
        const res = await getcustomers()
        const rawData = res.data || []

        console.log(rawData)
        // 动态生成 orgList
        const orgs = [...new Set(rawData.map(item => item.organization))]

        this.companyOptions = orgs.map(item => ({
          label: item,
          value: item
        }))

        this.company = orgs[0] || ''

        console.log(this.companyOptions)
        this.$message.success('数据加载成功')
      } catch (err) {
        console.error(err)
        this.$message.error('加载数据失败')
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 提交数据
          const data = {
            organization: this.form.company,
            mobile: this.form.phone,
            name: this.form.name,
            username: this.form.username,
            password: this.form.password,
            role: this.form.role
          }
          const res = Createcustomer(data)
          if (res.code === 200) {
            this.$message.success(res.msg)
          }
          else {
            this.$message.error("创建用户失败")
          }
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background: #fff;
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.form-content {
  max-width: 100%;
}

.el-input,
.el-select {
  width: 100%;
}
</style>
