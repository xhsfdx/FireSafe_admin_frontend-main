<template>
  <div class="test-page">
    <h1>维保人员数据流测试</h1>
    
    <el-card class="test-card">
      <div slot="header">
        <span>测试步骤</span>
      </div>
      <div>
        <h4>1. 检查后端员工数据</h4>
        <el-button @click="checkStaffData">检查员工数据</el-button>
        <div v-if="staffData.length > 0" class="data-display">
          <h5>员工数据 ({{ staffData.length }}人):</h5>
          <ul>
            <li v-for="staff in staffData.slice(0, 3)" :key="staff._id">
              {{ staff.name }} - {{ staff.qualificationLevel }} (ID: {{ staff._id }})
            </li>
          </ul>
        </div>
      </div>
    </el-card>

    <el-card class="test-card">
      <div slot="header">
        <span>2. 测试维保人员配置</span>
      </div>
      <div>
        <h4>配置维保人员</h4>
        <DispatchStaff 
          ref="dispatchStaff" 
          :data="testData" 
          @submit="onStaffSubmit"
        />
        <div v-if="selectedStaff" class="data-display">
          <h5>选中的维保人员:</h5>
          <pre>{{ JSON.stringify(selectedStaff, null, 2) }}</pre>
        </div>
      </div>
    </el-card>

    <el-card class="test-card">
      <div slot="header">
        <span>3. 测试合同创建</span>
      </div>
      <div>
        <h4>模拟合同创建</h4>
        <el-button @click="simulateContractCreation" :disabled="!selectedStaff">模拟创建合同</el-button>
        <div v-if="contractPayload" class="data-display">
          <h5>发送给后端的payload:</h5>
          <pre>{{ JSON.stringify(contractPayload, null, 2) }}</pre>
        </div>
      </div>
    </el-card>

    <el-card class="test-card">
      <div slot="header">
        <span>4. 检查数据库中的合同</span>
      </div>
      <div>
        <h4>检查保存的合同</h4>
        <el-button @click="checkSavedContracts">检查数据库中的合同</el-button>
        <div v-if="savedContracts.length > 0" class="data-display">
          <h5>数据库中的合同:</h5>
          <div v-for="contract in savedContracts" :key="contract._id" class="contract-item">
            <h6>{{ contract.name }}</h6>
            <p>维保人员数据: {{ JSON.stringify(contract.maintainPersons) }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import DispatchStaff from '@/views/Maintenance and Service Management/DispatchStaff.vue'
import { getStaffList, createContract } from '@/api/staff'

export default {
  name: 'TestMaintenanceFlow',
  components: {
    DispatchStaff
  },
  data() {
    return {
      staffData: [],
      selectedStaff: null,
      contractPayload: null,
      savedContracts: [],
      testData: {}
    }
  },
  mounted() {
    this.checkStaffData()
  },
  methods: {
    async checkStaffData() {
      try {
        const response = await getStaffList()
        if (response.success && response.data) {
          this.staffData = response.data
          console.log('员工数据:', this.staffData)
        }
      } catch (error) {
        console.error('获取员工数据失败:', error)
      }
    },
    
    onStaffSubmit(data) {
      console.log('维保人员配置提交:', data)
      this.selectedStaff = data.maintainPersons
    },
    
    simulateContractCreation() {
      if (!this.selectedStaff) {
        this.$message.error('请先配置维保人员')
        return
      }
      
      const payload = {
        name: '测试维保合同',
        code: 'TEST006',
        clientCompany: '测试公司',
        creditCode: '123456789',
        contractType: '项目维保',
        payCycle: '月',
        warrantyType: '人员密集场所',
        warrantyMethod: '系统维保',
        warrantyArea: 1000,
        amount: 50000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        autoNotice: 1,
        designCompany: '设计院',
        debugCompany: '调试公司',
        checkCompany: '验收单位',
        note: '测试备注',
        fileUrls: [],
        buildings: [{
          name: '测试建筑',
          area: 1000,
          floors: 5,
          height: 20,
          remark: '测试备注'
        }],
        maintainItems: ['消防电源主电源、备用电源工作状态'],
        projectInfo: {
          name: '测试维保项目',
          companyname: '测试业主',
          address: '测试地址',
          district: '测试区域',
          position: { lng: 0, lat: 0 },
          ownerCompany: '测试业主',
          contactPerson: '联系人',
          contactPhone: '13800138000',
          logoUrl: '',
          entranceReportUrl: ''
        },
        maintainPersons: this.selectedStaff
      }
      
      this.contractPayload = payload
      console.log('模拟合同创建payload:', payload)
      
      // 实际创建合同
      this.createContract(payload)
    },
    
    async createContract(payload) {
      try {
        const response = await createContract(payload)
        if (response.success) {
          this.$message.success('合同创建成功！')
          console.log('创建的合同:', response.contract)
        } else {
          this.$message.error(response.message || '合同创建失败')
        }
      } catch (error) {
        console.error('合同创建失败:', error)
        this.$message.error('合同创建失败')
      }
    },
    
    async checkSavedContracts() {
      try {
        // 这里应该调用获取合同列表的API
        // 暂时使用模拟数据
        this.savedContracts = [
          {
            _id: 'test1',
            name: '测试合同1',
            maintainPersons: {
              technical: 'technical_id_1',
              leader: 'leader_id_1',
              maintainers: ['maintainer_id_1']
            }
          }
        ]
      } catch (error) {
        console.error('获取合同列表失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.test-page {
  padding: 20px;
}
.test-card {
  margin-bottom: 20px;
}
.data-display {
  margin-top: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}
.data-display pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}
.contract-item {
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}
</style> 