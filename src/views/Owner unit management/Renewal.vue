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
            <img :src="step.icon" alt="">
          </div>
          <span>{{ step.label }}</span>
          <div class="step-number" :class="{ active: idx === activeIndex }">{{ idx + 1 }}</div>
        </div>
        <template v-if="idx < steps.length - 1">
          <div class="step-arrow" />
        </template>
      </div>
    </div>
    <!-- 内容区（按步切换） -->
    <div class="step-content">
      <component
        :is="steps[activeIndex].component"
        :form-data="getStepFormData()"
        :key="'step-' + activeIndex + '-' + (formData.originalContractId || 'new')"
        @next="handleNext"
        @prev="handlePrev"
        @update="updateFormData"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script>
// 续签用的三个步骤组件（你可以后续完善）
import RenewalContractInfo from './Renewal contract information.vue'
import RenewalProjectInfo from './Renewal Project information.vue'
import RenewalDispatchStaff from './Renewwal Configure maintenance personnel.vue'
import { getContractDetail, renewalContract } from '@/api/contract' // 你的API

export default {
  name: 'Renewal',
  components: {
    RenewalContractInfo,
    RenewalProjectInfo,
    RenewalDispatchStaff
  },
  data() {
    return {
      activeIndex: 0,
      // 统一数据中心
      formData: {},
      contractId: null, // 保存原合同ID
      steps: [
        {
          label: '续签合同信息',
          name: 'contract',
          icon: require('@/assets/contract-icon.png'),
          component: 'RenewalContractInfo'
        },
        {
          label: '续签项目信息',
          name: 'project',
          icon: require('@/assets/project-icon.png'),
          component: 'RenewalProjectInfo'
        },
        {
          label: '配置维保人员',
          name: 'staff',
          icon: require('@/assets/staff-icon.png'),
          component: 'RenewalDispatchStaff'
        }
      ]
    }
  },
  created() {
    // 获取url参数id
    const contractId = this.$route.query.id
    if (contractId) {
      this.contractId = contractId
      this.loadContract(contractId)
    } else {
      this.$message.error('缺少合同ID参数')
      this.$router.push('/contract/list')
    }
  },
  watch: {
    // 监听formData变化，确保子组件能及时更新
    formData: {
      handler(newVal) {
        console.log('formData发生变化:', newVal)
      },
      deep: true
    },
    // 监听activeIndex变化，确保切换步骤时数据正确传递
    activeIndex(newVal) {
      console.log('切换到步骤:', newVal)
    }
  },
  methods: {
    async loadContract(id) {
      try {
        const res = await getContractDetail(id)
        if (!res || !res.data) throw new Error('数据为空')
        
        console.log('后端返回的合同数据:', res.data)
        
        const { id: originalId } = res.data

        // 构建统一的、完整的表单数据
        this.formData = { 
          // 合同基本信息
          entrustName: res.data.clientCompany || '',
          creditCode: res.data.creditCode || '',
          contractName: res.data.name || '',
          contractNo: res.data.code || '',
          payCycle: res.data.payCycle || '',
          buildType: res.data.warrantyType || '',
          maintType: res.data.warrantyMethod || '',
          maintArea: res.data.warrantyArea || '',
          amount: res.data.amount || '',
          dateStart: '', // 清空时间，允许重新设置
          dateEnd: '', // 清空时间，允许重新设置
          remind: res.data.autoNotice ? 1 : 0,
          designOrg: res.data.designCompany || '',
          debugOrg: res.data.debugCompany || '',
          recordOrg: res.data.checkCompany || '',
          remark: res.data.note || '',
          
          // 建筑信息
          buildingList: res.data.buildings ? res.data.buildings.filter(b => b).map(b => ({
            name: b.name || '',
            area: b.area || '',
            floor: b.floors || '',
            height: b.height || '',
            remark: ''
          })) : [],
          
          // 维保内容
          checkedMaintList: res.data.maintainItems ? res.data.maintainItems.filter(item => item).map(item => ({
            system: item.system || '',
            item: item.item || '',
            content: item.content || '',
            period: item.period || '',
            standard: item.standard || ''
          })) : [],
          
          // 项目列表
          projectList: res.data.project ? [{
              name: res.data.project.name || '',
              ownerName: res.data.project.ownerCompany || '',
              address: res.data.project.address || '',
              area: res.data.project.district || '',
              linkman: res.data.project.contactPerson || '',
              phone: res.data.project.contactPhone || '',
              index: 1
          }] : [],

          // 维保人员
          dispatchStaffList: res.data.maintainPersons ? [{
              ownerUnit: (res.data.project && res.data.project.ownerCompany) || '',
              projectName: (res.data.project && res.data.project.name) || '',
              techLeader: res.data.maintainPersons.technical,
              projectLeader: res.data.maintainPersons.leader,
              onSiteStaff: res.data.maintainPersons.maintainers || []
          }] : [],
          
          originalContractId: originalId // 保存原合同ID用于续签
        }
        
        console.log('统一的formData已加载:', this.formData)

      } catch (e) {
        console.error('加载合同数据失败:', e)
        this.$message.error('加载合同数据失败')
        this.$router.push('/contract/list')
      }
    },
    handleNext(payload) {
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
      // 直接将子组件的更新合并到统一的formData中
      this.formData = { ...this.formData, ...data }
      console.log('formData 已更新:', this.formData)
    },
    async handleSubmit() {
      // 准备项目信息
      const project = (this.formData.projectList && this.formData.projectList[0]) || {}
      const projectInfo = {
        name: project.name,
        ownerCompany: project.ownerName,
        address: project.address,
        district: project.area,
        contactPerson: project.linkman,
        contactPhone: project.phone,
      }

      // 准备维保人员信息
      const staffInfo = (this.formData.dispatchStaffList && this.formData.dispatchStaffList[0]) || {};
      const maintainPersons = {
        technical: staffInfo.techLeader?._id || staffInfo.techLeader,
        leader: staffInfo.projectLeader?._id || staffInfo.projectLeader,
        maintainers: Array.isArray(staffInfo.onSiteStaff) 
          ? staffInfo.onSiteStaff.map(s => s._id || s)
          : [],
      };

      // 构建最终提交的 payload
      const payload = {
        ...this.formData,
        projectInfo,
        maintainPersons,
        originalContractId: this.contractId,
      }
      // 清理不再需要的数据
      delete payload.dispatchStaffList;

      // 校验
      if (!payload.dateStart || !payload.dateEnd) {
        this.$message.error('请填写合同时间')
        this.activeIndex = 0
        return
      }

      if (!projectInfo.name || !projectInfo.ownerCompany) {
        this.$message.error('请补全项目信息')
        return
      }

      try {
        console.log('提交续签数据:', payload)
        await renewalContract(payload)
        this.$message.success('续签提交成功')
        this.$router.push('/contract/list')
      } catch (e) {
        console.error('续签提交失败:', e)
        this.$message.error('续签提交失败')
      }
    },
    getStepFormData() {
      // 根据当前步骤返回相应的数据
      const baseData = {
        // 基础信息，所有步骤都需要
        entrustName: this.formData.entrustName || '',
        creditCode: this.formData.creditCode || '',
        originalContractId: this.formData.originalContractId
      }
      
      switch (this.activeIndex) {
        case 0: // 合同信息步骤
          return {
            ...baseData,
            ...this.formData
          }
        case 1: // 项目信息步骤
          return {
            ...baseData,
            ...this.formData
          }
        case 2: // 维保人员步骤
          return {
            ...baseData,
            ...this.formData
          }
        default:
          return baseData
      }
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
