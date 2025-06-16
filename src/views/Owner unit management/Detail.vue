  <template>
    <div class="progress-navbar">
      <div class="steps-bar">
        <div
          v-for="(step, idx) in steps"
          :key="step.name"
          :class="['step-item', { active: idx === activeIndex }]"
          @click="handleStepClick(idx)"
        >
          <div class="step-bg">
            <div class="step-icon">
              <img :src="step.icon" alt="" />
            </div>
            <span>{{ step.label }}</span>
          </div>
          <template v-if="idx < steps.length - 1">
            <div class="step-arrow"></div>
          </template>
        </div>
        <el-button class="back-btn" icon="el-icon-back" @click="$router.back()">返回</el-button>
      </div>
      <div class="step-content">
        <component :is="steps[activeIndex].component" :projectId="projectId" />
      </div>
    </div>
  </template>

  <script>
  import ContractInfo from './ContractInfo.vue'
  import ProjectInfo from './ProjectInfo.vue'
  import DispatchStaff from '@/views/Maintenance and Service Management/DispatchStaff.vue'

  export default {
    name: 'DetailStepNav',
    components: { ContractInfo, ProjectInfo, DispatchStaff },
    props: {
      projectId: String
    },
    data() {
      return {
        activeIndex: 0,
        steps: [
          {
            label: '合同信息',
            name: 'contract',
            icon: require('@/assets/contract-icon.png'),
            component: 'ContractInfo'
          },
          {
            label: '项目信息',
            name: 'project',
            icon: require('@/assets/project-icon.png'),
            component: 'ProjectInfo'
          },
          {
            label: '维保人员',
            name: 'staff',
            icon: require('@/assets/staff-icon.png'),
            component: 'DispatchStaff'
          }
        ]
      }
    },
    methods: {
      handleStepClick(idx) {
        this.activeIndex = idx
      }
    }
  }
  </script>

  <style scoped>
  .progress-navbar {
    background: #f8f9fb;
    padding: 0 0 24px 0;
  }

  /* 步骤条整体居中！ */
  .steps-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 0 0 20px 0;
    min-height: 88px;
  }

  .step-item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .step-bg {
    background: #fff;
    border-radius: 14px 14px 0 14px;
    box-shadow: 0 4px 16px #e0ebff3b;
    padding: 20px 48px 20px 32px;
    display: flex;
    align-items: center;
    position: relative;
    min-width: 160px;
    transition: background 0.2s;
  }

  .step-item.active .step-bg {
    background: linear-gradient(90deg, #cbe4ff 0%, #e7f1fd 100%);
  }

  .step-icon {
    width: 38px;
    height: 38px;
    margin-right: 12px;
  }
  .step-icon img {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }
  .step-bg span {
    font-size: 20px;
    font-weight: 500;
    color: #222;
  }
  .step-item.active .step-bg span {
    color: #346baf;
  }
  .step-arrow {
    width: 56px;
    height: 4px;
    border-bottom: 3px solid #94c2fc;
    margin: 0 8px;
    border-radius: 2px;
    background: transparent;
    align-self: flex-end;
  }

  /* 返回按钮始终在最右侧，不会影响中间步骤 */
  .back-btn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    margin-top: 8px;
  }

  .step-content {
    background: #fff;
    margin-top: 18px;
    border-radius: 10px;
    min-height: 600px;
    box-shadow: 0 4px 16px #e0ebff3b;
    padding: 0 0 24px 0;
  }
  </style>
