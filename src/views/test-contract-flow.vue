<template>
  <div class="test-page">
    <h1>测试合同创建流程 - 维保人员配置</h1>
    
    <el-card class="test-card">
      <div slot="header">
        <span>步骤1: 合同信息</span>
      </div>
      <el-form :model="contractInfo" label-width="120px">
        <el-form-item label="合同类型">
          <el-select v-model="contractInfo.contractType" placeholder="请选择合同类型">
            <el-option label="项目维保" value="项目维保" />
            <el-option label="施工" value="施工" />
          </el-select>
        </el-form-item>
        <el-form-item label="委托单位">
          <el-input v-model="contractInfo.entrustName" placeholder="委托单位名称" />
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="contractInfo.contractName" placeholder="合同名称" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="test-card">
      <div slot="header">
        <span>步骤2: 项目信息</span>
      </div>
      <el-form :model="projectInfo" label-width="120px">
        <el-form-item label="项目名称">
          <el-input v-model="projectInfo.name" placeholder="项目名称" />
        </el-form-item>
        <el-form-item label="业主单位">
          <el-input v-model="projectInfo.ownerName" placeholder="业主单位" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="test-card">
      <div slot="header">
        <span>步骤3: 维保人员配置</span>
      </div>
      <addnewdispatchStaff 
        ref="dispatchStaff" 
        :formData="formData" 
        @update="onDispatchStaffUpdate"
        @submit="onDispatchStaffSubmit"
      />
    </el-card>

    <el-card class="test-card">
      <div slot="header">
        <span>数据流跟踪</span>
      </div>
      <div>
        <h4>当前formData:</h4>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
        
        <h4>dispatchStaffList:</h4>
        <pre>{{ JSON.stringify(formData.dispatchStaffList, null, 2) }}</pre>
        
        <h4>最终payload:</h4>
        <pre>{{ JSON.stringify(finalPayload, null, 2) }}</pre>
      </div>
    </el-card>

    <el-card class="test-card">
      <div slot="header">
        <span>操作</span>
      </div>
      <el-button type="primary" @click="simulateSubmit">模拟提交</el-button>
      <el-button @click="resetData">重置数据</el-button>
    </el-card>
  </div>
</template>

<script>
import addnewdispatchStaff from '@/views/Owner unit management/addnewdispatchStaff.vue'

export default {
  name: 'TestContractFlow',
  components: {
    addnewdispatchStaff
  },
  data() {
    return {
      contractInfo: {
        contractType: '项目维保',
        entrustName: '测试公司',
        contractName: '测试合同'
      },
      projectInfo: {
        name: '测试项目',
        ownerName: '测试业主'
      },
      formData: {
        contractType: '项目维保',
        entrustName: '测试公司',
        contractName: '测试合同',
        projectList: [
          {
            name: '测试项目',
            ownerName: '测试业主',
            address: '测试地址',
            area: '测试区域'
          }
        ],
        dispatchStaffList: []
      },
      finalPayload: {}
    }
  },
  methods: {
    onDispatchStaffUpdate(data) {
      console.log('onDispatchStaffUpdate:', data)
      this.formData = { ...this.formData, ...data }
    },
    onDispatchStaffSubmit(data) {
      console.log('onDispatchStaffSubmit:', data)
    },
    simulateSubmit() {
      // 模拟add.vue中的submitAll逻辑
      const isOneTime = ['施工', '评估', '检测'].includes(this.formData.contractType)
      
      const payload = {
        name: this.formData.contractName,
        code: 'TEST001',
        clientCompany: this.formData.entrustName,
        creditCode: '123456789',
        contractType: this.formData.contractType,
        amount: 50000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        designCompany: '设计院',
        debugCompany: '调试公司',
        checkCompany: '验收单位',
        note: '测试备注',
        fileUrls: [],
        buildings: [],
        maintainItems: ['消防电源主电源、备用电源工作状态'],
        projectInfo: {
          name: this.formData.projectList[0].name,
          companyname: this.formData.projectList[0].ownerName,
          address: this.formData.projectList[0].address,
          district: this.formData.projectList[0].area,
          position: { lng: 0, lat: 0 },
          ownerCompany: this.formData.projectList[0].ownerName,
          contactPerson: '',
          contactPhone: '',
          logoUrl: '',
          entranceReportUrl: ''
        },
        maintainPersons: this.formData.dispatchStaffList && this.formData.dispatchStaffList.length > 0
          ? (() => {
              const staffItem = this.formData.dispatchStaffList.find(item => item.maintainPersons);
              if (staffItem && staffItem.maintainPersons) {
                console.log('找到维保人员数据:', staffItem.maintainPersons);
                return staffItem.maintainPersons;
              }
              console.log('未找到维保人员数据，检查dispatchStaffList:', this.formData.dispatchStaffList);
              return null;
            })()
          : null
      }

      if (!isOneTime) {
        payload.payCycle = '月'
        payload.warrantyType = '人员密集场所'
        payload.warrantyMethod = '系统维保'
        payload.warrantyArea = 1000
        payload.autoNotice = 1
      }

      this.finalPayload = payload
      console.log('模拟提交的payload:', payload)
      
      if (payload.maintainPersons) {
        console.log('✅ 维保人员数据正确提取')
        console.log('- technical:', payload.maintainPersons.technical)
        console.log('- leader:', payload.maintainPersons.leader)
        console.log('- maintainers:', payload.maintainPersons.maintainers)
      } else {
        console.log('❌ 维保人员数据提取失败')
      }
    },
    resetData() {
      this.formData = {
        contractType: '项目维保',
        entrustName: '测试公司',
        contractName: '测试合同',
        projectList: [
          {
            name: '测试项目',
            ownerName: '测试业主',
            address: '测试地址',
            area: '测试区域'
          }
        ],
        dispatchStaffList: []
      }
      this.finalPayload = {}
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
pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}
</style> 