// ContractDetailView.vue
// This is the new "Edit" parent component
<template>
  <div class="add-page-container">
    <el-card v-loading="loading" class="box-card">
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
        <EditContractInfoView
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
        <AddNewDispatchStaff
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
// Import the new EDIT component for Step 1
import EditContractInfoView from './EditContractInfoView.vue' 
// Re-use your existing components for Steps 2 and 3
import LookProjectInfoView from './look_ProjectInfo_View.vue' 
import AddNewDispatchStaff from './addnewdispatchStaff.vue' 
// Import your API functions, including a new 'updateContract'
import { fetchProjectDetail, updateContract } from '@/api/contract' 

export default {
  name: 'ContractDetailView', // This matches your router
  components: {
    EditContractInfoView, // Use the new component
    LookProjectInfoView,
    AddNewDispatchStaff // Assuming component name is 'AddNewDispatchStaff'
  },
  data() {
    return {
      activeStep: 0,
      formData: {}, // This will hold the state for all steps
      loading: false,
      contractId: null
    }
  },
  created() {
    this.contractId = this.$route.query.id
    if (this.contractId) {
      this.loadContractDetails()
    } else {
      this.$message.error('未找到合同ID')
      this.$router.back()
    }
  },
  methods: {
    // loadContractDetails is identical to your LookContractDetailView
    async loadContractDetails() {
      this.loading = true
      try {
        const res = await fetchProjectDetail(this.contractId)
        if (res.success && res.data) {
          const item = res.data
          // (Data mapping logic is identical to your 'Look' component)
          this.formData = {
            // ... (all your fields: clientCompany, name, code, etc.)
            clientCompany: item.clientCompany || '',
            name: item.contractName || '',
            contractId: item.contractId || '',
            code: item.contractCode || '',
            payCycle: item.payCycle || '',
            warrantyType: item.warrantyType || '',
            warrantyMethod: item.warrantyMethod || '',
            warrantyArea: item.warrantyArea || '',
            amount: item.amount || '',
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            autoNotice: item.autoNotice || false,
            designCompany: item.designCompany || '',
            debugCompany: item.debugCompany || '',
            checkCompany: item.checkCompany || '',
            note: item.note || '',
            creditCode: item.creditCode || '',
            fileUrls: item.fileUrls || [],
            buildingList: (item.buildings || []).map(b => ({
              name: b.name,
              area: b.area,
              floor: b.floors || b.floor,
              height: b.height,
              remark: b.remark || ''
            })),
            checkedMaintList: item.maintainItems || [],
            projectList: [{
              ownerName: item.ownerCompany || '',
              name: item.projectName || '',
              address: item.projectAddress || '',
              area: item.projectDistrict || '',
              linkman: item.contactPerson || '',
              phone: item.contactPhone || '',
              leader: item?.leader.name || '',
              technical: item?.technical.name || '',
              maintainers: item?.maintainers || '',
              maintainPersons: { technical: item.technical || null,
              leader: item.leader || null,
              maintainers: item.maintainers.map(item => item.id) || [] }
            }],
            dispatchStaffList: []
          }
        } else {
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
    // This method is called by children to update the central formData
    updateFormData(data) {
      this.formData = { ...this.formData, ...data }
      console.log('Parent formData updated:', this.formData)
    },
    // This is the new "Update" logic
    async submitAll() {
      this.loading = true
      try {
        // You may need to format this.formData before sending
        const payload = { ...this.formData }
        console.log('Sending update payload:', payload)
        // Assume you have an 'updateContract' API function
        const res = await updateContract(this.formData.contractId, payload)

        if (res.success) {
          this.$message.success('合同更新成功！')
          this.$router.back()
        } else {
          this.$message.error(res.message || '更新失败')
        }
      } catch (err) {
        console.error('提交更新失败:', err)
        this.$message.error('网络请求失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* (All styles from LookContractDetailView.vue) */
.add-page-container {
  padding: 18px;
  background-color: #f0f2f5;
}
.box-card {
  border-radius: 10px;
}
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