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
          <!-- 业主单位（支持多选） -->
          <el-form-item label="业主单位" prop="company">
            <el-select v-model="form.company" placeholder="请选择业主单位（可多选）" filterable :loading="loadingCompanies" clearable multiple>
              <el-option
                v-for="item in companyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <!-- 姓名 -->
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>

          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>

          <!-- 电话号码 -->
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入电话号码" />
          </el-form-item>
        </el-col>

        <!-- 右列 -->
        <el-col :span="12">
          <!-- 输入密码 -->
          <el-form-item label="输入密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" />
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input v-model="form.confirmpassword" type="password" placeholder="请再次输入密码" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getAllOrganizations, Createcustomer } from '@/api/customer'
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
        company: [], // 改为数组，支持多个业主单位
        name: '',
        username: '',
        phone: '',
        password: '',
        confirmpassword: ''
      },
      // 业主单位选项
      companyOptions: [],
      // 加载状态
      loadingCompanies: false,
      // 表单验证规则
      rules: {
        company: [
          { required: true, message: '请至少选择一个业主单位', trigger: 'change' },
          { type: 'array', min: 1, message: '请至少选择一个业主单位', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
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
      this.loadingCompanies = true
      try {
        const res = await getAllOrganizations()
        console.log('组织数据响应:', res)

        if (res.code === 200 && res.data) {
          const companyNames = res.data || []

          // 格式化选项（现在 data 是字符串数组）
          this.companyOptions = companyNames.map(companyName => ({
            label: companyName,
            value: companyName // 直接使用 ownerCompany 字符串
          }))

          console.log('组织选项:', this.companyOptions)
          if (this.companyOptions.length > 0) {
            this.$message.success('数据加载成功')
          } else {
            this.$message.warning('暂无业主单位，请先创建组织')
          }
        } else {
          this.$message.error(res.msg || '加载数据失败')
        }
      } catch (err) {
        console.error('加载数据失败:', err)
        this.$message.error('加载数据失败: ' + (err.message || '未知错误'))
      } finally {
        this.loadingCompanies = false
      }
    },
    async onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            // 提交数据
            const data = {
              organization: this.form.company, // ownerCompany 字符串
              mobile: this.form.phone,
              name: this.form.name,
              username: this.form.username,
              password: this.form.password
              // role 固定为 "customer"，不需要前端传递
            }

            console.log('提交数据:', data)
            const res = await Createcustomer(data)
            console.log('创建响应:', res)

            if (res.code === 200) {
              this.$message.success(res.msg || '创建用户成功')
              // 重置表单
              this.$refs.form.resetFields()
              // 重新加载组织列表（以防有新增）
              await this.loadData()
            } else {
              this.$message.error(res.msg || '创建用户失败')
            }
          } catch (error) {
            console.error('创建用户失败:', error)
            this.$message.error('创建用户失败: ' + (error.response?.data?.msg || error.message || '未知错误'))
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
