<template>
  <div class="dashboard-container">
    <div class="loading-wrapper" v-if="loading">
      <i class="el-icon-loading"></i>
      <span>正在加载...</span>
    </div>
  </div>
</template>

<script>
import { isOwner, isAdmin } from '@/utils/roleUtils'

export default {
  name: 'Dashboard',
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.redirectBasedOnRole()
  },
  methods: {
    redirectBasedOnRole() {
      // 根据用户角色跳转到不同页面
      // isOwner() 会检查 'owner' 和 'customer' 两种角色
      if (isOwner()) {
        // 业主跳转到项目管理 - 维保计划管理
        this.$router.replace('/owner/plan')
      } else if (isAdmin()) {
        // 管理员跳转到数字大屏
        this.$router.replace('/digital-screen/digitalScreen')
      } else {
        // 其他角色跳转到项目管理
        this.$router.replace('/owner/plan')
      }
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #409eff;
  font-size: 16px;
}

.loading-wrapper i {
  font-size: 48px;
}
</style>
