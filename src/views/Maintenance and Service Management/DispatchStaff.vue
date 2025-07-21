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
          <div v-if="loading" class="loading-container">
            <el-loading-spinner />
            <p>正在加载维保人员数据...</p>
          </div>
          <el-tabs v-else v-model="activeTab" type="card">
            <el-tab-pane label="技术负责人" name="tech">
              <div class="user-search-bar">
                <el-input v-model="searchName" placeholder="输入姓名查询" clearable style="width:240px;">
                  <template #append>
                    <el-button icon="el-icon-search" @click="onSearch" />
                  </template>
                </el-input>
              </div>
              <div class="user-list">
                <div v-if="filteredList('tech').length === 0" class="empty-list">
                  <p>暂无技术负责人数据</p>
                </div>
                <div
                  v-for="(user, idx) in filteredList('tech')"
                  :key="user.id"
                  :class="['user-item', { checked: selected.tech && selected.tech.id === user.id }]"
                  @click="selectUser('tech', user)"
                >
                  <el-checkbox
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
                <div v-if="filteredList('manager').length === 0" class="empty-list">
                  <p>暂无项目负责人数据</p>
                </div>
                <div
                  v-for="(user, idx) in filteredList('manager')"
                  :key="user.id"
                  :class="['user-item', { checked: selected.manager && selected.manager.id === user.id }]"
                  @click="selectUser('manager', user)"
                >
                  <el-checkbox
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
                <div v-if="filteredList('worker').length === 0" class="empty-list">
                  <p>暂无现场维护人员数据</p>
                </div>
                <div
                  v-for="(user, idx) in filteredList('worker')"
                  :key="user.id"
                  :class="['user-item', { checked: isWorkerSelected(user) }]"
                  @click="toggleWorker(user)"
                >
                  <el-checkbox
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
      <!-- 移除保存按钮，由父组件控制 -->
    </div>
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" />
  </div>
</template>

<script>
import { getStaffList } from '@/api/staff'

