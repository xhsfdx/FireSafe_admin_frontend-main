<template>
  <div class="enterprise-detail">
    <div class="header">
      <div class="header-left">
        <div class="company-logo">
          <img :src="require('@/assets/comlogo.jpeg')" class="company-logo">
          <!-- 这里可以放置公司 Logo 或默认图标 -->
          <!-- <div class="image-placeholder"> -->
          <!-- <i class="el-icon-picture-outline"></i> -->
          <!-- 示例图标，根据需要替换 -->
          <!-- <i class="el-icon-plus"></i> -->
          <!-- </div> -->
        </div>
        <div class="company-info">
          <h2>四川不凡消防科技有限公司</h2>
          <div class="location">
            <i class="el-icon-location" />
            <span>四川省南充市顺庆区濛华南路二段115号法拉利广场3号楼1单元2层8号</span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <button class="edit-button" @click="goToEditPage">编辑</button>
      </div>
    </div>

    <div class="content">
      <div class="section">
        <div class="item">
          <span class="label">企业简介:</span>
          <span class="value">{{ companyProfile }}</span>
        </div>
        <div class="item">
          <span class="label" />
          <span class="value" style="margin-left: -90px;">
            <i class="el-icon-mobile-phone" />
            {{ contactNumber }}
          </span>
        </div>
      </div>

      <div class="section">
        <div class="item">
          <span class="label" style="width: auto; margin-left: -10px;">统一社会信用代码:</span>
          <span class="value">{{ socialCreditCode }}</span>
        </div>
        <div class="item">
          <span class="label">企业邮箱:</span>
          <span class="value">{{ enterpriseEmail }}</span>
        </div>
      </div>

      <div class="section">
        <div class="item">
          <span class="label">企业法人:</span>
          <span class="value">{{ legalPerson }}</span>
        </div>
        <div class="item">
          <span class="label">法人电话:</span>
          <span class="value">{{ legalPersonPhone }}</span>
        </div>
      </div>

      <div class="section">
        <div class="item">
          <span class="label">维保主管:</span>
          <span class="value">{{ maintenanceSupervisor }}</span>
        </div>
        <div class="item">
          <span class="label">主管电话:</span>
          <span class="value">{{ maintenanceSupervisorPhone }}</span>
        </div>
      </div>
      <div class="section">
        <div class="item">
          <span class="label">企业照片:</span>
          <span class="value">{{ enterprisePhotos }}</span>
        </div>
        <div class="item">
          <span class="label">营业执照:</span>
          <span class="value">{{ businessLicense }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      companyProfile: '无', // 绑定企业简介数据
      contactNumber: '13438783735', // 绑定联系电话数据
      socialCreditCode: '91511302MA7FXFWY6L', // 绑定统一社会信用代码数据
      enterpriseEmail: '无', // 绑定企业邮箱数据
      legalPerson: '无', // 绑定企业法人数据
      legalPersonPhone: '无', // 绑定法人电话数据
      maintenanceSupervisor: '无', // 绑定维保主管数据
      maintenanceSupervisorPhone: '无', // 绑定主管电话数据
      enterprisePhotos: '无', // 绑定企业照片数据
      businessLicense: '无' // 绑定营业执照数据
    }
  },
  methods: {
    goToEditPage(id) {
      // 实现页面跳转逻辑
      // 使用 Vue Router 进行导航
      this.$router.push({ name: 'EditAgencyBasic', params: { id }})// 假设 'enterprise-edit' 是编辑页面的路由名称，your_enterprise_id 是企业ID
      // 或者使用路径跳转
      // this.$router.push('/enterprise/edit/your_enterprise_id');
      // router.push({ name: 'EditCompany' })
    }
  }
}
</script>

<style scoped>
/* 在这里添加样式，模拟界面样式 */
.enterprise-detail {
  padding: 20px;
  background-color: #f0f2f5; /* 背景颜色 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.company-logo {
  width:120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e6f7ff; /* 模拟背景色 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-right: 20px; */
}

.image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color:white; /* 模拟图标颜色 */
    font-size: 24px; /* 模拟图标大小 */
}

.image-placeholder .el-icon-picture-outline {
    margin-bottom: 5px;
}

.company-info h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.location {
  margin-top: 5px;
  color: #606266;
  font-size: 14px;
}

.location i {
  margin-right: 5px;
}

.edit-button {
  background-color: #1890ff; /* 模拟按钮颜色 */
  color: #fff;
  border: none;
  margin-top: 40px;
  margin-right: 40px;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
}

.section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* 响应式布局 */
    gap: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8; /* 分隔线 */
    padding-bottom: 15px;
}

.section:last-child {
    border-bottom: none; /* 最后一个section没有底部边框 */
}

.item {
  display: flex;
  align-items: center;
  padding-left: 50px;
}

.label {
  color: #606266;
  margin-right: 20px;
  width: 120px; /* 模拟标签宽度 */
  text-align: right;
}

.value {
  color: #303133;
  flex-grow: 1; /* 让value占据剩余空间 */
}

.value i {
    margin-right: 5px;
}
</style>

