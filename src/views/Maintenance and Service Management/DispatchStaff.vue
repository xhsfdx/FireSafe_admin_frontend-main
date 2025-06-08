<template>
  <div class="dispatch-staff-page">
    <!-- 顶部步骤提示 -->
    <div class="header-bar">
      <span class="title">改派人员</span>
      <span class="tip">(提示：必须选择项目负责人和技术负责人，至少一名现场维护人员。)</span>
    </div>

    <el-row :gutter="28" class="main-content">
      <!-- 左侧选择栏 -->
      <el-col :span="12">
        <el-card class="left-card">
          <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="技术负责人" name="tech">
              <div class="user-search-bar">
                <el-input v-model="searchName" placeholder="输入姓名查询" clearable style="width:240px;">
                  <template #append>
                    <el-button icon="el-icon-search" @click="onSearch" />
                  </template>
                </el-input>
              </div>
              <div class="user-list">
                <div
                  v-for="(user, idx) in filteredList('tech')"
                  :key="user.id"
                  :class="['user-item', { checked: selected.tech && selected.tech.id === user.id }]"
                  @click="selectUser('tech', user)"
                >
                  <el-checkbox
                    v-model="selected.tech"
                    :checked="selected.tech && selected.tech.id === user.id"
                    :label="user.name"
                    @change="selectUser('tech', user)"
                    @click.stop
                  />
                  <img :src="user.avatar" class="avatar">
                  <div class="user-info">
                    <span class="name">{{ user.name }}</span>
                    <span class="desc">{{ user.role }}</span>
                    <span class="desc">已分配 {{ user.companyCount }} 家企业</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="项目负责人" name="manager">
              <div class="user-search-bar">
                <el-input v-model="searchName" placeholder="输入姓名查询" clearable style="width:240px;">
                  <template #append>
                    <el-button icon="el-icon-search" @click="onSearch" />
                  </template>
                </el-input>
              </div>
              <div class="user-list">
                <div
                  v-for="(user, idx) in filteredList('manager')"
                  :key="user.id"
                  :class="['user-item', { checked: selected.manager && selected.manager.id === user.id }]"
                  @click="selectUser('manager', user)"
                >
                  <el-checkbox
                    v-model="selected.manager"
                    :checked="selected.manager && selected.manager.id === user.id"
                    :label="user.name"
                    @change="selectUser('manager', user)"
                    @click.stop
                  />
                  <img :src="user.avatar" class="avatar">
                  <div class="user-info">
                    <span class="name">{{ user.name }}</span>
                    <span class="desc">{{ user.role }}</span>
                    <span class="desc">已分配 {{ user.companyCount }} 家企业</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="现场维护人员" name="worker">
              <div class="user-search-bar">
                <el-input v-model="searchName" placeholder="输入姓名查询" clearable style="width:240px;">
                  <template #append>
                    <el-button icon="el-icon-search" @click="onSearch" />
                  </template>
                </el-input>
              </div>
              <div class="user-list">
                <div
                  v-for="(user, idx) in filteredList('worker')"
                  :key="user.id"
                  :class="['user-item', { checked: isWorkerSelected(user) }]"
                  @click="toggleWorker(user)"
                >
                  <el-checkbox
                    v-model="selected.workerIds"
                    :checked="isWorkerSelected(user)"
                    :label="user.name"
                    @change="toggleWorker(user)"
                    @click.stop
                  />
                  <img :src="user.avatar" class="avatar">
                  <div class="user-info">
                    <span class="name">{{ user.name }}</span>
                    <span class="desc">{{ user.role }}</span>
                    <span class="desc">已分配 {{ user.companyCount }} 家企业</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!-- 右侧已选栏 -->
      <el-col :span="12">
        <el-card class="right-card">
          <div class="picked-block">
            <div class="role-block">
              <div class="role-title">技术负责人</div>
              <div v-if="selected.tech" class="picked-item">
                <img :src="selected.tech.avatar" class="avatar">
                <div class="user-info">
                  <span class="name">{{ selected.tech.name }}</span>
                  <span class="desc">{{ selected.tech.role }}</span>
                  <span class="desc">已分配 {{ selected.tech.companyCount }} 家企业</span>
                </div>
                <i class="el-icon-close remove-btn" @click="removePicked('tech')" />
              </div>
            </div>
            <div class="role-block">
              <div class="role-title">项目负责人</div>
              <div v-if="selected.manager" class="picked-item">
                <img :src="selected.manager.avatar" class="avatar">
                <div class="user-info">
                  <span class="name">{{ selected.manager.name }}</span>
                  <span class="desc">{{ selected.manager.role }}</span>
                  <span class="desc">已分配 {{ selected.manager.companyCount }} 家企业</span>
                </div>
                <i class="el-icon-close remove-btn" @click="removePicked('manager')" />
              </div>
            </div>
            <div class="role-block">
              <div class="role-title">现场维护人员</div>
              <div v-for="w in selected.workers" :key="w.id" class="picked-item">
                <img :src="w.avatar" class="avatar">
                <div class="user-info">
                  <span class="name">{{ w.name }}</span>
                  <span class="desc">{{ w.role }}</span>
                  <span class="desc">已分配 {{ w.companyCount }} 家企业</span>
                </div>
                <i class="el-icon-close remove-btn" @click="removePicked('worker', w)" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="text-align:center;margin-top:32px;">
      <el-button type="primary" style="width:130px;" @click="onSave">保存</el-button>
    </div>
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
  </div>
