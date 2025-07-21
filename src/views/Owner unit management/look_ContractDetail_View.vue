<template>
  <div class="add-page-container">
    <el-card v-loading="loading" class="box-card">
      <!-- Custom Steps -->
      <div class="custom-steps">
        <div class="step-item" :class="{ 'active': activeStep === 0, 'completed': activeStep > 0 }">
          <div class="icon-container">
            <i class="el-icon-document" />
          </div>
          <span>合同信息</span>
          <div class="step-number-container">
            <div class="step-number">1</div>
          </div>
        </div>
        <div class="step-arrow" />
        <div class="step-item" :class="{ 'active': activeStep === 1, 'completed': activeStep > 1 }">
          <div class="icon-container">
            <i class="el-icon-folder-opened" />
          </div>
          <span>项目信息</span>
          <div class="step-number-container">
            <div class="step-number">2</div>
          </div>
        </div>
        <div class="step-arrow" />
        <div class="step-item" :class="{ 'active': activeStep === 2 }">
          <div class="icon-container">
            <i class="el-icon-user" />
          </div>
          <span>维保人员</span>
          <div class="step-number-container">
            <div class="step-number">3</div>
          </div>
        </div>
      </div>

      <div class="step-content">
        <LookContractInfoView
          v-show="activeStep === 0"
          :form-data="formData"
          @next="handleNext"
          @update="updateFormData"
        />
        <LookProjectInfoView
          v-show="activeStep === 1"
          :form-data="formData"
          @next="handleNext"
          @prev="handlePrev"
          @update="updateFormData"
        />
        <LookNewDispatchStaff
          v-show="activeStep === 2"
          :form-data="formData"
          @prev="handlePrev"
          @submit="submitAll"
          @update="updateFormData"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import LookContractInfoView from './look_ContractInfo_View.vue'
import LookProjectInfoView from './look_ProjectInfo_View.vue'
import LookNewDispatchStaff from './look_newdispatchStaff.vue'
import { fetchProjectDetail } from '@/api/contract'

