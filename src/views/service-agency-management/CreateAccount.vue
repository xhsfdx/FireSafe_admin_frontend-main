<template>
  <div class="create-account-dialog">
    <div class="dialog-header">
      <h3>创建账号</h3>
      <!-- <button class="close-button" @click="handleClose">&times;</button> -->
    </div>
    <div class="dialog-body">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="phone">
            <span class="required">*</span> 电话号码:
          </label>
          <input
            id="phone"
            v-model="account.phone"
            type="text"
            placeholder="请输入电话号码"
            required
            class="form-input readonly-input"
            readonly
          >
        </div>

        <div class="form-group">
          <label for="username">
            <span class="required">*</span> 用户名:
          </label>
          <input
            id="username"
            v-model="account.name"
            type="text"
            placeholder="请输入用户名"
            required
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="password">
            <span class="required">*</span> 密码:
          </label>
          <input
            id="password"
            v-model="account.password"
            type="password"
            placeholder="请输入密码"
            required
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">
            <span class="required">*</span> 确认密码:
          </label>
          <input
            id="confirmPassword"
            v-model="account.confirmPassword"
            type="password"
            placeholder="请确认密码"
            required
            class="form-input"
          >
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">保存</button>
          <button type="button" class="btn btn-secondary" @click="close">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import PersonList from './PersonList.vue'
import { createUser, getStaffById } from '@/api/staff'
// import PersonCard from './PersonCard.vue'
// import PersonList from './PersonList.vue'

export default {
  name: 'CreateAccount',
  data() {
    return {
      account: {
        phone: '', // 从路由参数或查询参数中获取电话号码
        name: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  created() {
    // 从路由查询参数中获取电话号码
    const phoneFromQuery = this.$route.query.phone
    if (phoneFromQuery) {
      this.account.phone = phoneFromQuery
      // 读取后立即清除查询参数，避免保留历史记录
      this.$nextTick(() => {
        this.clearQueryParams()
      })
    } else {
      // 如果有ID但没有phone参数，尝试从API获取人员信息
      const id = this.$route.params.id
      if (id) {
        this.fetchStaffPhone(id)
      }
    }
  },
  beforeDestroy() {
    // 组件销毁前清除查询参数
    this.clearQueryParams()
  },
  methods: {
    // 清除路由查询参数
    clearQueryParams() {
      if (this.$route.query.phone) {
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params,
          query: {}
        })
      }
    },
    // 获取人员电话号码
    async fetchStaffPhone(id) {
      try {
        const res = await getStaffById(id)
        if (res.success && res.data && res.data.phone) {
          this.account.phone = res.data.phone
        }
      } catch (error) {
        console.error('获取人员信息失败:', error)
      }
    },
    // 处理表单提交 (新增)
    async handleSubmit() {
      // 在这里可以进行简单的客户端验证，例如检查密码和确认密码是否一致
      if (this.account.password !== this.account.confirmPassword) {
        this.$message.error('密码和确认密码不一致！')
        return
      }
      
      // 检查是否有员工ID
      const id = this.$route.params.id
      if (!id) {
        this.$message.error('缺少员工ID，无法创建账号')
        return
      }
      
      // 检查电话号码
      if (!this.account.phone) {
        this.$message.error('电话号码不能为空')
        return
      }
      
      try {
        // 准备发送给后端的数据（后端期望 username, password, mobile）
        const accountData = {
          username: this.account.name,
          password: this.account.password,
          mobile: this.account.phone // 后端使用 mobile 字段
        }
        
        // 使用 createUser API，它对应后端的 /staff/usercreate/:id 端点
        const res = await createUser(id, accountData)
        
        if (res.success) {
          this.$message.success('账号创建成功')
          this.$router.push({ name: 'PersonList' })
        } else {
          this.$message.error(res.message || '账号创建失败')
        }
      } catch (error) {
        console.error('创建账号失败:', error)
        this.$message.error(error.response?.data?.message || '创建账号失败，请重试')
      }
    },

    // 处理重置按钮点击
    handleReset() {
      this.account = {
        phone: '', // 根据图片示例，电话号码重置后可能仍保留预填的值
        username: '',
        password: '',
        confirmPassword: ''
      }
      console.log('表单已重置')
    },

    // 处理关闭按钮点击
    handleClose() {
      // console.log('关闭创建账号对话框')
      // TODO: 在父组件中通过事件通知来关闭这个对话框
      // this.$emit('close')
      // this.$router.push({ name: PersonList })
      // 或者使用其他方式来控制这个组件的显示/隐藏
    },
    close() {
      this.$router.push({ name: 'PersonList' })
    }
  }
}
</script>

<style scoped>
/* 对话框容器 */
.create-account-dialog {
  width: 700px; /* 根据图片大致估算一个宽度 */
  margin: 120px auto; /* 居中显示，并与顶部有间距 */
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 确保圆角生效 */
  position: relative; /* 用于定位关闭按钮 */
}

/* 对话框头部 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  background-color: #f5f7fa; /* 头部背景色 */
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
  padding: 0;
  line-height: 1; /* 避免按钮高度不一致 */
}

.close-button:hover {
  color: #606266;
}

/* 对话框主体 */
.dialog-body {
  padding: 20px;
}

/* 表单组 */
.form-group {
  margin-bottom: 15px; /* 每个表单项之间的间隔 */
  display: flex; /* 让 label 和 input 在同一行 */
  align-items: center; /* 垂直居中对齐 */
}

.form-group label {
    width: 90px; /* 设置 label 的宽度，根据图片调整 */
    flex-shrink: 0; /* 防止 label 被压缩 */
    margin-right: 10px; /* label 和输入框之间的间隔 */
    font-size: 14px;
    color: #606266;
    text-align: right; /* 标签右对齐 */
}

.required {
    color: #f56c6c; /* 星号颜色 */
    margin-right: 4px;
}

.form-input {
  flex-grow: 1; /* 输入框占据剩余空间 */
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5; /* 保持输入框内容垂直居中 */
  box-sizing: border-box; /* 包含 padding 和 border 在总宽度内 */
  height: 36px; /* 统一输入框高度 */
}

.form-input::placeholder {
    color: #c0c4cc; /* placeholder 颜色 */
}

.form-input:focus {
  outline: none;
  border-color: #409EFF; /* focus 时的边框颜色 */
}

/* 电话号码输入框的特殊样式 (根据图片中似乎禁用且有值) */
.readonly-input {
    background-color: #f5f7fa; /* 禁用或只读输入框背景色 */
    cursor: not-allowed; /* 鼠标样式 */
}

/* 底部操作按钮区域 */
.form-actions {
  margin-top: 20px;
  text-align: center; /* 按钮居中 */
  display: flex;
  justify-content: center; /* 如果需要多个按钮，flex 会更好 */
  gap: 20px; /* 按钮之间的间隔 */
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  height: 36px; /* 统一按钮高度 */
}

.btn-primary {
  background-color: #409EFF;
  color: white;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-secondary {
   background-color: #fff; /* 重置按钮的背景色 */
   color: #606266; /* 重置按钮的文字颜色 */
   border: 1px solid #dcdfe6; /* 重置按钮的边框 */
}

.btn-secondary:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
}

/* 可以根据需要调整整体布局和间距 */
</style>