export default {
  name: 'DispatchStaffPage',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeTab: 'tech',
      searchName: '',
      loading: false,
      // 从后端获取的用户数据
      userPool: {
        tech: [],
        manager: [],
        worker: []
      },
      selected: {
        tech: null,
        manager: null,
        workers: [],
        workerIds: []
      }
    }
  },
  mounted() {
    this.loadStaffData()
  },
  methods: {
    // 从后端加载员工数据
    async loadStaffData() {
      this.loading = true
      try {
        console.log('开始加载员工数据...')
        console.log('API基础URL:', process.env.VUE_APP_BASE_API)
        const response = await getStaffList()
        console.log('后端返回的员工数据:', response)
        
        if (response.success && response.data) {
          // 根据资质级别分类员工
          const staffList = response.data
          
          // 技术负责人：一级注册消防工程师
          this.userPool.tech = staffList
            .filter(staff => staff.qualificationLevel === '一级注册消防工程师')
            .map(staff => ({
              id: staff._id, // 使用真实的MongoDB ObjectId
              name: staff.name,
              role: staff.qualificationLevel,
              companyCount: staff.assignedProjects || 0,
              avatar: this.getValidAvatar(staff.avatar),
              phone: staff.phone,
              gender: staff.gender
            }))
          
          // 项目负责人：一级注册消防工程师
          this.userPool.manager = staffList
            .filter(staff => staff.qualificationLevel === '一级注册消防工程师')
            .map(staff => ({
              id: staff._id, // 使用真实的MongoDB ObjectId
              name: staff.name,
              role: staff.qualificationLevel,
              companyCount: staff.assignedProjects || 0,
              avatar: this.getValidAvatar(staff.avatar),
              phone: staff.phone,
              gender: staff.gender
            }))
          
          // 现场维护人员：所有资质级别
          this.userPool.worker = staffList.map(staff => ({
            id: staff._id, // 使用真实的MongoDB ObjectId
            name: staff.name,
            role: staff.qualificationLevel,
            companyCount: staff.assignedProjects || 0,
            avatar: this.getValidAvatar(staff.avatar),
            phone: staff.phone,
            gender: staff.gender
          }))
          
          console.log('=== 现场维护人员数据加载完成 ===')
          console.log('现场维护人员数量:', this.userPool.worker.length)
          console.log('现场维护人员列表:', this.userPool.worker.map(w => ({ id: w.id, name: w.name, role: w.role })))
          
          console.log('分类后的员工数据:', this.userPool)
          
          // 如果有传入的数据，初始化选中状态
          if (this.data && this.data.maintainPersons) {
            this.initializeFromData(this.data.maintainPersons)
          }
        } else {
          console.error('获取员工数据失败:', response.message)
          this.$message.error('获取员工数据失败')
          // 如果API失败，不使用模拟数据，而是提示用户
          this.userPool = { tech: [], manager: [], worker: [] }
        }
      } catch (error) {
        console.error('加载员工数据出错:', error)
        this.$message.error('加载员工数据失败，请稍后重试')
        
        // 如果API失败，不使用模拟数据，而是提示用户
        this.userPool = { tech: [], manager: [], worker: [] }
      } finally {
        this.loading = false
      }
    },
    
    // 从传入的数据初始化选中状态
    initializeFromData(maintainPersons) {
      console.log('=== initializeFromData 被调用 ===')
      console.log('传入的maintainPersons:', maintainPersons)
      
      if (maintainPersons.technical) {
        const techUser = this.findUserById('tech', maintainPersons.technical)
        if (techUser) {
          this.selected.tech = techUser
          console.log('初始化技术负责人:', techUser.name)
        } else {
          console.log('未找到技术负责人ID:', maintainPersons.technical)
        }
      }
      
      if (maintainPersons.leader) {
        const managerUser = this.findUserById('manager', maintainPersons.leader)
        if (managerUser) {
          this.selected.manager = managerUser
          console.log('初始化项目负责人:', managerUser.name)
        } else {
          console.log('未找到项目负责人ID:', maintainPersons.leader)
        }
      }
      
      if (maintainPersons.maintainers && maintainPersons.maintainers.length > 0) {
        console.log('初始化现场维保人员，数量:', maintainPersons.maintainers.length)
        maintainPersons.maintainers.forEach((id, index) => {
          const workerUser = this.findUserById('worker', id)
          if (workerUser) {
            this.selected.workers.push(workerUser)
            this.selected.workerIds.push(id)
            console.log(`初始化现场维保人员${index + 1}:`, workerUser.name)
          } else {
            console.log('未找到现场维保人员ID:', id)
          }
        })
        console.log('初始化后的现场维保人员:', this.selected.workers.map(w => w.name))
        console.log('初始化后的现场维保人员ID:', this.selected.workerIds)
      } else {
        console.log('没有现场维保人员数据需要初始化')
      }
    },
    
    // 根据ID查找用户
    findUserById(roleType, id) {
      return this.userPool[roleType].find(user => user.id === id)
    },
    
    filteredList(roleType) {
      return this.userPool[roleType].filter(u => !this.searchName || u.name.includes(this.searchName))
    },
    
    selectUser(type, user) {
      if (type === 'tech') this.selected.tech = user
      if (type === 'manager') this.selected.manager = user
    },
    
    toggleWorker(user) {
      console.log('=== toggleWorker 被调用 ===')
      console.log('用户:', user)
      console.log('用户ID:', user.id)
      console.log('用户姓名:', user.name)
      console.log('当前selected.workers:', this.selected.workers)
      console.log('当前selected.workerIds:', this.selected.workerIds)
      
      // 检查是否有同名用户
      const sameNameUsers = this.userPool.worker.filter(w => w.name === user.name)
      console.log('同名用户数量:', sameNameUsers.length)
      if (sameNameUsers.length > 1) {
        console.log('同名用户列表:', sameNameUsers.map(u => ({ id: u.id, name: u.name })))
      }
      
      const idx = this.selected.workers.findIndex(w => w.id === user.id)
      console.log('找到的索引:', idx)
      
      if (idx === -1) {
        this.selected.workers.push(user)
        this.selected.workerIds.push(user.id)
        console.log('添加用户后:', this.selected.workers)
        console.log('添加ID后:', this.selected.workerIds)
      } else {
        this.selected.workers.splice(idx, 1)
        this.selected.workerIds = this.selected.workerIds.filter(id => id !== user.id)
        console.log('移除用户后:', this.selected.workers)
        console.log('移除ID后:', this.selected.workerIds)
      }
    },
    
    isWorkerSelected(user) {
      // 使用严格的ID匹配，避免同名用户混淆
      const isSelected = this.selected.workerIds.includes(user.id) && 
             this.selected.workers.some(w => w.id === user.id)
      
      // 添加调试信息
      console.log(`isWorkerSelected - 用户: ${user.name}, ID: ${user.id}, 是否选中: ${isSelected}`)
      console.log(`当前workerIds:`, this.selected.workerIds)
      console.log(`当前workers:`, this.selected.workers.map(w => ({ id: w.id, name: w.name })))
      
      return isSelected
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
      console.log('=== DispatchStaff onSave 被调用 ===')
      console.log('当前选中状态:', this.selected)
      
      // 验证必填项
      if (!this.selected.tech) {
        console.log('技术负责人未选择')
        this.$message.error('请选择技术负责人')
        return
      }
      if (!this.selected.manager) {
        console.log('项目负责人未选择')
        this.$message.error('请选择项目负责人')
        return
      }
      if (this.selected.workers.length === 0) {
        console.log('❌ 现场维护人员未选择')
        console.log('当前选中的现场维护人员:', this.selected.workers)
        console.log('当前选中的现场维护人员ID:', this.selected.workerIds)
        console.log('用户池中的现场维护人员数量:', this.userPool.worker.length)
        console.log('用户池中的现场维护人员:', this.userPool.worker.map(w => ({ id: w.id, name: w.name })))
        this.$message.error('请至少选择一名现场维护人员')
        return
      }

      // 构造返回数据
      const maintainPersons = {
        technical: this.selected.tech.id,
        leader: this.selected.manager.id,
        maintainers: this.selected.workerIds
      }

      console.log('=== DispatchStaff onSave 详细数据 ===')
      console.log('技术负责人ID:', this.selected.tech.id)
      console.log('技术负责人姓名:', this.selected.tech.name)
      console.log('项目负责人ID:', this.selected.manager.id)
      console.log('项目负责人姓名:', this.selected.manager.name)
      console.log('现场维护人员数量:', this.selected.workers.length)
      console.log('现场维护人员ID列表:', this.selected.workerIds)
      console.log('现场维护人员详情:', this.selected.workers.map(w => ({ id: w.id, name: w.name })))
      console.log('发送的维保人员数据:', maintainPersons)

      // 向父组件发送数据，包含完整的人员信息
      this.$emit('submit', { 
        maintainPersons,
        selectedStaff: {
          tech: this.selected.tech,
          manager: this.selected.manager,
          workers: this.selected.workers
        }
      })
      this.$message.success('配置成功')
    },
    
    onSetting() {
      this.$message.info('设置')
    },
    
    onSearch() {
      // 前端本地过滤
    },
    
    // 获取有效的头像URL，如果没有则使用默认头像
    getValidAvatar(avatarUrl) {
      if (avatarUrl && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://'))) {
        // 检查是否是有效的URL，如果不是则使用默认头像
        if (avatarUrl.includes('example.com')) {
          return require('@/assets/avatar-1.jpg');
        }
        return avatarUrl;
      }
      return require('@/assets/avatar-1.jpg'); // 默认头像
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
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  background: #f8fafc;
  border-radius: 5px;
  padding: 20px;
}
.loading-container p {
  margin-top: 10px;
  color: #789;
  font-size: 16px;
}
.empty-list {
  text-align: center;
  padding: 20px;
  color: #789;
  font-size: 16px;
}
</style>
