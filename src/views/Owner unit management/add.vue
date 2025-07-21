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
        <AddNewContractInformation
          ref="addNewContractInformation"
          v-show="activeStep === 0"
          :data="formData"
          @next="handleNext"
          @update="updateFormData"
        />
        <AddNewProjectInformation
          ref="addNewProjectInformation"
          v-show="activeStep === 1"
          :form-data="formData"
          @next="handleNext"
          @prev="handlePrev"
          @update="updateFormData"
        />
        <AddNewDispatchStaff
          ref="addNewDispatchStaff"
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
      console.log('updateFormData 被调用，接收到的数据:', data)
      console.log('更新前的 formData:', this.formData)
      this.formData = { ...this.formData, ...data }
      console.log('更新后的 formData:', this.formData)
    },
    resetForm() {
      // 重置表单数据
      this.formData = {}
      this.activeStep = 0
      
      // 重置子组件的表单
      this.$nextTick(() => {
        // 重置合同信息组件
        if (this.$refs.addNewContractInformation) {
          this.$refs.addNewContractInformation.$refs.form.resetFields()
        }
        // 重置项目信息组件
        if (this.$refs.addNewProjectInformation) {
          this.$refs.addNewProjectInformation.projectList = []
        }
        // 重置维保人员组件
        if (this.$refs.addNewDispatchStaff) {
          this.$refs.addNewDispatchStaff.tableData = []
        }
      })
      
      this.$message.success('表单已重置，可以继续创建新合同')
    },
    async submitAll() {
      try {
        console.log('Final data to be submitted:', this.formData)
        console.log('dispatchStaffList:', this.formData.dispatchStaffList)
        console.log('dispatchStaffList 详细结构:', JSON.stringify(this.formData.dispatchStaffList, null, 2))

        const isOneTime = ['施工', '评估', '检测'].includes(this.formData.contractType)
        const payload = {
          // 合同信息
          name: this.formData.contractName,
          code: this.formData.contractNo,
          clientCompany: this.formData.entrustName,
          creditCode: this.formData.creditCode,
          contractType: this.formData.contractType,
          amount: this.formData.amount,
          startDate: this.formData.dateStart,
          endDate: this.formData.dateEnd,
          designCompany: this.formData.designOrg,
          debugCompany: this.formData.debugOrg,
          checkCompany: this.formData.recordOrg,
          note: this.formData.remark,
          fileUrls: [], // 假设文件上传逻辑会填充这里

          // 建筑信息 - 修复字段名匹配
          buildings: this.formData.buildingList && this.formData.buildingList.length > 0 
            ? this.formData.buildingList.map(b => ({
                name: b.name || '',
                area: b.area || 0,
                floors: b.floor || 0, // 修复：使用floor而不是floors
                height: b.height || 0,
                remark: b.remark || ''
              }))
            : [],

          // 维保项目 - 修复数据格式，提取content字段
          maintainItems: this.formData.checkedMaintList && this.formData.checkedMaintList.length > 0
            ? this.formData.checkedMaintList.map(item => {
                // 如果是对象且有content字段，返回content；如果是字符串，直接返回
                if (typeof item === 'object' && item.content) {
                  return item.content;
                } else if (typeof item === 'string') {
                  return item;
                }
                return '';
              }).filter(item => item && item.length > 0)
            : [],

          // 项目信息 - 直接传递项目数据，让后端创建Project记录
          projectInfo: this.formData.projectList && this.formData.projectList.length > 0
            ? {
              name: this.formData.projectList[0].name,
              companyname: this.formData.projectList[0].ownerName,
              address: this.formData.projectList[0].address,
              district: this.formData.projectList[0].area,
              position: { lng: 0, lat: 0 }, // 默认位置
              ownerCompany: this.formData.projectList[0].ownerName,
              contactPerson: this.formData.projectList[0].linkman,
              contactPhone: this.formData.projectList[0].phone,
              logoUrl: '',
              entranceReportUrl: ''
            }
            : (isOneTime ? {
              name: this.formData.contractName || '一次性合同项目',
              companyname: this.formData.entrustName,
              address: '',
              district: '',
              position: { lng: 0, lat: 0 },
              ownerCompany: this.formData.entrustName,
              contactPerson: '',
              contactPhone: '',
              logoUrl: '',
              entranceReportUrl: ''
            } : null),

          // 维保人员 - 修复数据格式
          maintainPersons: this.formData.dispatchStaffList && this.formData.dispatchStaffList.length > 0
            ? (() => {
                console.log('=== 维保人员数据处理开始 ===');
                console.log('dispatchStaffList:', this.formData.dispatchStaffList);
                
                // 查找有完整maintainPersons数据的项目（技术负责人和项目负责人是必须的，现场维保人员可选）
                const staffItem = this.formData.dispatchStaffList.find(item => 
                  item.maintainPersons && 
                  item.maintainPersons.technical && 
                  item.maintainPersons.leader
                );
                
                if (staffItem && staffItem.maintainPersons) {
                  console.log('=== 找到维保人员数据 ===');
                  console.log('staffItem:', staffItem);
                  console.log('staffItem.maintainPersons:', staffItem.maintainPersons);
                  console.log('technical:', staffItem.maintainPersons.technical);
                  console.log('leader:', staffItem.maintainPersons.leader);
                  console.log('maintainers:', staffItem.maintainPersons.maintainers);
                  console.log('maintainers长度:', staffItem.maintainPersons.maintainers ? staffItem.maintainPersons.maintainers.length : 0);
                  
                  // 确保数据格式正确
                  const maintainPersons = {
                    technical: staffItem.maintainPersons.technical || null,
                    leader: staffItem.maintainPersons.leader || null,
                    maintainers: Array.isArray(staffItem.maintainPersons.maintainers) 
                      ? staffItem.maintainPersons.maintainers.filter(id => id && typeof id === 'string')
                      : []
                  };
                  console.log('处理后的维保人员数据:', maintainPersons);
                  console.log('处理后的maintainers长度:', maintainPersons.maintainers.length);
                  return maintainPersons;
                }
                
                // 如果没有找到完整的配置，尝试查找任何有maintainPersons的项目
                const anyStaffItem = this.formData.dispatchStaffList.find(item => item.maintainPersons);
                if (anyStaffItem && anyStaffItem.maintainPersons) {
                  console.log('=== 找到部分维保人员数据 ===');
                  console.log('anyStaffItem:', anyStaffItem);
                  console.log('anyStaffItem.maintainPersons:', anyStaffItem.maintainPersons);
                  
                  const maintainPersons = {
                    technical: anyStaffItem.maintainPersons.technical || null,
                    leader: anyStaffItem.maintainPersons.leader || null,
                    maintainers: Array.isArray(anyStaffItem.maintainPersons.maintainers) 
                      ? anyStaffItem.maintainPersons.maintainers.filter(id => id && typeof id === 'string')
                      : []
                  };
                  console.log('处理后的维保人员数据（部分）:', maintainPersons);
                  console.log('警告：现场维保人员可能未配置');
                  return maintainPersons;
                }
                
                console.log('未找到任何维保人员数据，检查dispatchStaffList:', this.formData.dispatchStaffList);
                return null;
              })()
            : null
        }

        // 只有项目维保合同才添加维保相关字段
        if (!isOneTime) {
          payload.payCycle = this.formData.payCycle
          payload.warrantyType = this.formData.buildType
          // 确保maintType有有效值，默认为'系统维保'
          payload.warrantyMethod = this.formData.maintType && this.formData.maintType.trim() !== '' 
            ? this.formData.maintType 
            : '系统维保'
          payload.warrantyArea = this.formData.maintArea
          payload.autoNotice = this.formData.remind
        }

        console.log('Payload sent to backend:', payload)

        const res = await createContract(payload) // 使用转换后的 payload
        if (res.success) {
          this.$message.success('新增合同成功！')
          
          // 提供多种返回选项
          this.$confirm('合同创建成功！请选择下一步操作', '提示', {
            confirmButtonText: '返回详情',
            cancelButtonText: '继续创建',
            distinguishCancelAndClose: true,
            type: 'success'
          }).then(() => {
            // 用户选择返回详情页面，并传递新创建的合同ID
            if (res.contract && res.contract._id) {
              this.$router.push({
                name: 'UnitDetail',
                query: { 
                  id: res.contract._id,
                  fromNewContract: 'true'
                }
              })
            } else {
              // 如果没有返回合同ID，则返回列表页面
              this.$router.push({ name: 'UnitProjectManagement' })
            }
          }).catch((action) => {
            if (action === 'cancel') {
              // 用户选择继续创建，重置表单
              this.resetForm()
            }
            // 如果用户点击关闭按钮，不做任何操作
          })
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
