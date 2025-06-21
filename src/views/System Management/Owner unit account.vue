<template>
  <div class="user-manage-page">
    <!-- 左侧单位栏 -->
    <div class="left-bar">
      <el-input v-model="orgFilter" placeholder="请输入单位名称" size="small" class="org-search" clearable />
      <div class="org-list">
        <div
          v-for="item in filteredOrgs"
          :key="item"
          :class="['org-item', { active: activeOrg === item }]"
          @click="activeOrg = item"
        >{{ item }}</div>
      </div>
    </div>

    <!-- 右侧主内容 -->
    <div class="main-panel">
      <!-- 顶部搜索操作栏 -->
      <div class="toolbar">
        <el-input
          v-model="filters.name"
          placeholder="姓名"
          size="small"
          style="width:150px; margin-right:10px"
          clearable
        />
        <el-input
          v-model="filters.phone"
          placeholder="电话"
          size="small"
          style="width:150px; margin-right:10px"
          clearable
        />
        <el-select
          v-model="filters.status"
          placeholder="账号状态"
          size="small"
          style="width:150px; margin-right:10px"
          clearable
        >
          <el-option label="全部" value="" />
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" style="margin-right:6px" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh" style="margin-right:6px" @click="onReset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" style="margin-right:6px" @click="onAdd">新增</el-button>
        <el-button
          type="primary"
          style="background: #885cf7; border-color: #885cf7; margin-right: 0;"
          icon="el-icon-link"
          @click="jumpSystem"
        >跳转到社会单位系统</el-button>
      </div>

      <!-- 用户表格 -->
      <el-table
        :data="filteredData"
        border
        style="width: 100%;"
        :empty-text="' '"
        header-cell-class-name="table-header"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="role" label="用户角色" align="center" />
        <el-table-column prop="mobile" label="手机号" align="center" />
        <el-table-column prop="statusText" label="账号状态" align="center" />
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="viewDetail(row)">详情</el-link>
            <el-link type="danger" style="margin-left:10px" @click="deleteRow(row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 无数据时的自定义内容 -->
      <div v-if="filteredData.length === 0" class="table-empty">
        <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">

        <div class="empty-text">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagePage',
  data() {
    return {
      orgFilter: '',
      orgList: ['小学', '高坪汽车站'],
      activeOrg: '小学',
      filters: {
        name: '',
        phone: '',
        status: ''
      },
      // 加上 org 字段
      tableData: [
        {
          org: '高坪汽车站',
          username: 'wangpan',
          name: '王攀',
          createTime: '2025-04-22 01:24:08',
          role: '社会单位管理员',
          mobile: '17683231030',
          status: 1,
          statusText: '正常'
        }
        // 你可以加更多数据，也可以给 org: '小学' 的条目
      ]
    }
  },
  computed: {
    filteredOrgs() {
      if (!this.orgFilter) return this.orgList
      return this.orgList.filter(o => o.includes(this.orgFilter))
    },
    filteredData() {
      // 只显示当前左侧选中的单位的数据
      let list = this.tableData.filter(row => row.org === this.activeOrg)
      if (this.filters.name) list = list.filter(row => row.name.includes(this.filters.name))
      if (this.filters.phone) list = list.filter(row => row.mobile && row.mobile.includes(this.filters.phone))
      if (this.filters.status) list = list.filter(row => row.status + '' === this.filters.status)
      return list
    }
  },
  methods: {
    onSearch() {
      this.$message.success('点击了查询')
    },
    onReset() {
      this.filters = { name: '', phone: '', status: '' }
      this.$message.success('重置成功')
    },
    onAdd() {
      this.$router.push('/system/account-add')// 跳转路由路径，按你项目实际配置
    },
    jumpSystem() {
      window.location.href = 'http://xfgl.diweiyunlian.cn/login?redirect=/basicInforManage'
    },
    viewDetail(row) {
      // 假设用 username 作为唯一标识，推荐实际用 id
      this.$router.push({
        path: '/system/edit-customer-account',
        query: { username: row.username }
      })
    },
    deleteRow(row) {
      this.$message.error('点击了删除')
    },
    onSetting() {
      this.$message.info('设置按钮')
    }
  }
}
</script>

<style scoped>
.user-manage-page {
  display: flex;
  height: calc(100vh - 20px);
  background: #fff;
  position: relative;
}

.left-bar {
  width: 220px;
  background: #fcfcfc;
  border-right: 1px solid #f2f2f2;
  padding: 16px 0 0 0;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.org-search {
  margin-bottom: 10px;
  width: 180px;
}

.org-list {
  width: 100%;
}

.org-item {
  width: 180px;
  margin: 0 auto 8px auto;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 6px;
  color: #222;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.org-item.active {
  background: #eaf3ff;
  color: #2186ff;
  font-weight: bold;
  border: 1px solid #2186ff;
}

.main-panel {
  flex: 1;
  padding: 0 16px 0 0;
  min-width: 900px;
  position: relative;
  background: #fff;
}

.toolbar {
  display: flex;
  align-items: center;
  margin: 14px 0 8px 0;
}

.el-button {
  font-size: 15px;
}

.table-header {
  background: #f6f8fc !important;
  font-weight: bold;
  font-size: 15px;
}

.table-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 110px;
  text-align: center;
  z-index: 2;
  user-select: none;
}

.empty-img {
  width: 110px;
  opacity: 0.65;
  margin-bottom: 6px;
}

.empty-text {
  color: #99a;
  font-size: 16px;
}

.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