export default {
  name: 'LookContractDetailView',
  components: {
    LookContractInfoView,
    LookProjectInfoView,
    LookNewDispatchStaff
  },
  data() {
    return {
      activeStep: 0,
      formData: {},
      loading: false
    }
  },
  created() {
    this.loadContractDetails()
  },
  methods: {
    async loadContractDetails() {
      const id = this.$route.query.id
      if (!id) {
        this.$message.error('未找到合同ID')
        this.$router.back()
        return
      }
      console.log('开始加载合同详情，ID:', id)
      this.loading = true
      try {
        const res = await fetchProjectDetail(id)
        console.log('API返回的原始数据:', res)
        
        if (res.success && res.data) {
          const item = res.data
          console.log('后端返回的合同数据:', item)
          
          // 适配合同信息 - 传递完整的后端数据
          const formData = {
            // 传递完整的后端数据
            ...item,
            // 合同基本信息
            contractName: item.name || '',
            contractNo: item.code || '',
            entrustName: item.clientCompany || '',
            creditCode: item.creditCode || '',
            contractType: item.contractType || '',
            payCycle: item.payCycle || '',
            buildType: item.warrantyType || '',
            maintType: item.warrantyMethod || '',
            maintArea: item.warrantyArea || '',
            amount: item.amount || '',
            dateStart: item.startDate || '',
            dateEnd: item.endDate || '',
            remind: item.autoNotice || false,
            designOrg: item.designCompany || '',
            debugOrg: item.debugCompany || '',
            recordOrg: item.checkCompany || '',
            remark: item.note || '',
            // 建筑信息 - 从populate的buildings中提取数据
            buildingList: (item.buildings || []).map(b => ({
              name: b.name || '',
              area: b.area || 0,
              floor: b.floors || 0,
              height: b.height || 0,
              remark: b.remark || ''
            })),
            // 维保内容
            checkedMaintList: item.maintainItems || [],
            // 项目信息 - 从populate的project中提取数据
            projectList: item.project ? [{
              ownerName: item.project.ownerCompany || item.project.companyname || '',
              name: item.project.name || '',
              address: item.project.address || '',
              area: item.project.district || '',
              linkman: item.project.contactPerson || '',
              phone: item.project.contactPhone || ''
            }] : [],
            // 维保人员 - 处理populate的数据
            dispatchStaffList: [{
              projectName: item.project?.name || item.name || '',
              ownerName: item.project?.ownerCompany || item.project?.companyname || item.clientCompany || '',
              maintainPersons: item.maintainPersons ? {
                technical: item.maintainPersons.technical || null,
                leader: item.maintainPersons.leader || null,
                maintainers: Array.isArray(item.maintainPersons.maintainers) ? item.maintainPersons.maintainers : []
              } : {
                technical: null,
                leader: null,
                maintainers: []
              }
            }]
          }
          
          console.log('处理后的formData:', formData)
          console.log('维保人员数据:', formData.dispatchStaffList)
          console.log('项目信息:', formData.projectList)
          console.log('原始项目数据:', item.project)
          console.log('原始合同数据:', item)
          console.log('项目名称:', item.project?.name)
          console.log('项目ID:', item.project?._id)
          console.log('业主单位:', item.project?.ownerCompany)
          console.log('委托单位:', item.clientCompany)
          console.log('=== 维保人员数据详细分析 ===')
          console.log('item.maintainPersons:', item.maintainPersons)
          if (item.maintainPersons) {
            console.log('technical:', item.maintainPersons.technical)
            console.log('leader:', item.maintainPersons.leader)
            console.log('maintainers:', item.maintainPersons.maintainers)
            console.log('technical类型:', typeof item.maintainPersons.technical)
            console.log('leader类型:', typeof item.maintainPersons.leader)
            console.log('maintainers类型:', typeof item.maintainPersons.maintainers)
            console.log('maintainers是否为数组:', Array.isArray(item.maintainPersons.maintainers))
          }
          this.formData = formData
        } else {
          console.error('API返回失败:', res)
          this.$message.error(res.message || '获取合同详情失败')
        }
      } catch (err) {
        console.error('加载合同详情失败:', err)
        this.$message.error('网络请求失败')
      } finally {
        this.loading = false
      }
    },
    handleNext() {
      if (this.activeStep < 2) {
        this.activeStep++
      }
    },
    handlePrev() {
      if (this.activeStep > 0) {
        this.activeStep--
      }
    },
    updateFormData(data) {
      this.formData = { ...this.formData, ...data }
    },
    async submitAll() {
      // 这里可以根据需要处理最终提交逻辑
      this.$message.success('查看完成！')
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.add-page-container {
  padding: 18px;
  background-color: #f0f2f5;
}
.box-card {
  border-radius: 10px;
}
.step-content {
  margin-top: 40px;
}
.custom-steps {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
}
.step-item {
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #999;
  position: relative;
  overflow: hidden;
  flex: 1;
  justify-content: center;
}
.step-item.active {
  background-color: #eaf3ff;
  border-color: #409eff;
  color: #333;
  font-weight: bold;
}
.step-item.completed {
  background-color: #f0f9eb;
  border-color: #67c23a;
  color: #333;
}
.icon-container {
  font-size: 24px;
  margin-right: 15px;
}
.step-number-container {
  position: absolute;
  right: -1px;
  top: -1px;
  bottom: -1px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-number {
  background-color: #409eff;
  color: white;
  width: 30px;
  height: 100%;
  clip-path: polygon(25% 0%, 100% 0, 100% 100%, 25% 100%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.step-item.completed .step-number {
  background-color: #67c23a;
}
.step-arrow {
  width: 20px;
  height: 2px;
  background-color: #ccc;
  margin: 0 10px;
}
</style>
