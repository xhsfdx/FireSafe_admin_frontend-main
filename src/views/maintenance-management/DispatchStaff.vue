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
            <i class="el-icon-loading" />
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
                  :key="`tech-${user.id}-${user.name}`"
                  :class="['user-item', { checked: isTechSelected(user) }]"
                  @click="selectUser('tech', user)"
                >
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
                  :key="`manager-${user.id}-${user.name}`"
                  :class="['user-item', { checked: isManagerSelected(user) }]"
                  @click="selectUser('manager', user)"
                >
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
                  :key="`worker-${user.id}-${user.name}`"
                  :class="['user-item', { checked: isWorkerSelected(user) }]"
                  @click="toggleWorker(user)"
                >
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
              <div v-for="(w, index) in selected.workers" :key="w.id || `worker-${index}`" class="picked-item">
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

    <!-- 底部确认按钮 -->
    <div class="footer-actions">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSave">确认</el-button>
    </div>

  </div>
</template>

<script>
import { getAllStaff } from '@/api/staff'
import { assignMaintainers, updateMaintainTask } from '@/api/maintainTask'
import { updateMaintenancePlan, getMaintenancePlan } from '@/api/maintainPlan'

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
      // 左侧显示：已保存的配置
      savedConfig: {
        tech: null,
        manager: null,
        workers: [],
        workerIds: []
      },
      // 右侧显示：用户新选择的配置
      selected: {
        tech: null,
        manager: null,
        workers: [],
        workerIds: []
      }
    }
  },
  computed: {
    planId() {
      return this.$route.query.planId
    }
  },
  mounted() {
    console.log('🚀🚀🚀 DispatchStaff组件已挂载，开始加载员工数据...')
    console.log('🚀🚀🚀 当前路由信息:', this.$route)
    console.log('🚀🚀🚀 路由params:', this.$route.params)
    console.log('🚀🚀🚀 路由query:', this.$route.query)
    console.log('🚀🚀🚀 planId计算属性值:', this.planId)
    console.log('🚀🚀🚀 taskId值:', this.$route.query.taskId)

    // 检查认证状态
    const token = this.$store.getters.token
    console.log('🚀🚀🚀 当前认证token:', token ? '已存在' : '不存在')
    console.log('🚀🚀🚀 token值:', token)

    this.loadStaffData()
  },
  methods: {
    // 从后端加载员工数据
    async loadStaffData() {
      console.log('🔥 loadStaffData方法被调用')
      this.loading = true
      try {
        console.log('开始加载员工数据...')
        console.log('API基础URL:', process.env.VUE_APP_BASE_API)
        const response = await getAllStaff()
        console.log('后端返回的员工数据:', response)

        if (response.success && response.data) {
          // 根据资质级别分类员工
          const staffList = response.data

          // 技术负责人：一级注册消防工程师
          this.userPool.tech = staffList
            .filter(staff => staff.qualificationLevel === '一级注册消防工程师')
            .map((staff, index) => ({
              id: staff._id, // 使用真实的MongoDB ObjectId
              name: staff.name,
              role: staff.qualificationLevel,
              companyCount: staff.assignedProjects || 0,
              avatar: this.resolveStaffAvatar(staff),
              phone: staff.phone,
              gender: staff.gender,
              uniqueKey: `tech-${staff._id}-${index}` // 添加唯一键避免重复
            }))

          // 项目负责人：一级注册消防工程师
          this.userPool.manager = staffList
            .filter(staff => staff.qualificationLevel === '一级注册消防工程师')
            .map((staff, index) => ({
              id: staff._id, // 使用真实的MongoDB ObjectId
              name: staff.name,
              role: staff.qualificationLevel,
              companyCount: staff.assignedProjects || 0,
              avatar: this.resolveStaffAvatar(staff),
              phone: staff.phone,
              gender: staff.gender,
              uniqueKey: `manager-${staff._id}-${index}` // 添加唯一键避免重复
            }))

          // 现场维护人员：所有资质级别
          this.userPool.worker = staffList.map(staff => ({
            id: staff._id, // 使用真实的MongoDB ObjectId
            name: staff.name,
            role: staff.qualificationLevel,
            companyCount: staff.assignedProjects || 0,
            avatar: this.resolveStaffAvatar(staff),
            phone: staff.phone,
            gender: staff.gender
          }))

          console.log('=== 现场维护人员数据加载完成 ===')
          console.log('现场维护人员数量:', this.userPool.worker.length)
          console.log('现场维护人员列表:', this.userPool.worker.map(w => ({ id: w.id, name: w.name, role: w.role })))

          console.log('分类后的员工数据:', this.userPool)

          // 检查是否有从路由传递的完整计划数据
          const fullPlanData = this.$route.query.fullPlanData
          if (fullPlanData) {
            try {
              const planData = JSON.parse(fullPlanData)
              console.log('✅ 从路由获取到完整计划数据:', planData)
              if (planData.maintainPersons) {
                console.log('✅ 使用路由传递的计划数据初始化左侧:', planData.maintainPersons)
                this.initializeFromData(planData.maintainPersons)
              } else {
                console.log('⚠️ 路由传递的计划数据中没有maintainPersons字段')
                await this.loadSavedPersonnelConfig()
              }
            } catch (error) {
              console.error('❌ 解析路由传递的计划数据失败:', error)
              await this.loadSavedPersonnelConfig()
            }
          } else if (this.data && this.data.maintainPersons) {
            console.log('✅ 使用传入的数据初始化左侧:', this.data.maintainPersons)
            this.initializeFromData(this.data.maintainPersons)
          } else if (this.planId) {
            console.log('⚠️ 没有传入数据，但planId存在，尝试从后端加载已保存的人员配置，planId:', this.planId)
            // 加载已保存的配置到左侧显示
            await this.loadSavedPersonnelConfig()
          } else {
            console.log('❌ 没有传入数据且planId为空，左侧保持空白状态')
            console.log('当前this.data:', this.data)
            console.log('当前planId:', this.planId)
            console.log('当前路由query:', this.$route.query)

            // 临时解决方案：创建一些模拟数据来测试UI逻辑
            console.log('🔧 创建模拟数据来测试UI逻辑')
            const mockMaintainPersons = {
              technical: '68994e4f49f881b4dd401b62', // 假设的技术负责人ID
              leader: '688b21d24d6f777ef6efb6c7', // 假设的项目负责人ID
              maintainers: ['68994e4f49f881b4dd401b62'] // 假设的维护人员ID
            }
            console.log('模拟数据:', mockMaintainPersons)
            this.initializeFromData(mockMaintainPersons)
          }

          // 右侧保持空白，等待用户新选择
          console.log('右侧保持空白状态，等待用户新选择')
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

    // 从传入的数据初始化已保存配置（左侧显示）
    initializeFromData(maintainPersons) {
      console.log('=== initializeFromData 被调用 ===')
      console.log('传入的maintainPersons:', maintainPersons)
      console.log('maintainPersons类型:', typeof maintainPersons)
      console.log('maintainPersons是否为null/undefined:', maintainPersons == null)

      if (!maintainPersons) {
        console.log('❌ maintainPersons为空，跳过初始化')
        return
      }

      // 清空之前的保存配置
      this.savedConfig = {
        tech: null,
        manager: null,
        workers: [],
        workerIds: []
      }
      // 清空当前选择状态，保持初始干净状态
      this.selected = {
        tech: null,
        manager: null,
        workers: [],
        workerIds: []
      }
      console.log('已清空savedConfig和selected，保持初始干净状态')

      if (maintainPersons.technical) {
        // 处理两种数据格式：纯ID字符串或包含用户信息的对象
        const techId = typeof maintainPersons.technical === 'string'
          ? maintainPersons.technical
          : maintainPersons.technical._id || maintainPersons.technical.id
        const techUser = this.findUserById('tech', techId)
        if (techUser) {
          this.savedConfig.tech = techUser
          // 不自动设置selected状态，保持初始干净状态
          console.log('初始化已保存的技术负责人:', techUser.name)
        } else {
          console.log('未找到技术负责人ID:', techId)
        }
      }

      if (maintainPersons.leader) {
        // 处理两种数据格式：纯ID字符串或包含用户信息的对象
        const leaderId = typeof maintainPersons.leader === 'string'
          ? maintainPersons.leader
          : maintainPersons.leader._id || maintainPersons.leader.id
        const managerUser = this.findUserById('manager', leaderId)
        if (managerUser) {
          this.savedConfig.manager = managerUser
          // 不自动设置selected状态，保持初始干净状态
          console.log('初始化已保存的项目负责人:', managerUser.name)
        } else {
          console.log('未找到项目负责人ID:', leaderId)
        }
      }

      if (maintainPersons.maintainers && maintainPersons.maintainers.length > 0) {
        console.log('初始化已保存的现场维保人员，数量:', maintainPersons.maintainers.length)
        maintainPersons.maintainers.forEach((item, index) => {
          // 处理两种数据格式：纯ID字符串或包含用户信息的对象
          const workerId = typeof item === 'string'
            ? item
            : item._id || item.id
          const workerUser = this.findUserById('worker', workerId)
          if (workerUser) {
            this.savedConfig.workers.push(workerUser)
            this.savedConfig.workerIds.push(workerId)
            // 不自动设置selected状态，保持初始干净状态
            console.log(`初始化已保存的现场维保人员${index + 1}:`, workerUser.name)
          } else {
            console.log('未找到现场维保人员ID:', workerId)
          }
        })
        console.log('初始化后的已保存现场维保人员:', this.savedConfig.workers.map(w => w.name))
        console.log('初始化后的已保存现场维保人员ID:', this.savedConfig.workerIds)
      } else {
        console.log('没有已保存的现场维保人员数据')
      }
    },

    // 根据ID查找用户
    findUserById(roleType, id) {
      console.log(`🔍 findUserById: 查找类型=${roleType}, 目标ID=${id}`)
      console.log(`🔍 findUserById: 当前${roleType}列表包含 ${this.userPool[roleType].length} 名员工`)
      console.log(`🔍 findUserById: ${roleType}列表内容:`, this.userPool[roleType].map(u => ({ id: u.id, name: u.name })))

      const user = this.userPool[roleType].find(user => {
        const userId = String(user.id)
        const targetId = String(id)
        const match = userId === targetId
        console.log(`  比较: user.id=${userId}, targetId=${targetId}, 匹配=${match}`)
        return match
      })

      if (!user) {
        console.warn(`❌ 在 ${roleType} 列表中未找到ID为 ${id} 的用户`)
      } else {
        console.log(`✅ 在 ${roleType} 列表中找到用户: ${user.name} (ID: ${user.id})`)
      }
      return user
    },

    filteredList(roleType) {
      return this.userPool[roleType].filter(u => !this.searchName || u.name.includes(this.searchName))
    },

    selectUser(type, user) {
      console.log(`用户点击选择: ${type}, 用户: ${user.name}`)
      if (type === 'tech') {
        // 如果点击的是已选中的用户，则取消选择；否则选择该用户
        if (this.selected.tech && this.selected.tech.id === user.id) {
          this.selected.tech = null
          console.log('取消选择技术负责人:', user.name)
        } else {
          this.selected.tech = user
          console.log('设置技术负责人:', user.name)
        }
      }
      if (type === 'manager') {
        // 如果点击的是已选中的用户，则取消选择；否则选择该用户
        if (this.selected.manager && this.selected.manager.id === user.id) {
          this.selected.manager = null
          console.log('取消选择项目负责人:', user.name)
        } else {
          this.selected.manager = user
          console.log('设置项目负责人:', user.name)
        }
      }
    },

    // 判断技术负责人是否被选中
    isTechSelected(user) {
      return this.selected.tech && this.selected.tech.id === user.id
    },

    // 判断项目负责人是否被选中
    isManagerSelected(user) {
      return this.selected.manager && this.selected.manager.id === user.id
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
        // 确保ID是字符串格式
        const userId = String(user.id)
        this.selected.workerIds.push(userId)
        console.log('添加用户后:', this.selected.workers)
        console.log('添加ID后:', this.selected.workerIds)
        console.log('添加的ID类型:', typeof userId, '值:', userId)
        console.log('workerIds详细内容:', JSON.stringify(this.selected.workerIds, null, 2))
      } else {
        this.selected.workers.splice(idx, 1)
        this.selected.workerIds = this.selected.workerIds.filter(id => String(id) !== String(user.id))
        console.log('移除用户后:', this.selected.workers)
        console.log('移除ID后:', this.selected.workerIds)
        console.log('移除后workerIds详细内容:', JSON.stringify(this.selected.workerIds, null, 2))
      }
    },

    // 加载已保存的人员配置
    async loadSavedPersonnelConfig() {
      try {
        console.log('=== 开始加载已保存的人员配置 ===')
        console.log('当前planId:', this.planId)
        console.log('当前路由query:', this.$route.query)

        if (this.planId) {
          console.log('调用getMaintenancePlan API，planId:', this.planId)
          const response = await getMaintenancePlan(this.planId)
          console.log('getMaintenancePlan API完整响应:', response)

          if (response && response.success && response.data) {
            console.log('API调用成功，响应数据结构:', {
              success: response.success,
              hasData: !!response.data,
              dataKeys: Object.keys(response.data || {}),
              hasMaintainPersons: !!(response.data && response.data.maintainPersons),
              maintainPersons: response.data.maintainPersons
            })

            if (response.data.maintainPersons) {
              console.log('找到已保存的人员配置，开始初始化:', response.data.maintainPersons)
              this.initializeFromData(response.data.maintainPersons)
              console.log('初始化完成，当前savedConfig:', this.savedConfig)
            } else {
              console.log('❌ 没有找到maintainPersons字段')
            }
          } else {
            console.log('❌ API调用失败或无数据:', {
              response: response,
              success: response?.success,
              hasData: !!(response?.data),
              fullResponse: response
            })
          }
        } else {
          console.log('❌ planId为空，无法加载已保存的人员配置')
        }
      } catch (error) {
        console.error('❌ 加载已保存的人员配置失败:', error)
        console.error('错误详情:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        })
      }
    },

    async reloadPlanData() {
      try {
        console.log('重新加载计划数据...')

        // 如果有planId，重新加载计划数据
        if (this.planId) {
          const response = await getMaintenancePlan(this.planId)

          if (response.success && response.data) {
            console.log('重新加载的计划数据:', response.data)

            // 更新本地存储的计划数据
            const planData = response.data
            localStorage.setItem('currentPlanData', JSON.stringify(planData))

            // 通知父组件数据已更新（使用window事件代替$bus）
            window.dispatchEvent(new CustomEvent('planDataUpdated', { detail: planData }))

            console.log('计划数据已重新加载并更新')

            // 重新加载当前页面的数据
            await this.loadStaffData()
          } else {
            console.log('重新加载计划数据失败:', response)
          }
        } else {
          console.log('没有planId，跳过重新加载')
        }
      } catch (error) {
        console.error('重新加载计划数据失败:', error)
      }
    },

    // 判断现场维护人员是否已选中（用于右侧新选择）
    isWorkerSelected(user) {
      // 使用严格的ID匹配，避免同名用户混淆
      const userId = String(user.id)
      const isSelected = this.selected.workerIds.some(id => String(id) === userId) &&
             this.selected.workers.some(w => String(w.id) === userId)

      // 添加调试信息
      console.log(`isWorkerSelected - 用户: ${user.name}, ID: ${user.id}, 是否选中: ${isSelected}`)
      console.log(`当前workerIds:`, this.selected.workerIds)
      console.log(`当前workers:`, this.selected.workers.map(w => ({ id: w.id, name: w.name })))
      console.log(`🔍 组件状态检查 - planId: ${this.planId}, 路由query:`, this.$route.query)

      return isSelected
    },

    // 判断现场维护人员是否在已保存配置中（用于左侧显示）
    isSavedWorkerSelected(user) {
      // 使用严格的ID匹配，避免同名用户混淆
      const userId = String(user.id)
      const isSelected = this.savedConfig.workerIds.some(id => String(id) === userId) &&
             this.savedConfig.workers.some(w => String(w.id) === userId)

      // 添加调试信息
      console.log(`isSavedWorkerSelected - 用户: ${user.name}, ID: ${user.id}, 是否在已保存配置中: ${isSelected}`)
      console.log(`已保存workerIds:`, this.savedConfig.workerIds)
      console.log(`已保存workers:`, this.savedConfig.workers.map(w => ({ id: w.id, name: w.name })))

      return isSelected
    },

    removePicked(type, user) {
      if (type === 'tech') this.selected.tech = null
      if (type === 'manager') this.selected.manager = null
      if (type === 'worker') {
        const userId = String(user.id)
        this.selected.workers = this.selected.workers.filter(w => String(w.id) !== userId)
        this.selected.workerIds = this.selected.workerIds.filter(id => String(id) !== userId)
      }
    },

    onCancel() {
      console.log('用户点击取消，返回上一页')
      this.$router.go(-1)
    },

    async onSave() {
      console.log('🚀🚀🚀 DispatchStaff onSave 被调用 - 最新版本 🚀🚀🚀')
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

      // 获取任务ID或计划ID - 优先从props获取，其次从路由获取
      const taskId = this.data.taskId || this.data._id || this.$route.query.taskId
      const planId = this.data.planId || this.$route.query.planId

      console.log('=== ID获取调试信息 ===')
      console.log('当前路由query:', this.$route.query)
      console.log('当前props data:', this.data)
      console.log('taskId值:', taskId)
      console.log('planId值:', planId)
      console.log('taskId类型:', typeof taskId)
      console.log('planId类型:', typeof planId)

      // 检查是否是在新增合同流程中（没有具体的任务ID或计划ID）
      let isNewContractFlow = !taskId && !planId && this.data.projectName

      console.log('🔍🔍🔍 流程检测调试信息 - 代码已更新 🔍🔍🔍')
      console.log('taskId存在:', !!taskId)
      console.log('planId存在:', !!planId)
      console.log('data.projectName存在:', !!this.data.projectName)
      console.log('data.projectName值:', this.data.projectName)
      console.log('isNewContractFlow:', isNewContractFlow)
      console.log('完整data对象:', this.data)

      // 简化逻辑：如果没有ID但有项目名称，就认为是新增合同流程
      if (!taskId && !planId) {
        if (this.data && this.data.projectName) {
          console.log('✅ 检测到新增合同流程（基于projectName）')
          isNewContractFlow = true
        } else {
          console.log('❌ 缺少任务ID和计划ID')
          console.log('路由query:', this.$route.query)
          console.log('props data:', this.data)
          this.$message.error('缺少任务ID或计划ID，无法保存')
          return
        }
      }

      if (isNewContractFlow) {
        console.log('✅ 检测到新增合同流程，跳过ID验证')
      } else {
        console.log('✅ 获取到的ID信息:', { taskId, planId })
      }

      // 构造返回数据
      const maintainPersons = {
        technical: this.selected.tech.id,
        leader: this.selected.manager.id,
        maintainers: this.selected.workerIds.filter(id => typeof id === 'string' && id.length > 0)
      }

      // 确保所有ID都是字符串格式
      console.log('workerIds原始数据:', this.selected.workerIds)
      console.log('workerIds类型检查:', this.selected.workerIds.map(id => ({ id, type: typeof id, isArray: Array.isArray(id) })))
      console.log('workerIds详细内容:', JSON.stringify(this.selected.workerIds, null, 2))
      console.log('过滤后的maintainers:', maintainPersons.maintainers)
      console.log('过滤后的maintainers类型检查:', maintainPersons.maintainers.map(id => ({ id, type: typeof id })))
      console.log('过滤后的maintainers详细内容:', JSON.stringify(maintainPersons.maintainers, null, 2))

      console.log('=== DispatchStaff onSave 详细数据 ===')
      console.log('任务ID:', taskId)
      console.log('技术负责人ID:', this.selected.tech.id)
      console.log('技术负责人姓名:', this.selected.tech.name)
      console.log('项目负责人ID:', this.selected.manager.id)
      console.log('项目负责人姓名:', this.selected.manager.name)
      console.log('现场维护人员数量:', this.selected.workers.length)
      console.log('现场维护人员ID列表:', this.selected.workerIds)
      console.log('现场维护人员详情:', this.selected.workers.map(w => ({ id: w.id, name: w.name })))
      console.log('发送的维保人员数据:', maintainPersons)

      try {
        // 检查是否是在新增合同流程中
        if (isNewContractFlow) {
          console.log('✅ 新增合同流程，直接返回数据给父组件')
          // 构造返回数据
          const result = {
            maintainPersons: maintainPersons,
            selectedStaff: {
              tech: this.selected.tech,
              manager: this.selected.manager,
              workers: this.selected.workers
            }
          }

          // 触发submit事件，将数据传递给父组件
          this.$emit('submit', result)
          this.$message.success('人员配置已保存！')
          return
        }

        // 保存到后端
        this.$message.info('正在保存人员配置...')

        let response

        // 判断是计划数据还是任务数据
        if (planId) {
          // 更新计划数据
          console.log('更新计划人员配置，计划ID:', planId)
          response = await updateMaintenancePlan(planId, {
            maintainPersons: maintainPersons
          })
        } else if (taskId) {
          // 更新任务数据
          console.log('更新任务人员配置，任务ID:', taskId)
          response = await assignMaintainers(taskId, {
            maintainPersons: maintainPersons
          })
        } else {
          this.$message.error('无法确定是计划还是任务，请检查参数')
          return
        }

        console.log('保存响应结果:', response)

        if (response.success) {
          this.$message.success('人员配置保存成功！')

          // 将新选择的配置更新到已保存配置（左侧显示）
          this.savedConfig = {
            tech: this.selected.tech,
            manager: this.selected.manager,
            workers: [...this.selected.workers],
            workerIds: [...this.selected.workerIds]
          }

          // 清空右侧的新选择，等待下次选择
          this.selected = {
            tech: null,
            manager: null,
            workers: [],
            workerIds: []
          }

          // 向父组件发送数据，包含完整的人员信息
          this.$emit('submit', {
            maintainPersons,
            selectedStaff: {
              tech: this.savedConfig.tech,
              manager: this.savedConfig.manager,
              workers: this.savedConfig.workers
            }
          })

          // 发送全局事件，通知其他页面维保人员已更新
          window.dispatchEvent(new CustomEvent('maintenancePersonnelUpdated', {
            detail: {
              planId: this.planId,
              maintainPersons: maintainPersons,
              timestamp: new Date().toISOString()
            }
          }))

          console.log('📢 已发送维保人员更新事件')

          // 延迟返回上一页
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        } else {
          this.$message.error(`保存失败：${response.message || '请重试'}`)
        }
      } catch (error) {
        console.error('保存人员配置失败:', error)
        console.error('错误响应:', error.response)
        console.error('错误数据:', error.response?.data)

        // 显示详细的错误信息
        if (error.response?.data) {
          const errorData = error.response.data
          console.log('详细错误信息:', errorData)

          if (errorData.details) {
            this.$message.error(`保存失败：${errorData.message} - ${errorData.details.errorType || errorData.error || '未知错误'}`)
          } else {
            this.$message.error(`保存失败：${errorData.message || error.message || '请重试'}`)
          }
        } else {
          this.$message.error(`保存失败：${error.message || '请重试'}`)
        }
      }
    },

    onSetting() {
      this.$message.info('设置')
    },

    onSearch() {
      // 前端本地过滤
    },

    // 兼容后端不同头像字段并标准化为可访问URL
    resolveStaffAvatar(staff) {
      if (!staff) return this.getDefaultAvatar()

      const rawAvatar = staff.avatar || staff.avatarUrl || staff.photo || staff.headImg || staff.headImage ||
        (staff.userId && staff.userId.avatar)
      return this.getValidAvatar(rawAvatar)
    },

    // 获取有效的头像URL，如果没有则使用默认头像
    getValidAvatar(avatarUrl) {
      if (!avatarUrl || typeof avatarUrl !== 'string') {
        return this.getDefaultAvatar()
      }

      const normalizedAvatar = avatarUrl.trim()
      if (!normalizedAvatar) return this.getDefaultAvatar()

      // 已经是完整 URL
      if (/^https?:\/\//i.test(normalizedAvatar)) {
        if (normalizedAvatar.includes('example.com')) return this.getDefaultAvatar()
        return normalizedAvatar
      }

      // 协议相对 URL（如 //cdn.xxx.com/a.jpg）
      if (normalizedAvatar.startsWith('//')) {
        return `https:${normalizedAvatar}`
      }

      // 相对路径（如 /uploads/a.jpg 或 uploads/a.jpg）拼接后端域名
      const host = this.getUploadHost()
      const normalizedPath = normalizedAvatar.startsWith('/') ? normalizedAvatar : `/${normalizedAvatar}`
      return `${host}${normalizedPath}`
    },

    getUploadHost() {
      const baseApi = (process.env.VUE_APP_BASE_API || '').trim()
      if (baseApi) {
        return baseApi.replace(/\/+$/, '')
      }
      return window.location.origin
    },

    getDefaultAvatar() {
      return require('@/assets/avatar-1.jpg')
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

/* 确保按钮区域唯一性 */
.dispatch-staff-buttons {
  position: relative;
  z-index: 100;
}

/* 隐藏任何可能的重复按钮 */
.dispatch-staff-page .el-button + .el-button {
  margin-left: 16px;
}
.empty-list {
  text-align: center;
  padding: 20px;
  color: #789;
  font-size: 16px;
}
.footer-actions {
  position: fixed;
  bottom: 20px;
  right: 40px;
  display: flex;
  gap: 12px;
  z-index: 1000;
  background: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}
</style>
