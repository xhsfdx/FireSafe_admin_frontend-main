<!-- 续签合同信息 -->
<template>
  <div class="contract-info-root">
    <div class="title-bar">续签合同</div>
    <div class="form-card">
      <!-- 合同信息 -->
      <div class="section-title">合同信息</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="112px" class="double-form-row">
        <el-row :gutter="48">
          <!-- 左栏 -->
          <el-col :span="12">
            <el-form-item label="委托单位名称" prop="entrustName" required>
              <el-input v-model="form.entrustName" placeholder="请输入委托单位名称" />
            </el-form-item>
            <el-form-item label="合同时间" required>
              <el-date-picker v-model="form.dateStart" type="date" placeholder="开始日期" style="width: 140px" />
              <span class="date-sep">-</span>
              <el-date-picker v-model="form.dateEnd" type="date" placeholder="结束日期" style="width: 140px" />
            </el-form-item>
            <el-form-item label="合同名称">
              <el-input v-model="form.contractName" placeholder="请输入合同名称" />
            </el-form-item>
            <el-form-item label="合同编号">
              <el-input v-model="form.contractNo" placeholder="请输入合同编号" />
            </el-form-item>
            <el-form-item label="付款周期">
              <el-select v-model="form.payCycle" placeholder="请选择付款周期" style="width: 100%">
                <el-option label="月" value="月" />
                <el-option label="季" value="季" />
                <el-option label="半年" value="半年" />
                <el-option label="年" value="年" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保建筑类型">
              <el-select v-model="form.buildType" placeholder="请选择维保建筑类型" style="width: 100%">
                <el-option label="高层" value="高层" />
                <el-option label="地下" value="地下" />
                <el-option label="人员密集场所" value="人员密集场所" />
                <el-option label="易燃易爆场所" value="易燃易爆场所" />
                <el-option label="居民住宅" value="居民住宅" />
                <el-option label="商住一体" value="商住一体" />
                <el-option label="文物古建筑" value="文物古建筑" />
                <el-option label="医院" value="医院" />
                <el-option label="学校" value="学校" />
                <el-option label="政府机关" value="政府机关" />
                <el-option label="酒店宾馆" value="酒店宾馆" />
                <el-option label="加油站" value="加油站" />
                <el-option label="停车场" value="停车场" />
                <el-option label="厂房仓库" value="厂房仓库" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
            <el-form-item label="设计单位">
              <el-input v-model="form.designOrg" placeholder="请输入设计单位" />
            </el-form-item>
            <el-form-item label="备注说明">
              <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 3 }"
                placeholder="请输入备注说明" />
            </el-form-item>
          </el-col>
          <!-- 右栏 -->
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="creditCode" required>
              <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>
            <el-form-item label="维保方式" prop="maintType" required>
              <el-select v-model="form.maintType" placeholder="请选择维保方式" style="width: 100%">
                <el-option label="系统维保" value="系统维保" />
                <el-option label="点位维保" value="点位维保" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保面积">
              <el-input-number v-model="form.maintArea" :min="0" style="width: 130px" />
              <span class="unit-text">㎡</span>
            </el-form-item>
            <el-form-item label="合同金额">
              <el-input-number v-model="form.amount" :min="0" style="width: 130px" />
              <span class="unit-text">元</span>
            </el-form-item>
            <el-form-item label="收款提醒">
              <el-radio-group v-model="form.remind">
                <el-radio :label="1">开通</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
              <span class="remind-tip">(默认为收款提醒消息推送至维保项目负责人)</span>
            </el-form-item>
            <el-form-item label="调试单位">
              <el-input v-model="form.debugOrg" placeholder="请输入调试单位" />
            </el-form-item>
            <el-form-item label="验收备案">
              <el-input v-model="form.recordOrg" placeholder="请输入验收备案单位全称" />
            </el-form-item>
            <el-form-item label="合同文件">
              <el-upload action="#" :show-file-list="false" style="display:inline-block">
                <el-button size="mini">+ 上传合同文件</el-button>
              </el-upload>
              <span class="upload-tips">上传支持: DOCX、PDF、PNG、JPG等格式文件</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 建筑信息 -->
      <div class="section-title" style="margin-top:32px;">
        <span style="color:#f56c6c;">*</span> 建筑信息
        <span class="tip">(注：建筑物面积请填写纯数字，例如:0.00)</span>
      </div>
      <el-table :data="buildingList" border style="width: 100%; margin-bottom: 12px;" class="building-table">
        <el-table-column prop="name" label="* 建筑信息" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入建筑名称" />
          </template>
        </el-table-column>
        <el-table-column prop="area" label="* 建筑面积(m²)" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.area" placeholder="请输入建筑面积" />
          </template>
        </el-table-column>
        <el-table-column prop="floor" label="* 建筑层数" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.floor" placeholder="请输入建筑层数" />
          </template>
        </el-table-column>
        <el-table-column prop="height" label="* 建筑高度(m)" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.height" placeholder="请输入建筑高度" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入备注" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button v-if="buildingList.length > 1" type="text" style="color:#f56c6c"
              @click="removeRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: left; margin-bottom: 18px;">
        <el-button type="text" style="font-size: 16px; color: #409EFF;" @click="addRow">
          <i class="el-icon-plus" /> 新增内容
        </el-button>
      </div>

      <!-- 合同维保内容 -->
      <div class="section-title" style="margin-top:28px;">
        合同维保内容
      </div>
      <el-row :gutter="14">
        <!-- 左侧树形列表 + 全选 -->
        <el-col :span="6">
          <div style="margin-bottom:12px;">
            <el-checkbox v-model="treeCheckAll" @change="handleCheckAll" style="margin-left:2px;">一键全选</el-checkbox>
          </div>
          <el-tabs v-model="activeTab" class="tab-tree">
            <el-tab-pane label="平台标准系统" name="standard">
              <el-tree ref="maintTree" :data="maintTree" show-checkbox node-key="id" :default-checked-keys="checkedKeys"
                :expand-on-click-node="false" @check="handleTreeCheck" />
            </el-tab-pane>
            <el-tab-pane label="自建标准系统" name="custom">
              <div class="tab-empty">暂无内容</div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- 右侧表格展示 -->
        <el-col :span="18">
          <el-table :data="checkedMaintList" border style="width:100%;">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="system" label="消防系统/设施" align="center" />
            <el-table-column prop="item" label="维保项目" align="center" />
            <el-table-column prop="content" label="检测内容" align="center" />
            <el-table-column prop="period" label="维保周期" align="center" />
            <el-table-column prop="standard" label="规范" align="center" />
          </el-table>
          <div v-if="checkedMaintList.length === 0" class="empty-box">
            <img :src="require('@/assets/无数据.jpg')" style="width:128px;opacity:0.7;margin-top:20px;">
            <div style="color:#888;margin-top:8px;">暂无数据</div>
          </div>
        </el-col>
      </el-row>

      <!-- 下一步 -->
      <div style="text-align: center; margin: 38px 0 12px 0;">
        <el-button type="primary" size="large" style="width: 160px;font-size:18px;" @click="nextStep">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RenewalContractInfo',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    contractId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        entrustName: '', dateStart: '', dateEnd: '', contractName: '', contractNo: '',
        payCycle: '', buildType: '', creditCode: '', maintType: '', maintArea: '',
        amount: '', remind: 0, designOrg: '', remark: '', debugOrg: '', recordOrg: ''
      },
      rules: {
        entrustName: [{ required: true, message: '请输入委托单位名称', trigger: 'blur' }],
        creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
        maintType: [{ required: true, message: '请选择维保方式', trigger: 'change' }]
      },
      buildingList: [{ name: '', area: '', floor: '', height: '', remark: '' }],
      activeTab: 'standard',
      maintTree: [],
      checkedKeys: [],
      checkedMaintList: [],
      treeCheckAll: false
    }
  },
  watch: {
    formData: {
      handler(newData) {
        if (!newData || !Object.keys(newData).length) return

        console.log('合同信息页接收数据:', newData)

        this.form = {
          ...this.form,
          entrustName: newData.entrustName || '',
          creditCode: newData.creditCode || '',
          contractName: newData.contractName || '',
          contractNo: newData.contractNo || '',
          payCycle: newData.payCycle || '',
          buildType: newData.buildType || '',
          maintType: newData.maintType || '',
          maintArea: newData.maintArea || '',
          amount: newData.amount || '',
          dateStart: newData.dateStart || '',
          dateEnd: newData.dateEnd || '',
          remind: newData.remind !== undefined ? newData.remind : 0,
          designOrg: newData.designOrg || '',
          debugOrg: newData.debugOrg || '',
          recordOrg: newData.recordOrg || '',
          remark: newData.remark || ''
        }

        if (newData.buildingList && newData.buildingList.length > 0) {
          this.buildingList = JSON.parse(JSON.stringify(newData.buildingList))
        }
        
        this.checkedMaintList = newData.checkedMaintList || []
        this.$nextTick(() => {
          this.updateCheckedKeysFromList()
        })
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    await this.loadMaintainTree()
    this.updateCheckedKeysFromList()
    if (this.contractId) {
      this.fetchContractDetail(this.contractId)
    }
  },
  methods: {
    updateCheckedKeysFromList() {
      if (!this.maintTree.length || !this.checkedMaintList.length) {
        this.checkedKeys = []
        return
      }

      const leafNodes = this.getAllLeafNodes(this.maintTree)
      const listKeys = new Set(this.checkedMaintList.map(item => item.content))
      
      this.checkedKeys = leafNodes
        .filter(node => listKeys.has(node.label))
        .map(node => node.id)

      if (this.$refs.maintTree) {
        this.$refs.maintTree.setCheckedKeys(this.checkedKeys)
      }
    },
    transformToTree(data) {
      // period: 1 => '月检'
      const getPeriodLabel = (p) => {
        if (!p) return ''
        if (p == 1) return '月检'
        if (p == 12) return '年检'
        return `每${p}月`
      }
      return data.map(system => ({
        id: system.id,
        label: system.name,
        children: (system.children || []).map(project => ({
          id: project.id,
          label: project.projectName,
          children: (project.children || []).map(item => ({
            id: item.id,
            label: item.content,
            data: {
              system: system.name,
              item: project.projectName,
              content: item.content,
              period: getPeriodLabel(item.period),
              standard: item.attention || '',
            }
          }))
        }))
      }))
    },
    async loadMaintainTree() {
      try {
        const res = await fetch('/maintainTree.json')
        const rawData = await res.json()
        this.maintTree = this.transformToTree(rawData)
        this.updateCheckedKeysFromList()
      } catch (err) {
        this.$message.error('加载维保项目失败')
      }
    },
    handleTreeCheck(checkedNode, { checkedNodes, halfCheckedNodes }) {
      this.checkedKeys = checkedNodes
        .filter(n => !n.children || n.children.length === 0)
        .map(n => n.id)
      this.updateCheckedMaintList()
    },
    // 全选
    handleCheckAll(val) {
      const getAllLeafIds = (nodes, arr = []) => {
        nodes.forEach(n => {
          if (n.children && n.children.length) {
            getAllLeafIds(n.children, arr)
          } else {
            arr.push(n.id)
          }
        })
        return arr
      }
      if (val) {
        const allIds = getAllLeafIds(this.maintTree)
        this.checkedKeys = allIds
        this.$refs.maintTree.setCheckedKeys(allIds)
      } else {
        this.checkedKeys = []
        this.$refs.maintTree.setCheckedKeys([])
      }
      this.updateCheckedMaintList()
    },
    // 提取所有叶子节点
    getAllLeafNodes(nodes, arr = []) {
      nodes.forEach(n => {
        if (n.children && n.children.length) {
          this.getAllLeafNodes(n.children, arr)
        } else {
          arr.push(n)
        }
      })
      return arr
    },
    // 生成右侧表格完整内容
    updateCheckedMaintList() {
      // 获取所有被选中的节点 id（包括半选）
      const checkedIds = [
        ...this.$refs.maintTree.getCheckedKeys(true),
        ...this.$refs.maintTree.getHalfCheckedKeys()
      ]
      // 递归收集所有被选中节点的所有子孙节点中有 data 字段的节点
      const collectAllCheckedDataNodes = (nodes, arr = []) => {
        nodes.forEach(n => {
          if (checkedIds.includes(n.id)) {
            // 只要被选中，递归收集其所有子孙节点的 data
            const collectDescendantData = (node) => {
              if (node.data) arr.push(node.data)
              if (node.children && node.children.length) {
                node.children.forEach(child => collectDescendantData(child))
              }
            }
            collectDescendantData(n)
          } else if (n.children && n.children.length) {
            collectAllCheckedDataNodes(n.children, arr)
          }
        })
        return arr
      }
      // 去重（防止多层嵌套重复）
      const allData = collectAllCheckedDataNodes(this.maintTree)
      this.checkedMaintList = Array.from(new Set(allData.map(d => JSON.stringify(d)))).map(s => JSON.parse(s))
    },
    nextStep() {
      // 确保传递完整的表单数据，包括 dispatchStaffList
      const updateData = {
        ...this.form,
        buildingList: this.buildingList,
        checkedMaintList: this.checkedMaintList
      }
      
      console.log('合同信息页面 nextStep 传递数据:', updateData)
      this.$emit('update', updateData)
      this.$emit('next')
    },
    addRow() {
      this.buildingList.push({ name: '', area: '', floor: '', height: '', remark: '' })
    },
    removeRow(idx) {
      this.buildingList.splice(idx, 1)
    },
    async fetchContractDetail(id) {
      // 伪代码：实际请替换为你的API调用
      if (!this.$api || !this.$api.getContractDetail) return;
      const res = await this.$api.getContractDetail(id)
      if (res && res.data) {
        this.form = { ...this.form, ...res.data }
        this.buildingList = res.data.buildings || []
        this.checkedMaintList = res.data.maintainItems || []
      }
    },
  }
}
</script>

<style scoped>
.contract-info-root {
  width: 100%;
  padding: 0 16px 26px 16px;
  background: #f9fbfd;
}

.title-bar {
  font-size: 22px;
  font-weight: bold;
  color: #1976d2;
  text-align: center;
  margin: 28px 0 16px 0;
  letter-spacing: 2px;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 34px 28px 28px 28px;
  margin: 0 auto;
  max-width: 1520px;
  box-shadow: 0 4px 16px #e0ebff22;
}

.section-title {
  font-size: 19px;
  font-weight: bold;
  color: #222;
  margin-bottom: 16px;
  letter-spacing: 1.5px;
}

.double-form-row {
  margin-top: 10px;
}

.unit-text {
  margin-left: 8px;
  color: #666;
}

.date-sep {
  margin: 0 12px;
  color: #aaa;
  font-size: 16px;
}

.upload-tips {
  font-size: 13px;
  color: #888;
  margin-left: 14px;
}

.remind-tip {
  color: #888;
  margin-left: 10px;
  font-size: 13px;
}

.tip {
  font-size: 13px;
  color: #888;
  margin-left: 14px;
}

.building-table>>>th,
.building-table>>>td {
  font-size: 15px;
}

.tab-tree {
  background: #fff;
  min-height: 320px;
}

.tab-empty {
  color: #888;
  text-align: center;
  padding: 30px 0;
}

.empty-box {
  text-align: center;
  margin-top: 38px;
}
</style>
