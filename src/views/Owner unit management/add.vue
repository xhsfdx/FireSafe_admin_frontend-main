<template>
  <div class="add-page-container">
    <el-card class="box-card">
      <!-- Custom Steps -->
      <div class="custom-steps">
        <div class="step-item" :class="{ 'active': activeStep === 0, 'completed': activeStep > 0 }">
          <div class="icon-container">
            <i class="el-icon-document" />
          </div>
          <span>新增合同信息</span>
          <div class="step-number-container">
            <div class="step-number">1</div>
          </div>
        </div>
        <div class="step-arrow" />
        <div class="step-item" :class="{ 'active': activeStep === 1, 'completed': activeStep > 1 }">
          <div class="icon-container">
            <i class="el-icon-folder-opened" />
          </div>
          <span>新增项目信息</span>
          <div class="step-number-container">
            <div class="step-number">2</div>
          </div>
        </div>
        <div class="step-arrow" />
        <div class="step-item" :class="{ 'active': activeStep === 2 }">
          <div class="icon-container">
            <i class="el-icon-user" />
          </div>
          <span>配置维保人员</span>
          <div class="step-number-container">
            <div class="step-number">3</div>
          </div>
        </div>
      </div>

      <div class="step-content">
        <AddNewContractInformation v-show="activeStep === 0" :data="formData" @next="handleNext"
          @update="updateFormData" />
        <AddNewProjectInformation v-show="activeStep === 1" :form-data="formData" @next="handleNext" @prev="handlePrev"
          @update="updateFormData" />
        <AddNewDispatchStaff v-show="activeStep === 2" :form-data="formData" @prev="handlePrev" @submit="submitAll"
          @update="updateFormData" />
      </div>
    </el-card>
  </div>
</template>

<script>
import AddNewContractInformation from './add new contract information.vue'
import AddNewProjectInformation from './add new project information.vue'
import AddNewDispatchStaff from './addnewdispatchStaff.vue'
import { createContract } from '@/api/contract'

export default {
  name: 'AddContractPage',
  components: {
    AddNewContractInformation,
    AddNewProjectInformation,
    AddNewDispatchStaff
  },
  data() {
    return {
      activeStep: 0,
      formData: {}
    }
  },
  methods: {
    handleNext() {
      console.log('handleNext called, current activeStep:', this.activeStep)
      if (this.activeStep < 2) {
        this.activeStep++
        console.log('activeStep increased to:', this.activeStep)
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
      try {
        console.log('Final data to be submitted:', this.formData)

        const isOneTime = ['施工', '评估', '检测'].includes(this.formData.contractType);
        const payload = {
          // 合同信息
          name: this.formData.contractName,
          code: this.formData.contractNo,
          clientCompany: this.formData.entrustName,
          creditCode: this.formData.creditCode,
          payCycle: isOneTime ? undefined : this.formData.payCycle,
          warrantyType: isOneTime ? undefined : this.formData.buildType,
          warrantyMethod: isOneTime ? undefined : this.formData.maintType,
          warrantyArea: this.formData.maintArea,
          amount: this.formData.amount,
          startDate: this.formData.dateStart,
          endDate: this.formData.dateEnd,
          autoNotice: this.formData.remind,
          designOrg: this.formData.designOrg,
          debugOrg: this.formData.debugOrg,
          recordOrg: this.formData.recordOrg,
          note: this.formData.remark,
          fileUrls: this.formData.fileUrls, // 假设文件上传逻辑会填充这里

          // 建筑信息
          buildings: this.formData.buildingList,

          // 维保项目 (提取ID)
          maintainItems: this.formData.checkedMaintList ? this.formData.checkedMaintList.map(item => item.id).filter(id => id) : [],
          maintainPersons: this.formData.dispatchStaffList ? this.formData.dispatchStaffList.map(item => item.maintainPersons).filter(p => p)[0] : [],
          // 项目信息 (取第一个项目作为主项目)
          projects: this.formData.projectList && this.formData.projectList.length > 0
            ? this.formData.projectList.map(item => ({
              name: item.name,
              companyname: item.ownerName,
              address: item.address,
              district: item.area,
              position: '', // 可根据需要设置
              ownerCompany: item.ownerName,
              contactPerson: item.linkman,
              contactPhone: item.phone,
              logoUrl: '',
              entranceReportUrl: ''
            }))
            : (isOneTime ? [{
              name: this.formData.contractName || '一次性合同项目',
              companyname: this.formData.entrustName,
              address: '',
              district: '',
              position: '',
              ownerCompany: this.formData.entrustName,
              contactPerson: '',
              contactPhone: '',
              logoUrl: '',
              entranceReportUrl: ''
            }] : [])
          }

        console.log('Payload sent to backend:', payload)
        
        const res = await createContract(payload) // 使用转换后的 payload
        if(res.success) {
            this.$message.success('新增合同成功！')
          this.$router.push({ name: 'UnitProject' }) // Redirect to the list page
  } else {
    this.$message.error(res.message || '提交失败，请检查填写内容')
  }
} catch (err) {
  this.$message.error('请求失败，请稍后重试')
}
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