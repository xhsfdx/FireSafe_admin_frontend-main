<template>
  <div class="dispatch-staff-root">
    <div class="form-card">
      <div class="section-title">配置维保人员</div>
      <div class="tips">
        <b>（提示：必须选择且只能选择一名项目负责人和技术负责人，至少一名现场维保人员。）</b>
      </div>

      <!-- 顶部角色切换按钮 -->
      <div class="role-tabs">
        <button
          v-for="(label, key) in roleMap"
          :key="key"
          :class="['role-tab-btn', { active: activeTab === key }]"
          @click="activeTab = key"
        >
          {{ label }}
        </button>
      </div>

      <!-- 左右两栏 -->
      <div class="staff-panel">
        <!-- 左侧人员列表 -->
        <div class="staff-list">
          <el-input v-model="search" placeholder="输入姓名查询" clearable class="search-input">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>

          <el-scrollbar class="scroll-area">
            <div v-for="person in filteredStaff" :key="person.id" class="staff-item">
              <el-checkbox
                v-if="activeTab === 'maintainer'"
                :checked="isSelected('maintainer', person)"
                @change="() => toggleSelect('maintainer', person)"
              />
              <div
                class="info-box"
                :class="{ selected: isSelected(activeTab, person), clickable: activeTab !== 'maintainer' }"
                @click="activeTab !== 'maintainer' && selectSingle(activeTab, person)"
              >
                <img :src="person.avatar" class="avatar">
                <div class="meta">
                  <div class="name">{{ person.name }}</div>
                  <div class="title">{{ person.title }}</div>
                  <div class="company">已分配 {{ person.assignedCount }} 家企业</div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 右侧已选卡片 -->
        <!-- 右侧服务人员区域（已勾选人员） -->
        <div class="selected-panel">
          <div class="selected-header">服务人员（已勾选人员）</div>

          <div v-for="(label, role) in roleMap" :key="role" class="selected-block">
            <div class="selected-title">{{ label }}</div>

            <template v-if="role === 'maintainer'">
              <template v-if="Array.isArray(selected.maintainer) && selected.maintainer.length > 0">
                <div v-for="person in selected.maintainer" :key="person.id" class="card">
                  <img :src="person.avatar" class="avatar">
                  <div class="meta">
                    <div class="name">{{ person.name }}</div>
                    <div class="title">{{ person.title }}</div>
                  </div>
                  <i class="el-icon-close" @click="remove(role, person)" />
                </div>
              </template>
              <template v-else>
                <div class="empty-card">+ 选择"现场维保人员"</div>
              </template>
            </template>

            <template v-else>
              <div v-if="selected[role]" class="card">
                <img :src="selected[role].avatar" class="avatar">
                <div class="meta">
                  <div class="name">{{ selected[role].name }}</div>
                  <div class="title">{{ selected[role].title }}</div>
                </div>
                <i class="el-icon-close" @click="remove(role)" />
              </div>
              <div v-else class="empty-card">+ 选择"{{ label }}"</div>
            </template>
          </div>
        </div>

      </div>
    </div>

    <div class="footer">
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import avatar1 from '@/assets/avatar-1.jpg'
export default {
  name: 'DispatchStaff',
  data() {
    return {
      activeTab: 'technical',
      search: '',
      staffList: [
        { id: 1, name: '张', title: '一级注册消防工程师', assignedCount: 4, avatar: avatar1 },
        { id: 2, name: 'ljh', title: '一级注册消防工程师', assignedCount: 4, avatar: avatar1 },
        { id: 3, name: '陈xx', title: '一级注册消防工程师', assignedCount: 5, avatar: avatar1 },
        { id: 4, name: '邱峰', title: '一级注册消防工程师', assignedCount: 6, avatar: avatar1 },
        { id: 5, name: '黎建军', title: '消防设施操作员', assignedCount: 4, avatar: avatar1 }
      ],
      selected: {
        technical: null,
        leader: null,
        maintainer: [] // ✅ 一定要这样
      },

      roleMap: {
        technical: '技术负责人',
        leader: '项目负责人',
        maintainer: '现场维保人员'
      }
    }
  },
  computed: {
    filteredStaff() {
      return this.staffList.filter(p => p.name.includes(this.search))
    }
  },
  methods: {
    isSelected(role, person) {
      if (role === 'maintainer') {
        return this.selected.maintainer.some(p => p.id === person.id)
      }
      return this.selected[role]?.id === person.id
    },
    toggleSelect(role, person) {
      const exists = this.selected.maintainer.find(p => p.id === person.id)
      if (exists) {
        this.selected.maintainer = this.selected.maintainer.filter(p => p.id !== person.id)
      } else {
        this.selected.maintainer.push(person)
      }
    },
    selectSingle(role, person) {
      this.selected[role] = person
    },
    remove(role, person) {
      if (role === 'maintainer') {
        this.selected.maintainer = this.selected.maintainer.filter(p => p.id !== person.id)
      } else {
        this.selected[role] = null
      }
    },
    submit() {
      if (!this.selected.technical || !this.selected.leader || this.selected.maintainer.length === 0) {
        this.$message.error('请选择技术负责人、项目负责人和至少一名现场维保人员')
        return
      }
      const result = {
        projectName: this.data && this.data.projectName ? this.data.projectName : '',
        maintainPersons: {
          technical: this.selected.technical?.name || '',
          leader: this.selected.leader?.name || '',
          maintainer: this.selected.maintainer.map(p => p.name)
        },
        technical: this.selected.technical || null,
        leader: this.selected.leader || null,
        maintainer: this.selected.maintainer || []
      }
      console.log('弹窗保存返回:', result)
      this.$emit('confirm', result)
      this.$emit('submit', result)
    }
  }
}
</script>

