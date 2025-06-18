<template>
  <div class="person-card">
    <div class="top-section">
      <img class="avatar" :src="require('@/assets/person.png')" alt="头像" >
      <div class="text-info">
        <div class="name">{{ person.name }}</div>
        <div class="phone">{{ person.phone }}</div>
        <div class="title">{{ person.title }}</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="action-links">
      <span @click="goTo('PersonInfo')">人员信息</span>
      <span @click="goTo('ServiceUnit')">服务单位</span>
      <span @click="goTo('MaintenanceTasks')">维保任务</span>
      <span @click="goTo('CreateAccount')">创建账号</span>
      <span class="delete" @click="deletePerson">删除</span>
    </div>
  </div>
  </div>
  <!-- 在父组件的模板中 -->

</template>

<script>
import CreateAccount from './CreateAccount.vue'

// import { ref } from 'vue'
// import CreateAccount from '@/views/Service agency management/CreateAccount.vue'
// const isCreateAccountDialogVisible = ref(false)
// const showCreateAccountDialog = () => {
//   isCreateAccountDialogVisible.value = true
// };
// const handleAccountCreated = (accountData) => {
//   console.log('新创建的账号数据:', accountData)
//   // TODO: 在父组件中刷新用户列表或其他相关操作
// };

export default {
  // components: {
  //   CreateAccount,
  // },
  name: 'PersonCard',
  data() {
    return {
      isCreateAccountDialogVisible: false, // 控制模态框的显示
      prefilledPhone: '', // 用于存储预填的手机号
      person: {
        name: '林根',
        phone: '13508270870',
        title: '消防设施操作员'
      }
    }
  },
  methods: {
    showCreateAccountDialog() {
      // 假设我们要预填一个手机号
      this.prefilledPhone = '13508270870'
      this.isCreateAccountDialogVisible = true
    },
    // 处理账号创建成功事件
    handleAccountCreated(accountData) {
      console.log('新创建的账号数据:', accountData)
      // TODO: 在这里执行账号创建成功后的后续操作
    },
    goTo(routeName) {
      this.$router.push({ name: routeName })
      console.log('跳转到：')
    },
    deletePerson() {
      this.$confirm('确认删除该人员信息吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        // TODO: 调用删除接口
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style scoped>
.person-card {
  width: 307px;
  background: #f0f7ff;
  border-radius: 10px;
  padding: 20px 20px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-family: "Microsoft YaHei", sans-serif;
}

.top-section {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 100px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 15px;
  background-color: #fff;
}

.text-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-info .name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.text-info .phone {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.text-info .title {
  font-size: 14px;
  color: #666;
}

.divider {
  height: 1px;
  background: #e4e7ed;
  margin: 15px 0 10px;
}

.action-links {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 14px;
}

.action-links span {
  color: #0066cc;
  cursor: pointer;
  margin: 5px 0;
  transition: color 0.2s;
}

.action-links span:hover {
  text-decoration: underline;
}

.action-links .delete {
  color: #ff4d4f;
}
</style>
