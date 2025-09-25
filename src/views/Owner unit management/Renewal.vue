<template>
  <div class="progress-navbar">
    <!-- 错误状态显示 -->
    <div v-if="loading" class="loading-container">
      <el-alert
        title="正在加载合同数据..."
        type="info"
        :closable="false"
        show-icon
      >
        <template slot="default">
          <p>正在尝试获取合同信息，请稍候...</p>
          <el-button
            size="small"
            type="primary"
            :loading="loading"
            @click="retryLoadContract"
          >
            重试 ({{ retryCount }}/{{ maxRetries }})
          </el-button>
        </template>
      </el-alert>
    </div>

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
        :key="'step-' + activeIndex + '-' + (formData.originalContractId || 'new')"
        :form-data="getStepFormData()"
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
import RenewalDispatchStaff from './Renewal Configure maintenance personnel.vue'
import { getContractDetail, renewalContract } from '@/api/contract' // 使用项目详情API

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
      loading: false,
      retryCount: 0,
      maxRetries: 3,
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
  created() {
    // 获取url参数id
    const contractId = this.$route.query.id
    console.log('从路由获取的合同ID:', contractId)
    console.log('当前路由信息:', this.$route)

    if (contractId) {
      this.contractId = contractId
      this.loadContract(contractId)
    } else {
      // 如果没有合同ID，使用空数据演示续签页面
      console.log('使用空数据演示续签页面')
      this.loadDemoData()
    }
  },
  methods: {
    // 加载演示数据
    loadDemoData() {
      console.log('加载演示数据')
      this.loading = false
      this.contractId = 'demo-contract-id'

      // 使用空数据结构，让用户能看到续签页面的样子
      this.formData = {
        // 合同基本信息
        entrustName: '演示委托单位',
        creditCode: '91110000000000000X',
        contractName: '演示合同名称',
        contractNo: 'DEMO-2025-001',
        contractType: '项目维保',
        payCycle: '季',
        buildType: '政府机关',
        maintType: '系统维保',
        maintArea: 1000,
        amount: 50000,
        dateStart: '',
        dateEnd: '',
        remind: 1,
        designOrg: '演示设计单位',
        debugOrg: '演示调试单位',
        recordOrg: '演示验收备案单位',
        remark: '这是一个演示合同，用于展示续签页面的样子',

        // 建筑信息
        buildingList: [{
          name: '演示建筑1',
          area: '500',
          floor: '10',
          height: '30',
          remark: '演示建筑信息'
        }, {
          name: '演示建筑2',
          area: '500',
          floor: '8',
          height: '25',
          remark: '演示建筑信息'
        }],

        // 维保内容
        checkedMaintList: [{
          systemCategory: '火灾自动报警系统',
          deviceName: '火灾报警控制器',
          maintainSlim: '外观检查',
          frequency: '月检',
          maintainContent: '检查控制器外观是否完好'
        }, {
          systemCategory: '自动喷水灭火系统',
          deviceName: '喷头',
          maintainSlim: '功能测试',
          frequency: '季检',
          maintainContent: '测试喷头动作功能'
        }],

        // 项目列表
        projectList: [{
          name: '演示项目',
          ownerName: '演示业主单位',
          address: '演示项目地址',
          area: '演示区域',
          linkman: '演示联系人',
          phone: '13800138000',
          index: 1
        }],

        // 维保人员
        dispatchStaffList: [{
          index: 1,
          ownerName: '演示业主单位',
          projectName: '演示项目',
          techLeader: '演示技术负责人',
          projectLeader: '演示项目负责人',
          onSiteStaff: '演示维保人员1、演示维保人员2',
          maintainPersons: {
            technical: '演示技术负责人',
            leader: '演示项目负责人',
            maintainers: ['演示维保人员1', '演示维保人员2']
          }
        }],

        originalContractId: 'demo-contract-id'
      }

      console.log('演示数据已加载:', this.formData)
      this.$message.info('正在使用演示数据展示续签页面')
    },

    async loadContract(id) {
      this.loading = true
      try {
        console.log('开始加载合同数据，ID:', id)

        if (!id) {
          throw new Error('合同ID不能为空')
        }

        // 使用项目详情API获取合同信息（与项目详情按钮相同的逻辑）
        let res
        try {
          console.log('尝试获取项目合同详情API...')
          res = await getContractDetail(id)
          console.log('项目合同详情API响应:', res)
        } catch (error) {
          console.warn('项目合同详情API调用失败:', error.message)
          // API失败时，直接抛出错误，让错误处理逻辑处理
          throw error
        }

        if (!res) {
          throw new Error('API响应为空')
        }

        if (!res.success) {
          throw new Error(res.message || '获取合同详情失败')
        }

        if (!res.data) {
          throw new Error('合同数据为空')
        }

        console.log('后端返回的合同数据:', res.data)
        console.log('关键字段检查:', {
          designCompany: res.data.designCompany,
          debugCompany: res.data.debugCompany,
          checkCompany: res.data.checkCompany,
          note: res.data.note
        })

        // 安全地获取合同ID
        const originalId = res.data.id || res.data.contractId || id

        // 如果后端返回的数据为空或null，创建一个默认的数据结构
        if (!res.data || Object.keys(res.data).length === 0) {
          console.warn('后端返回的数据为空，使用默认数据结构')
          this.formData = {
            entrustName: '',
            creditCode: '',
            contractName: '',
            contractNo: '',
            contractType: '项目维保',
            payCycle: '',
            buildType: '',
            maintType: '',
            maintArea: '',
            amount: '',
            dateStart: '',
            dateEnd: '',
            remind: 0,
            designOrg: '',
            debugOrg: '',
            recordOrg: '',
            remark: '',
            buildingList: [{ name: '', area: '', floor: '', height: '', remark: '' }],
            checkedMaintList: [],
            projectList: [],
            dispatchStaffList: [],
            originalContractId: originalId
          }
          return
        }

        // 根据后端getContractDetail API的数据结构处理（扁平结构）
        this.formData = {
          // 合同基本信息
          entrustName: res.data.clientCompany || '',
          creditCode: res.data.creditCode || '',
          contractName: res.data.contractName || '',
          contractNo: res.data.contractCode || '',
          contractType: res.data.contractType || '项目维保',
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
          fileUrls: res.data.fileUrls || [],

          // 建筑信息 - 根据后端API返回的buildings数组
          buildingList: this.processBuildingList(res.data.buildings),

          // 维保内容 - 根据后端API返回的maintainItems数组
          checkedMaintList: this.processMaintainItems(res.data.maintainItems),

          // 项目列表 - 根据后端API返回的扁平项目信息
          projectList: [{
            id: res.data.project_id, // 保存项目ID
            name: res.data.projectName || '',
            ownerName: res.data.ownerCompany || '',
            address: res.data.projectAddress || '',
            area: res.data.projectDistrict || '',
            linkman: res.data.contactPerson || '',
            phone: res.data.contactPhone || '',
            index: 1
          }],

          // 维保人员 - 根据后端API返回的扁平维保人员信息
          dispatchStaffList: [{
            index: 1,
            ownerName: res.data.ownerCompany || '',
            projectName: res.data.projectName || '',
            techLeader: res.data.technical?.name || res.data.technical || '',
            projectLeader: res.data.leader?.name || res.data.leader || '',
            onSiteStaff: Array.isArray(res.data.maintainers)
              ? res.data.maintainers.map(m => m.name || m).join('、')
              : '',
            maintainPersons: {
              technical: res.data.technical?.name || res.data.technical || '',
              leader: res.data.leader?.name || res.data.leader || '',
              maintainers: Array.isArray(res.data.maintainers)
                ? res.data.maintainers.map(m => m.name || m)
                : []
            }
          }],

          originalContractId: res.data.contractId // 保存原合同ID用于续签
        }

        console.log('统一的formData已加载:', this.formData)
        console.log('dispatchStaffList数据:', this.formData.dispatchStaffList)
        console.log('原始API响应数据结构:', {
          contractId: res.data.contractId,
          contractName: res.data.contractName,
          projectId: res.data.project_id,
          projectName: res.data.projectName,
          hasBuildings: !!res.data.buildings,
          hasMaintainItems: !!res.data.maintainItems,
          hasMaintainers: !!res.data.maintainers,
          buildingsCount: res.data.buildings?.length || 0,
          maintainItemsCount: res.data.maintainItems?.length || 0,
          maintainersCount: res.data.maintainers?.length || 0
        })
      } catch (e) {
        console.error('加载合同数据失败:', e)

        // 根据错误类型提供不同的处理方案
        if (e.message && e.message.includes('500')) {
          this.$message.error('服务器暂时无法获取合同数据，可能是该合同数据存在问题')

          // 提供手动输入合同信息的选项
          this.$confirm('是否手动输入合同信息进行续签？', '数据获取失败', {
            confirmButtonText: '手动输入',
            cancelButtonText: '返回列表',
            type: 'warning'
          }).then(() => {
            // 使用默认的空数据结构，允许用户手动输入
            this.formData = {
              entrustName: '',
              creditCode: '',
              contractName: '',
              contractNo: '',
              contractType: '项目维保',
              payCycle: '',
              buildType: '',
              maintType: '',
              maintArea: '',
              amount: '',
              dateStart: '',
              dateEnd: '',
              remind: 0,
              designOrg: '',
              debugOrg: '',
              recordOrg: '',
              remark: '',
              buildingList: [{ name: '', area: '', floor: '', height: '', remark: '' }],
              checkedMaintList: [],
              projectList: [],
              dispatchStaffList: [],
              originalContractId: id // 保存原始ID
            }
            this.$message.info('请手动填写合同信息进行续签')
          }).catch(() => {
            this.$router.push({ name: 'UnitProject' })
          })
        } else if (e.message && e.message.includes('404')) {
          this.$message.error('合同不存在或已被删除')
          this.$router.push({ name: 'UnitProject' })
        } else {
          this.$message.error(`加载合同数据失败: ${e.message}`)
          this.$router.push({ name: 'UnitProject' })
        }
      } finally {
        this.loading = false
      }
    },
    // 重试加载合同数据
    async retryLoadContract() {
      if (this.retryCount >= this.maxRetries) {
        this.$message.warning('已达到最大重试次数，请检查网络连接或联系管理员')
        return
      }

      this.retryCount++
      this.loading = true

      try {
        await this.loadContract(this.contractId)
        this.$message.success('数据加载成功')
        this.retryCount = 0 // 重置重试计数
      } catch (error) {
        console.error('重试加载失败:', error)
        this.$message.error(`重试失败 (${this.retryCount}/${this.maxRetries}): ${error.message}`)
      } finally {
        this.loading = false
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
      console.log('dispatchStaffList 当前状态:', this.formData.dispatchStaffList)
    },
    async handleSubmit(personnelData) {
      if (personnelData) {
        this.updateFormData(personnelData)
      }
      await this.$nextTick()

      // 参考 add.vue 的提交逻辑
      const isOneTime = ['施工', '评估', '检测'].includes(this.formData.contractType)

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
        designCompany: this.formData.designOrg,
        debugCompany: this.formData.debugOrg,
        checkCompany: this.formData.recordOrg,
        note: this.formData.remark,
        fileUrls: [], // 假设文件上传逻辑会填充这里

        // 建筑信息
        buildings: this.formData.buildingList || [],

        // 维保项目 (提取ID)
        maintainItems: this.formData.checkedMaintList ? this.formData.checkedMaintList.map(item => item.id).filter(id => id) : [],
        maintainPersons: this.formData.dispatchStaffList && this.formData.dispatchStaffList.length > 0
          ? this.formData.dispatchStaffList[0].maintainPersons
          : {},

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
          }] : []),

        // 续签相关
        originalContractId: this.contractId
      }

      // 验证必填字段
      if (!payload.startDate || !payload.endDate) {
        this.$message.error('请填写合同时间')
        this.activeIndex = 0
        return
      }
      if (!payload.name || !payload.clientCompany) {
        this.$message.error('请补全合同基本信息')
        this.activeIndex = 0
        return
      }

      try {
        console.log('提交续签数据:', payload)
        const res = await renewalContract(payload)
        if (res.success) {
          this.$message.success('续签提交成功')
          this.$router.push({ name: 'UnitProject' })
        } else {
          this.$message.error(res.message || '续签提交失败')
        }
      } catch (e) {
        console.error('续签提交失败:', e)
        this.$message.error('续签提交失败')
      }
    },
    getStepFormData() {
      // 统一把id等关键信息传递下去
      return {
        ...this.formData,
        contractId: this.contractId, // 合同id
        projectIds: (this.formData.projectList || []).map(p => p.id).filter(Boolean)
      }
    },
    // 处理建筑信息列表
    processBuildingList(buildings) {
      console.log('处理建筑信息列表:', buildings)
      
      if (!buildings || !Array.isArray(buildings) || buildings.length === 0) {
        console.log('没有建筑信息，返回默认空行')
        return [{ name: '', area: '', floor: '', height: '', remark: '' }]
      }
      
      const processedBuildings = buildings.map(b => {
        console.log('处理建筑信息:', b)
        return {
          name: b.name || '',
          area: b.area !== undefined && b.area !== null ? b.area : '',
          floor: b.floors !== undefined && b.floors !== null ? b.floors : '',
          height: b.height !== undefined && b.height !== null ? b.height : '',
          remark: b.remark || ''
        }
      })
      
      console.log('处理后的建筑信息:', processedBuildings)
      return processedBuildings
    },
    // 处理维保内容列表
    processMaintainItems(maintainItems) {
      console.log('处理维保内容列表:', maintainItems)
      
      if (!maintainItems || !Array.isArray(maintainItems) || maintainItems.length === 0) {
        console.log('没有维保内容，返回空数组')
        return []
      }
      
      const processedItems = maintainItems.map(item => {
        console.log('处理维保内容:', item)
        return {
          id: item._id || item.id, // 保存ID用于提交
          systemCategory: item.systemCategory || item.system || '',
          deviceName: item.deviceName || item.item || '',
          maintainSlim: item.maintainSlim || item.content || '',
          frequency: item.frequency || item.period || '',
          maintainContent: item.maintainContent || item.standard || ''
        }
      })
      
      console.log('处理后的维保内容:', processedItems)
      return processedItems
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
.loading-container {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.loading-container .el-alert {
  margin-bottom: 0;
}

.loading-container p {
  margin: 8px 0;
  color: #666;
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