</template>

<script>
export default {
  name: 'DispatchStaffPage',
  data() {
    return {
      activeTab: 'tech',
      searchName: '',
      // mock 用户数据
      userPool: {
        tech: [
          { id: 1, name: '邱峰', role: '一级注册消防工程师', companyCount: 2, avatar: require('@/assets/avatar-1.jpg') },
          { id: 3, name: '何珍', role: '一级注册消防工程师', companyCount: 2, avatar: require('@/assets/avatar-3.jpg') }
        ],
        manager: [
          { id: 2, name: '王蕾', role: '一级注册消防工程师', companyCount: 2, avatar: require('@/assets/avatar-2.jpg') }
        ],
        worker: [
          { id: 4, name: '黎建军', role: '消防设施操作员', companyCount: 2, avatar: require('@/assets/avatar-4.jpg') },
          { id: 5, name: '邱峰', role: '一级注册消防工程师', companyCount: 2, avatar: require('@/assets/avatar-1.jpg') },
          { id: 6, name: '何珍', role: '一级注册消防工程师', companyCount: 2, avatar: require('@/assets/avatar-3.jpg') }
        ]
      },
      selected: {
        tech: null,
        manager: null,
        workers: [],
        workerIds: []
      }
    }
  },
  methods: {
    filteredList(roleType) {
      return this.userPool[roleType].filter(u => !this.searchName || u.name.includes(this.searchName))
    },
    selectUser(type, user) {
      if (type === 'tech') this.selected.tech = user
      if (type === 'manager') this.selected.manager = user
    },
    toggleWorker(user) {
      const idx = this.selected.workers.findIndex(w => w.id === user.id)
      if (idx === -1) {
        this.selected.workers.push(user)
        this.selected.workerIds.push(user.id)
      } else {
        this.selected.workers.splice(idx, 1)
        this.selected.workerIds = this.selected.workerIds.filter(id => id !== user.id)
      }
    },
    isWorkerSelected(user) {
      return this.selected.workerIds.includes(user.id)
    },
    removePicked(type, user) {
      if (type === 'tech') this.selected.tech = null
      if (type === 'manager') this.selected.manager = null
      if (type === 'worker') {
        this.selected.workers = this.selected.workers.filter(w => w.id !== user.id)
        this.selected.workerIds = this.selected.workerIds.filter(id => id !== user.id)
      }
    },
    onSave() {
      // 提交选中的数据
      this.$message.success('保存成功')
      // 可以 this.$router.go(-1) 或返回上一页
    },
    onSetting() {
      this.$message.info('设置')
    },
    onSearch() {
      // 前端本地过滤
    }
  }
}
</script>

<style scoped>
.dispatch-staff-page {
  background: #fff;
  min-height: 100vh;
  padding: 16px 8px 40px 8px;
  position: relative;
}
.header-bar {
  display: flex;
  align-items: center;
  padding: 10px 0 22px 0;
}
.title {
  font-size: 26px;
  font-weight: bold;
  color: #222;
  margin-right: 18px;
}
.tip {
  color: #f55;
  font-size: 15px;
  margin-left: 6px;
}
.main-content {
  margin: 0;
}
.left-card, .right-card {
  background: #f6faff;
  border-radius: 10px;
  min-height: 510px;
  box-shadow: 0 2px 10px #77baff0c;
  border: none;
}
.el-tabs__header {
  margin: 0 0 10px 0;
}
.user-search-bar {
  margin-bottom: 12px;
}
.user-list {
  min-height: 320px;
  max-height: 430px;
  overflow-y: auto;
  background: #f8fafc;
  border-radius: 5px;
}
.user-item {
  display: flex;
  align-items: center;
  background: #fff;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  padding: 12px 16px;
  border: 1px solid #f2f6fa;
}
.user-item.checked {
  border: 1.5px solid #3d99fc;
  background: #f0f8ff;
}
.user-item .avatar {
  width: 50px;
  height: 50px;
  margin-right: 18px;
  border-radius: 50%;
  background: #eee;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-info .name {
  font-size: 18px;
  color: #26323e;
  font-weight: 700;
}
.user-info .desc {
  color: #789;
  font-size: 14px;
  margin-top: 2px;
}
.picked-block .role-block {
  margin-bottom: 30px;
}
.role-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 12px;
  color: #212121;
}
.picked-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 14px;
  box-shadow: 0 2px 6px #a9c6fd14;
  border: 1px solid #e3eaf5;
  position: relative;
}
.picked-item .avatar {
  width: 48px;
  height: 48px;
  margin-right: 18px;
  border-radius: 50%;
  background: #eee;
}
.remove-btn {
  color: #f55;
  font-size: 22px;
  cursor: pointer;
  position: absolute;
  right: 12px;
  top: 18px;
}
.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
