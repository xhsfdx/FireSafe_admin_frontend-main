<template>
  <div class="dashboard-container">
    <!-- 顶部标题和右侧信息区域 -->
    <div class="header">
      <div class="datetime">{{ currentDateTime }}</div>
      <el-button type="primary" class="digital-screen" @click="digital">数字可视化大屏</el-button>
      <div class="title">消防维保服务管理系统</div>
      <el-button :style="{ backgroundColor: isClicked ? '#007bff' : 'white' }" type="primary" class="service-system" @click="servicesystem">维保服务系统</el-button>
      <!-- <div class="navigation">
        <div class="nav-item">数字可视化大屏</div>
        <div class="nav-item">维保服务系统</div>
      </div> -->
      <div class="right-info">
        <!-- <div class="system-link">维保服务系统</div> -->
        <div class="user-info">
          <span class="member-level">V1白银会员</span>
          <i class="el-icon-user"></i>
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </div>

    <!-- 下方数据展示区域 -->
    <div class="data-display">
      <div class="data-card">
        <div class="icon-circle">
          <i class="el-icon-document" />
        </div>
        <div class="maintenance-info">
          <div class="info-item">
            <div class="info-title">例行维保</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">3</div>
            <div class="info-desc">(本月未完成)</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">0</div>
            <div class="info-desc">(上月逾期数)</div>
          </div>
        </div>
      </div>
      <div class="data-card">
        <div class="icon-circle">
          <i class="el-icon-setting" />
        </div>
        <div class="maintenance-info">
          <div class="info-item">
            <div class="info-title">故障工单</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">2</div>
            <div class="info-desc">(当前未完成)</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">2</div>
            <div class="info-desc">(逾期未完成)</div>
          </div>
        </div>
      </div>
      <div class="data-card">
        <div class="icon-circle">
          <i class="el-icon-lock" />
        </div>
        <div class="maintenance-info">
          <div class="info-item">
            <div class="info-title">附加维保</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">2</div>
            <div class="info-desc">(当前未完成)</div>
          </div>
          <div class="info-item horizontal">
            <div class="info-value">2</div>
            <div class="info-desc">(逾期未完成)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="data-card">
        <div class="icon-circle">
          <i class="el-icon-document" />
        </div>
        <div class="card-content">
          <div class="card-title">例行维保
            <div class="numbers">
              <span class="number">{{ routineMaintenance.currentMonthCompleted }}</span>
              <span class="label">(本月未完成)</span>
            </div>
            <div class="numbers">
            <span class="number overdue">{{ routineMaintenance.lastMonthOverdue }}</span>
            <span class="label">(上月逾期数)</span>
          </div>
          </div>
        </div>
      </div> -->

      <!-- <div class="data-card">
         <div class="icon-circle">
          <i class="el-icon-setting"></i>
        </div>
        <div class="card-content">
          <div class="card-title">故障工单</div>
           <div class="numbers">
            <span class="number">{{ faultWorkOrder.currentMonthCompleted }}</span>
            <span class="label">(当前未完成)</span>
          </div>
          <div class="numbers">
            <span class="number overdue">{{ faultWorkOrder.overdue }}</span>
            <span class="label">(逾期未完成)</span>
          </div>
        </div>
      </div> -->

      <!-- <div class="data-card">
        <div class="icon-circle">
          <i class="el-icon-lock"></i>
        </div>
        <div class="card-content">
          <div class="card-title">附加维保</div>
           <div class="numbers">
            <span class="number">{{ additionalMaintenance.currentMonthCompleted }}</span>
            <span class="label">(当前未完成)</span>
          </div>
           <div class="numbers">
            <span class="number overdue">{{ additionalMaintenance.overdue }}</span>
            <span class="label">(逾期未完成)</span>
          </div>
        </div>
      </div> -->

      <!-- 您可以根据需要添加更多数据卡片 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isClicked: false,
      currentDateTime: '',
      routineMaintenance: {
        currentMonthCompleted: 3,
        lastMonthOverdue: 0
      },
      faultWorkOrder: {
        currentMonthCompleted: 2,
        overdue: 2
      },
      additionalMaintenance: {
        currentMonthCompleted: 3,
        overdue: 2
      }
      // 您可以根据需要添加更多数据属性
    }
  },
  mounted() {
    // 定时更新时间
    this.updateDateTime()
    this.timer = setInterval(this.updateDateTime, 1000)
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.timer)
  },
  methods: {
    servicesystem() {
      this.$router.push({ name: 'AgencyBasicInfo' })
    },
    updateDateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = ('0' + (now.getMonth() + 1)).slice(-2)
      const day = ('0' + now.getDate()).slice(-2)
      const hours = ('0' + now.getHours()).slice(-2)
      const minutes = ('0' + now.getMinutes()).slice(-2)
      const seconds = ('0' + now.getSeconds()).slice(-2)
      this.currentDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  font-family: sans-serif;
  background-color: #f0f2f5; /* 模拟背景颜色 */
  color: #333;
  /* padding: 10px; */
}

