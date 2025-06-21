<template>
  <div class="renewal-steps-root">
    <div class="step-bar-nav">
      <div
        v-for="(step, idx) in steps"
        :key="step.label"
        :class="['step-block', { active: idx === current, done: idx < current }]"
      >
        <!-- 主卡片 -->
        <div class="step-card">
          <span class="step-title">{{ step.label }}</span>
          <i :class="['step-icon', step.icon]" />
          <!-- 右侧蓝角+数字 -->
          <div v-if="idx <= current" class="step-corner">
            <span>{{ idx + 1 }}</span>
          </div>
          <div v-else class="step-corner grey">
            <span>{{ idx + 1 }}</span>
          </div>
        </div>
        <!-- 箭头 -->
        <div v-if="idx < steps.length - 1" class="arrow-wrap">
          <svg width="92" height="6"><path d="M0 3h85l6-3v6z" fill="#b8d7f6" /></svg>
        </div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="step-content">
      <component
        :is="steps[current].component"
        @next="nextStep"
        @prev="prevStep"
      />
    </div>
  </div>
</template>

<script>
import RenewalContract from './Renewal contract information.vue'
import RenewalProject from './Renewal Project information.vue'
import RenewalStaff from './Renewwal Configure maintenance personnel.vue'

export default {
  name: 'Renewal',
  components: {
    RenewalContract,
    RenewalProject,
    RenewalStaff
  },
  data() {
    return {
      current: 0,
      steps: [
        { label: '续签合同信息', icon: 'icon-contract', component: 'RenewalContract' },
        { label: '续签项目信息', icon: 'icon-project', component: 'RenewalProject' },
        { label: '配置维保人员', icon: 'icon-staff', component: 'RenewalStaff' }
      ]
    }
  },
  methods: {
    nextStep() { if (this.current < this.steps.length - 1) this.current++ },
    prevStep() { if (this.current > 0) this.current-- }
  }
}
</script>

<style scoped>
.renewal-steps-root {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 60px;
}
.step-bar-nav {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 16px 0 40px 0;
  gap: 60px;
}
.step-block {
  display: flex;
  align-items: flex-start;
  position: relative;
}
.step-card {
  position: relative;
  min-width: 330px;
  height: 110px;
  background: #fff;
  border-radius: 14px 14px 18px 14px;
  box-shadow: 0 8px 32px #b8e6ff2b;
  display: flex;
  align-items: center;
  padding: 0 16px 0 34px;
  font-size: 28px;
  font-weight: 500;
  transition: box-shadow 0.2s;
  margin-bottom: 12px;
}
.step-title {
  flex: 1;
  font-size: 26px;
  color: #222;
  font-weight: 500;
}
.step-icon {
  position: absolute;
  bottom: 13px;
  right: 22px;
  font-size: 44px;
  color: #bdd6f9;
  opacity: 0.9;
}
.icon-contract:before { content: "\f4ff"; font-family: "element-icons"; } /* 换成合适iconfont */
.icon-project:before { content: "\f170"; font-family: "element-icons"; }
.icon-staff:before { content: "\f1b0"; font-family: "element-icons"; }
.step-corner {
  position: absolute;
  top: 0; right: -36px;
  width: 56px; height: 92px;
  background: #167eff;
  border-radius: 0 20px 0 40px;
  display: flex; align-items: flex-end; justify-content: center;
  color: #fff; font-size: 32px; font-weight: bold;
  box-shadow: 0 8px 24px #1a8bff23;
  z-index: 2;
  transition: background .2s;
}
.step-corner.grey {
  background: #d8e3f3;
  color: #c3c7cb;
}
.step-block.done .step-card {
  opacity: 0.7;
}
.step-block.active .step-card,
.step-block.active .step-corner {
  background: linear-gradient(98deg,#cbe4ff 0%,#e7f1fd 100%);
  box-shadow: 0 8px 32px #c6e7ff65;
}
.step-block.active .step-corner { background: #167eff; color: #fff;}
.arrow-wrap {
  display: flex; align-items: flex-end; justify-content: center;
  min-width: 80px;
  margin: 0 2px 0 2px;
  margin-top: 33px;
}
@media (max-width: 1350px) {
  .step-card { min-width: 210px; font-size: 18px; }
  .step-title { font-size: 16px; }
}
.step-content {
  margin: 0 auto;
  max-width: 1600px;
  background: #fff;
  border-radius: 18px;
  min-height: 440px;
  box-shadow: 0 8px 32px #e0eaff2b;
  padding: 24px 0 36px 0;
}
</style>
