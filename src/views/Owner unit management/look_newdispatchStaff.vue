<template>
  <div class="app-container">
    <div class="dispatch-staff-page">
      <div class="header">
        <h2>维保人员配置</h2>
        <p class="subtitle">合同关联的维保人员信息</p>
      </div>

      <!-- 表格区 -->
      <el-table :data="staffData" border style="width: 100%">
        <el-table-column label="序号" width="60" type="index" align="center" />
        <el-table-column label="项目名称" prop="projectName" align="center" />
        <el-table-column label="业主单位" prop="ownerName" align="center" />
        <el-table-column label="技术负责人" align="center">
          <template slot-scope="{ row }">
            <div class="staff-info">
              <img :src="row.technicalAvatar || require('@/assets/avatar-1.jpg')" class="staff-avatar" />
              <span class="staff-name">{{ row.technical }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="项目负责人" align="center">
          <template slot-scope="{ row }">
            <div class="staff-info">
              <img :src="row.leaderAvatar || require('@/assets/avatar-1.jpg')" class="staff-avatar" />
              <span class="staff-name">{{ row.leader }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="现场维保人员" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.maintainers && row.maintainers !== '未配置'" class="maintainers-list">
              <div v-for="(maintainer, index) in row.maintainersList" :key="index" class="staff-info">
                <img :src="maintainer.avatar || require('@/assets/avatar-1.jpg')" class="staff-avatar" />
                <span class="staff-name">{{ maintainer.name }}</span>
              </div>
            </div>
            <span v-else class="no-config">{{ row.maintainers }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空数据提示 -->
      <div v-if="!staffData.length" class="empty-data">
        <img src="@/assets/无数据.jpg" alt="暂无数据" style="width: 120px; opacity: 0.6;">
        <p>暂无维保人员数据</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LookNewDispatchStaff',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      staffData: []
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        this.processStaffData(newVal)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    processStaffData(formData) {
      console.log('=== 处理维保人员数据 ===')
      console.log('formData:', formData)
      console.log('formData.dispatchStaffList:', formData.dispatchStaffList)
      console.log('formData.projectList:', formData.projectList)
      console.log('formData.contractName:', formData.contractName)
      console.log('formData.entrustName:', formData.entrustName)
      console.log('formData.name:', formData.name)
      console.log('formData.clientCompany:', formData.clientCompany)
      
      // 从formData中提取维保人员数据
      const dispatchStaffList = formData.dispatchStaffList || []
      
      // 从formData中获取项目信息
      const projectList = formData.projectList || []
      const project = projectList.length > 0 ? projectList[0] : {}

      // 确定项目名称和业主单位
      let projectName = '未知项目'
      let ownerName = '未知业主'
      
      // 优先使用dispatchStaffList中的数据
      if (dispatchStaffList.length > 0) {
        const staffItem = dispatchStaffList[0]
        if (staffItem.projectName && typeof staffItem.projectName === 'string') {
          projectName = staffItem.projectName
        } else if (project.name) {
          projectName = project.name
        } else if (formData.contractName || formData.name) {
          projectName = formData.contractName || formData.name
        }
        
        if (staffItem.ownerName && typeof staffItem.ownerName === 'string') {
          ownerName = staffItem.ownerName
        } else if (project.ownerName) {
          ownerName = project.ownerName
        } else if (formData.entrustName || formData.clientCompany) {
          ownerName = formData.entrustName || formData.clientCompany
        }
      } else {
        // 如果没有dispatchStaffList，使用其他数据源
        if (project.name) {
          projectName = project.name
        } else if (formData.contractName || formData.name) {
          projectName = formData.contractName || formData.name
        }
        
        if (project.ownerName) {
          ownerName = project.ownerName
        } else if (formData.entrustName || formData.clientCompany) {
          ownerName = formData.entrustName || formData.clientCompany
        }
      }

      console.log('确定的项目信息:')
      console.log('- projectName:', projectName)
      console.log('- ownerName:', ownerName)

      if (dispatchStaffList.length === 0) {
        console.log('没有维保人员数据，显示默认信息')
        // 没有维保人员数据，显示默认信息
        this.staffData = [{
          projectName: projectName,
          ownerName: ownerName,
          technical: '未配置',
          leader: '未配置',
          maintainers: '未配置'
        }]
        return
      }

      // 获取第一个项目的维保人员数据
      const staffItem = dispatchStaffList[0]
      const maintainPersons = staffItem.maintainPersons

      console.log('维保人员数据:', maintainPersons)
      console.log('maintainPersons.technical:', maintainPersons.technical)
      console.log('maintainPersons.leader:', maintainPersons.leader)
      console.log('maintainPersons.maintainers:', maintainPersons.maintainers)

      // 提取人员姓名和头像 - 支持populated对象和ID字符串两种格式
      let technical = '未配置'
      let leader = '未配置'
      let maintainers = '未配置'
      let technicalAvatar = null
      let leaderAvatar = null
      let maintainersList = []
      
      // 处理技术负责人
      if (maintainPersons.technical) {
        if (typeof maintainPersons.technical === 'object' && maintainPersons.technical.name) {
          technical = maintainPersons.technical.name
          technicalAvatar = maintainPersons.technical.avatar || null
        } else if (typeof maintainPersons.technical === 'string' && maintainPersons.technical.trim() !== '') {
          technical = maintainPersons.technical
        }
      }
      
      // 处理项目负责人
      if (maintainPersons.leader) {
        if (typeof maintainPersons.leader === 'object' && maintainPersons.leader.name) {
          leader = maintainPersons.leader.name
          leaderAvatar = maintainPersons.leader.avatar || null
        } else if (typeof maintainPersons.leader === 'string' && maintainPersons.leader.trim() !== '') {
          leader = maintainPersons.leader
        }
      }
      
      // 处理现场维保人员
      console.log('=== 现场维保人员处理 ===')
      console.log('maintainPersons.maintainers:', maintainPersons.maintainers)
      console.log('maintainers类型:', typeof maintainPersons.maintainers)
      console.log('maintainers是否为数组:', Array.isArray(maintainPersons.maintainers))
      console.log('maintainers长度:', maintainPersons.maintainers ? maintainPersons.maintainers.length : 0)
      
      if (maintainPersons.maintainers && Array.isArray(maintainPersons.maintainers) && maintainPersons.maintainers.length > 0) {
        const maintainerNames = []
        
        maintainPersons.maintainers.forEach(person => {
          console.log('处理人员:', person)
          console.log('人员类型:', typeof person)
          
          if (typeof person === 'object' && person.name) {
            console.log('对象类型人员，姓名:', person.name)
            maintainerNames.push(person.name)
            maintainersList.push({
              name: person.name,
              avatar: person.avatar || null
            })
          } else if (typeof person === 'string' && person.trim() !== '') {
            console.log('字符串类型人员，ID:', person)
            // 如果是ID字符串，尝试从formData中查找对应的用户信息
            // 这里暂时显示ID，实际应该根据ID查找用户姓名
            maintainerNames.push(`用户ID: ${person}`)
            maintainersList.push({
              name: `用户ID: ${person}`,
              avatar: null
            })
          } else if (person && typeof person === 'object' && person._id) {
            console.log('对象类型人员（populated），姓名:', person.name)
            const name = person.name || `用户ID: ${person._id}`
            maintainerNames.push(name)
            maintainersList.push({
              name: name,
              avatar: person.avatar || null
            })
          } else {
            console.log('无效人员数据:', person)
          }
        })
        
        console.log('处理后的维护人员姓名:', maintainerNames)
        console.log('处理后的维护人员列表:', maintainersList)
        
        if (maintainerNames.length > 0) {
          maintainers = maintainerNames.join('、')
        }
      } else {
        console.log('现场维保人员数据为空或无效')
      }

      console.log('解析后的人员信息:');
      console.log('- technical:', technical);
      console.log('- leader:', leader);
      console.log('- maintainers:', maintainers);

      this.staffData = [{
        projectName: projectName,
        ownerName: ownerName,
        technical,
        leader,
        maintainers: maintainers || '未配置',
        technicalAvatar,
        leaderAvatar,
        maintainersList
      }]

      console.log('处理后的维保人员数据:', this.staffData)
      console.log('=== 数据验证 ===')
      console.log('项目名称类型:', typeof projectName, '值:', projectName)
      console.log('业主单位类型:', typeof ownerName, '值:', ownerName)
      console.log('技术负责人类型:', typeof technical, '值:', technical)
      console.log('项目负责人类型:', typeof leader, '值:', leader)
      console.log('现场维保人员类型:', typeof maintainers, '值:', maintainers)
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.dispatch-staff-page {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.header {
  margin-bottom: 24px;
  text-align: center;
}
.header h2 {
  color: #303133;
  margin-bottom: 8px;
}
.subtitle {
  color: #909399;
  font-size: 14px;
}
.empty-data {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}
.empty-data p {
  margin-top: 12px;
  font-size: 14px;
}

/* 维保人员信息样式 */
.staff-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.staff-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e4e7ed;
}

.staff-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.maintainers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.maintainers-list .staff-info {
  justify-content: flex-start;
  width: 100%;
}

.no-config {
  color: #909399;
  font-style: italic;
}
</style>
