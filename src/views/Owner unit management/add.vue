<template>
  <div class="progress-navbar">
    <!-- 步骤条 -->
    <div class="steps-bar">
      <div
        v-for="(step, idx) in steps"
        :key="step.name"
        :class="['step-item', { active: idx === activeIndex }]"
      >
        <div :class="['step-bg', { 'highlight': idx === activeIndex }]">
          <div class="step-icon">
            <img :src="step.icon" alt="" />
          </div>
          <span>{{ step.label }}</span>
          <div class="step-number" :class="{ active: idx === activeIndex }">{{ idx + 1 }}</div>
        </div>
        <template v-if="idx < steps.length - 1">
          <div class="step-arrow"></div>
        </template>
      </div>
    </div>
    <!-- 内容区（按步切换） -->
    <div class="step-content">
      <component :is="steps[activeIndex].component"
                 :form-data="formData"
                 @next="handleNext"
                 @prev="handlePrev"
                 @update="updateFormData"
      />
    </div>
  </div>
</template>

<script>
import AddNewContractInfo from './add new contract information.vue'
import AddNewProjectInfo from './add new project information.vue'
import DispatchStaff from '@/views/Maintenance and Service Management/DispatchStaff.vue'

export default {
  name: 'AddContractStep',
  components: { AddNewContractInfo, AddNewProjectInfo, DispatchStaff },
  data() {
    return {
      activeIndex: 0,
      // 统一传递表单数据
      formData: {},
      steps: [
        {
          label: '新增合同信息',
          name: 'contract',
          icon: require('@/assets/contract-icon.png'),
          component: 'AddNewContractInfo'
        },
        {
          label: '新增项目信息',
          name: 'project',
          icon: require('@/assets/project-icon.png'),
          component: 'AddNewProjectInfo'
        },
        {
          label: '配置维保人员',
          name: 'staff',
          icon: require('@/assets/staff-icon.png'),
          component: 'DispatchStaff'
        }
      ]
    }
  },
  methods: {
    handleNext(payload) {
      // payload 可选，提交校验，更新表单数据
      if (this.activeIndex < this.steps.length - 1) {
        this.activeIndex++
      }
    },
    handlePrev() {
      if (this.activeIndex > 0) {
        this.activeIndex--
      }
    },
    updateFormData(data) {
      this.formData = { ...this.formData, ...data }
    }
  }
}
</script>

<style scoped>
.progress-navbar {
  background: #f8f9fb;
  min-height: 100vh;
  padding: 0 0 24px 0;
}
.steps-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 24px 0;
  min-height: 92px;
}
.step-item {
  display: flex;
  align-items: center;
}
.step-bg {
  background: #fff;
  border-radius: 14px 14px 0 14px;
  box-shadow: 0 4px 16px #e0ebff3b;
  padding: 18px 54px 18px 28px;
  min-width: 220px;
  position: relative;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.step-bg.highlight {
  background: linear-gradient(90deg, #e4f0fe 0%, #d7e8fd 100%);
  box-shadow: 0 4px 24px #7db3f533;
}
.step-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.step-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.step-bg span {
  font-size: 19px;
  color: #222;
  font-weight: 500;
}
.step-number {
  position: absolute;
  right: 12px;
  top: 14px;
  font-size: 24px;
  font-weight: bold;
  color: #2196f3;
  opacity: 0.18;
  z-index: 2;
}
.step-bg.highlight .step-number {
  color: #1e72d8;
  opacity: 1;
  background: #1e72d8;
  color: #fff;
  border-radius: 7px;
  padding: 3px 14px;
  font-size: 20px;
  position: absolute;
  right: 15px;
  top: 10px;
}
.step-arrow {
  width: 64px;
  height: 6px;
  border-bottom: 3px solid #e2eaf4;
  margin: 0 8px;
  border-radius: 2px;
  background: transparent;
  align-self: flex-end;
}
.step-content {
  background: #fff;
  margin-top: 18px;
  border-radius: 12px;
  min-height: 680px;
  box-shadow: 0 4px 16px #e0ebff3b;
  padding: 0 0 24px 0;
}
</style>
