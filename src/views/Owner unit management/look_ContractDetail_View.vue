<template>
  <div class="add-page-container">
    <el-card class="box-card">
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
          :data="formData"
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
      this.loading = true
      try {
        const res = await fetchProjectDetail(id)
        if (res.success && res.data) {
          const item = res.data
          // 适配合同信息
          const formData = {
            entrustName: item.clientCompany || '',
            contractName: item.name || '',
            contractNo: item.code || '',
            payCycle: item.payCycle || '',
            buildType: item.warrantyType || '',
            maintType: item.warrantyMethod || '',
            maintArea: item.warrantyArea || '',
            amount: item.amount || '',
            dateStart: item.startDate || '',
            dateEnd: item.endDate || '',
            remind: item.autoNotice ? 1 : 0,
            designOrg: item.designCompany || '',
            debugOrg: item.debugCompany || '',
            recordOrg: item.checkCompany || '',
            remark: item.note || '',
            buildingList: (item.buildings || []).map(b => ({
              name: b.name,
              area: b.area,
              floor: b.floors || b.floor,
              height: b.height,
              remark: b.remark || ''
            })),
            checkedMaintList: item.maintainItems || [],
            // 项目信息
            projectList: item.project ? [{
              ownerName: item.project.ownerCompany || '',
              name: item.project.name || '',
              address: item.project.address || '',
              area: item.project.district || '',
              linkman: item.project.contactPerson || '',
              phone: item.project.contactPhone || ''
            }] : [],
            // 维保人员
            dispatchStaffList: item.maintainPersons || []
          }
          this.formData = formData
        } else {
          this.$message.error(res.message || '获取合同详情失败')
        }
      } catch (err) {
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
      this.$message.success('编辑完成！')
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