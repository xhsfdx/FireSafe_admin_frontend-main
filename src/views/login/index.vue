<template>
  <div class="login-page">
    <div class="login-container">
      <div class="left-panel">
        <div class="ai-block">
          <!-- <div class="ai-label">AI</div> -->
          <div class="cloud-icon">
            <!-- <i class="el-icon-setting"></i> -->
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="logo-section">
          <img :src="require('@/assets/logo.jpeg')" alt="logo" class="logo">
          <div class="title">四川省消防协会</div>
          <div class="subtitle">消防维保服务管理系统</div>
        </div>

        <el-form ref="loginForm" :model="loginForm" :rules="rules" class="form" label-position="top">
          <el-form-item label="用户名" prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" show-password />
          </el-form-item>

          <el-button type="primary" style="width: 100%;" @click="handleLogin">登录</el-button>

          <div class="create-account">
            <a href="#">创建账号 ></a>
          </div>

          <!-- <div class="version">当前版本：V1.0.02_20240126_Release</div> -->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: '17893248975',
        password: 'chaggle2022'
      },
      rules: {
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch((err) => {
              this.$message.error(err || '登录失败')
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.login-page {
  background: #eef3fb;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-container {
    display: flex;
    width: 900px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

    .left-panel {
      flex: 1;
      background: url("~@/assets/bg-left.png") no-repeat center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: white;
      padding: 20px;

      .ai-block {
        text-align: center;

        .ai-label {
          font-size: 64px;
          font-weight: bold;
        }

        .cloud-icon {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;

          i {
            margin-right: 8px;
          }
        }
      }
    }

    .right-panel {
      flex: 1;
      padding: 40px;
      position: relative;

      .logo-section {
        text-align: center;
        margin-bottom: 20px;

        .logo {
          width: 80px;
          height: 80px;
          margin-bottom: 10px;
        }

        .title {
          font-size: 22px;
          font-weight: bold;
        }

        .subtitle {
          font-size: 16px;
          color: #888;
          margin-top: 5px;
        }
      }

      .form {
        margin-top: 20px;
      }

      .create-account {
        margin-top: 10px;
        text-align: right;

        a {
          color: #409eff;
          font-size: 14px;
        }
      }

      .version {
        position: absolute;
        bottom: 10px;
        left: 40px;
        font-size: 12px;
        color: #aaa;
      }
    }
  }
}
</style>