.header {
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff; /* 模拟头部背景颜色 */
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.datetime {
  font-size: 14px;
  color: #666;
}

.title {
  margin-left: 10px;
  font-size: 30px;
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
  color: #007bff; /* 模拟标题颜色 */
}

.digital-screen{
  margin-left: 50px;
  color: #333;
  background-color: #46A6FF;
}

.service-system{
  margin-right: 50px;
  color: #333;
}
.right-info {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.system-link {
  color: #007bff;
  margin-right: 20px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.member-level {
    margin-right: 5px;
    color: #999;
}

.user-info i {
  margin-left: 5px;
}

.navigation {
  display: flex;
  margin-bottom: 10px;
}

/* .nav-item {
  padding: 5px 10px;
  margin-right: 180px;
  margin-left: 80px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px 8px  8px  8px;
  cursor: pointer;
  background-color: #fff;
  font-size: 14px;
} */

/* .nav-item.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
} */

.data-display {
  display: flex;
  /* gap: 20px; */
  align-items: center;
  background: linear-gradient(to right, #a1c4fd, #c2e9fb);

}

.data-card {
  /* width: 70px; */
  height: 60px;
  flex:1; /* 让卡片均分空间 */
  /* background-color: #fff; */
  /* background: linear-gradient(to right, #a1c4fd, #c2e9fb); */

  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  text-align: center;
}

.icon-circle {
    width:50px;
    height: 50px;
    border-radius: 50%;
    background-color: #7db6f4; /* 模拟圆形图标背景颜色 */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    color: #fff;
    font-size: 30px;
    margin-left: 40px;
}

.card-content {
  flex-grow: 1;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.numbers {
    margin-bottom: 5px;
}

.number {
  font-size: 24px;
  font-weight: bold;
  margin-right: 5px;
  color: #007bff; /* 模拟数字颜色 */
}

.number.overdue {
    color: #dc3545; /* 模拟逾期数字颜色 */
}

.label {
  font-size: 12px;
  color: #666;
}

/* 基本的 Element UI 图标样式，如果您的项目使用了 Element UI 可以忽略 */
/* .el-icon-document:before { content: "\e611"; }
.el-icon-setting:before { content: "\e69d"; }
.el-icon-lock:before { content: "\e652"; }
.el-icon-user:before { content: "\e6ab"; }
.el-icon-arrow-down:before { content: "\e6a5"; } */

.horizontal {
  flex-direction: row !important;  /* 改为横向排列 */
  align-items: baseline;          /* 按文字基线对齐 */
  gap: 8px;                      /* 元素间距 */
  padding: 6px 12px;             /* 调整内边距 */
}
.maintenance-info {
  height: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  /* padding: 10px 15px; */
  /* background-color:greenyellow; */
  /* background: linear-gradient(to right, #a1c4fd, #c2e9fb); */

  color: white;
  border-radius: 5px;
  font-family: Arial, sans-serif;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-title {
  font-size: 18px;
  font-weight: bold;
  color: black;
  text-align: center;
}

.info-value {
  font-size: 28px;
  font-weight: bold;
  color: blue;
  text-align: center;
}

.info-desc {
  font-size: 10px;
  color: black;
  margin-top: 14px;
  /* margin-left: 15px; */
  text-align: center;
}

</style>
