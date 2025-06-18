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
            type="text"
            id="phone"
            v-model="account.phone"
             placeholder="请输入电话号码"
            required
            class="form-input readonly-input"
            readonly="readonly"
            value="13890873478"
          />
        </div>

        <div class="form-group">
          <label for="username">
            <span class="required">*</span> 用户名:
          </label>
          <input
            type="text"
            id="username"
            v-model="account.username"
            placeholder="请输入用户名"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">
            <span class="required">*</span> 密码:
          </label>
          <input
            type="password"
            id="password"
            v-model="account.password"
             placeholder="请输入密码"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">
            <span class="required">*</span> 确认密码:
          </label>
          <input
            type="password"
            id="confirmPassword"
            v-model="account.confirmPassword"
            placeholder="请确认密码"
            required
            class="form-input"
          />
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
import PersonList from './personList.vue'

// import PersonCard from './personCard.vue'
// import PersonList from './personList.vue'

export default {
  name: 'CreateAccount',
  data() {
    return {
      account: {
        phone: '13890873478', // 示例中的电话号码似乎是预填的
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    // 处理表单提交 (新增)
    handleSubmit() {
      // 在这里可以进行简单的客户端验证，例如检查密码和确认密码是否一致
      if (this.account.password !== this.account.confirmPassword) {
        alert('密码和确认密码不一致！')
        return
      }

      console.log('提交创建账号:', this.account)
      // TODO: 在这里调用后端 API 创建账号
      // const newAccountData = {
      //   phone: this.account.phone, // 电话号码通常是唯一的标识符，可能不能修改或需要特别处理
      //   username: this.account.username,
      //   password: this.account.password,
      //   // 注意：不应该将 confirmPassword 发送到后端
      // };
      // fetch('/api/accounts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newAccountData),
      // })
      // .then(response => response.json())
      // .then(data => {
      //   if (data.success) {
      //     alert('账号创建成功！');
      //     this.handleClose(); // 关闭对话框
      //     // 可能需要刷新父组件的列表等
      //   } else {
      //     alert('创建失败: ' + data.error);
      //   }
      // })
      // .catch(error => {
      //   console.error('创建账号出错:', error);
      //   alert('创建过程中发生错误。');
      // });

      // 模拟创建成功的提示
      alert('账号创建成功！(模拟)')
      this.handleClose() // 模拟关闭对话框
    },

    // 处理重置按钮点击
    handleReset() {
      this.account = {
        phone: '13890873478', // 根据图片示例，电话号码重置后可能仍保留预填的值
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