<style scoped>
.dispatch-staff-root {
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
}

.tips {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 12px;
}

.role-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.role-tab-btn {
  padding: 8px 16px;
  border: none;
  background: #eaf3ff;
  border-radius: 4px;
  cursor: pointer;
}

.role-tab-btn.active {
  background: #409EFF;
  color: white;
}

.staff-panel {
  display: flex;
  gap: 20px;
}

.staff-list {
  width: 50%;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}

.search-input {
  margin-bottom: 12px;
}

.scroll-area {
  max-height: 480px;
}

.staff-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.info-box {
  display: flex;
  margin-left: 10px;
  padding: 8px;
  border-radius: 6px;
  flex: 1;
}

.info-box.clickable:hover {
  background: #f0f7ff;
}

.info-box.selected {
  background: #ecf5ff;
  border: 1px solid #409EFF;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.meta {
  margin-left: 10px;
}

.name {
  font-weight: bold;
}

.title,
.company {
  font-size: 12px;
  color: #888;
}

.selected-list {
  width: 50%;
}

.selected-block {
  margin-bottom: 20px;
}

.selected-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.card {
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
}

.card .avatar {
  width: 40px;
  height: 40px;
}

.card .meta {
  margin-left: 10px;
}

.card i {
  position: absolute;
  top: 8px;
  right: 10px;
  cursor: pointer;
  color: #f56c6c;
}

.empty-card {
  padding: 20px;
  background: #f7f9fc;
  border: 1px dashed #bbb;
  border-radius: 6px;
  color: #409EFF;
  text-align: center;
}

.footer {
  margin-top: 20px;
  text-align: right;
}

.selected-panel {
  width: 50%;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
}

.selected-header {
  background: #eaf3ff;
  padding: 10px 16px;
  font-weight: bold;
  border-radius: 6px;
  margin-bottom: 20px;
}

.selected-block {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.selected-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.card {
  display: flex;
  align-items: center;
  position: relative;
  padding: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  margin-bottom: 12px;
}

.card .avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-right: 12px;
}

.card .meta .name {
  font-weight: bold;
}

.card .meta .title {
  font-size: 12px;
  color: #888;
}

.card i {
  position: absolute;
  right: 12px;
  top: 12px;
  color: #f56c6c;
  cursor: pointer;
}

.empty-card {
  padding: 24px;
  background: #f0f6fd;
  border: 1px dashed #bbb;
  border-radius: 8px;
  color: #409EFF;
  text-align: left;
  font-size: 14px;
}
</style>
