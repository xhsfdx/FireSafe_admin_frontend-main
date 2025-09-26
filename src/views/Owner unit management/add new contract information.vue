<template>
  <div class="contract-info-root">
    <div class="title-bar">新增合同</div>
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
            <el-form-item label="合同种类" prop="contractType" required>
              <el-select
                v-model="form.contractType"
                placeholder="请选择合同种类"
                style="width: 100%"
                @change="handleContractTypeChange"
              >
                <el-option label="施工" value="施工" />
                <el-option label="评估" value="评估" />
                <el-option label="检测" value="检测" />
                <el-option label="项目维保" value="项目维保" />
              </el-select>
              <div
                v-if="['施工', '评估', '检测'].includes(form.contractType)"
                style="color: #f56c6c; font-size: 12px; margin-top: 4px;"
              >
                <i class="el-icon-info" /> 一次性合同仅需填写基本信息，维保相关内容将自动清空
              </div>
            </el-form-item>
            <el-form-item label="合同时间" required>
              <div style="display: flex; align-items: center;">
                <el-form-item prop="dateStart" style="margin-bottom: 0;">
                  <el-date-picker v-model="form.dateStart" type="date" placeholder="开始日期" style="width: 160px" />
                </el-form-item>
                <span style="margin: 0 12px;">-</span>
                <el-form-item prop="dateEnd" style="margin-bottom: 0;">
                  <el-date-picker v-model="form.dateEnd" type="date" placeholder="结束日期" style="width: 160px" />
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="合同名称" prop="contractName" required>
              <el-input v-model="form.contractName" placeholder="请输入合同名称" />
            </el-form-item>
            <el-form-item label="合同编号">
              <el-input v-model="form.contractNo" placeholder="请输入合同编号" />
            </el-form-item>
            <el-form-item label="付款周期">
              <el-select
                v-model="form.payCycle"
                placeholder="请选择付款周期"
                style="width: 100%"
                :disabled="['施工', '评估', '检测'].includes(form.contractType)"
              >
                <el-option label="月" value="月" />
                <el-option label="季" value="季" />
                <el-option label="半年" value="半年" />
                <el-option label="年" value="年" />

              </el-select>
            </el-form-item>
            <el-form-item label="维保建筑类型">
              <el-select
                v-model="form.buildType"
                placeholder="请选择维保建筑类型"
                style="width: 100%"
                :disabled="['施工', '评估', '检测'].includes(form.contractType)"
              >
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
              <el-input
                v-model="form.remark"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 3 }"
                placeholder="请输入备注说明"
              />
            </el-form-item>
          </el-col>
          <!-- 右栏 -->
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="creditCode" required>
              <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>
            <el-form-item label="维保方式" prop="maintType" required>
              <el-select
                v-model="form.maintType"
                placeholder="请选择维保方式"
                style="width: 100%"
                :disabled="['施工', '评估', '检测'].includes(form.contractType)"
              >
                <el-option label="系统维保" value="系统维保" />
                <el-option label="点位维保" value="点位维保" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保面积">
              <el-input-number
                v-model="form.maintArea"
                :min="0"
                style="width: 130px"
                :disabled="['施工', '评估', '检测'].includes(form.contractType)"
              />
              <span class="unit-text">㎡</span>
            </el-form-item>
            <el-form-item label="合同金额">
              <el-input-number v-model="form.amount" :min="0" style="width: 130px" />
              <span class="unit-text">元</span>
            </el-form-item>
            <el-form-item label="收款提醒">
              <el-radio-group v-model="form.remind" :disabled="['施工', '评估', '检测'].includes(form.contractType)">
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
              <el-upload
                action="#"
                :file-list="fileList"
                :http-request="handleUpload"
                list-type="text"
                :before-upload="beforeUpload"
                :on-remove="handleRemove"
                :on-preview="handlePreview"
                style="display:inline-block"
              >
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
        <span
          v-if="['施工', '评估', '检测'].includes(form.contractType)"
          style="color:#f56c6c;margin-left:10px;"
        >一次性合同无需填写</span>
      </div>
      <el-table
        v-if="!['施工', '评估', '检测'].includes(form.contractType)"
        :data="buildingList"
        border
        style="width: 100%; margin-bottom: 12px;"
        class="building-table"
      >
        <el-table-column prop="name" label="* 建筑信息" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入建筑名称" />
          </template>
        </el-table-column>
        <el-table-column prop="area" label="* 建筑面积(m²)" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.area"
              :min="0"
              :step="0.01"
              style="width: 160px"
              placeholder="请输入建筑面积"
            />
          </template>
        </el-table-column>
        <el-table-column prop="floor" label="* 建筑层数" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.floor" :min="0" style="width: 120px" placeholder="请输入建筑层数" />
          </template>
        </el-table-column>
        <el-table-column prop="height" label="* 建筑高度(m)" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.height"
              :min="0"
              :step="0.01"
              style="width: 160px"
              placeholder="请输入建筑高度"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入备注" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button
              v-if="buildingList.length > 1"
              type="text"
              style="color:#f56c6c"
              @click="removeRow(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!['施工', '评估', '检测'].includes(form.contractType)" style="text-align: center; margin-bottom: 18px;">
        <el-button type="text" style="font-size: 16px; color: #409EFF;" @click="addRow">
          <i class="el-icon-plus" /> 新增内容
        </el-button>
      </div>

      <!-- 合同维保内容 -->
      <div class="section-title" style="margin-top:28px;">
        合同维保内容
        <span
          v-if="['施工', '评估', '检测'].includes(form.contractType)"
          style="color:#f56c6c;margin-left:10px;"
        >一次性合同无需填写</span>
      </div>
      <el-row v-if="!['施工', '评估', '检测'].includes(form.contractType)" :gutter="14">
        <!-- 左侧树形列表 + 全选 -->
        <el-col :span="6">
          <div style="margin-bottom:12px;">
            <el-checkbox v-model="treeCheckAll" style="margin-left:2px;" @change="handleCheckAll">一键全选</el-checkbox>
          </div>
          <el-tabs v-model="activeTab" class="tab-tree">
            <el-tab-pane label="平台标准系统" name="standard">
              <el-tree
                ref="maintTree"
                :data="maintTree"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkedKeys"
                :expand-on-click-node="false"
                @check="handleTreeCheck"
              />
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
import { mapActions } from 'vuex'
// import { createContract } from '@/api/contract'
import { getMaintainStandardItems } from '@/api/contract'
import { uploadDoc } from '@/api/upload'
import { BASE_URL } from '@/utils/request'

export default {
  name: 'AddNewContractInfo',
  props: ['data'],
  data() {
    return {
      form: {
        entrustName: '', dateStart: '', dateEnd: '', contractName: '', contractNo: '',
        contractType: '', payCycle: '', buildType: '', creditCode: '', maintType: '', maintArea: '',
        amount: '', remind: 0, designOrg: '', remark: '', debugOrg: '', recordOrg: '', fileUrls: ''
      },
      rules: {
        entrustName: [{ required: true, message: '请输入委托单位名称', trigger: 'blur' }],
        contractName: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        contractType: [{ required: true, message: '请选择合同种类', trigger: 'change' }],
        dateStart: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
        dateEnd: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
        creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
        maintType: [{ required: true, message: '请选择维保方式', trigger: 'change' }]
      },
      buildingList: [{ name: '', area: '', floor: '', height: '', remark: '' }],
      activeTab: 'standard',
      maintTree: [],
      checkedKeys: [],
      checkedMaintList: [],
      fileUrls: '',
      fileList: [], // 显示的文件列表
      treeCheckAll: false
    }
  },
  mounted() {
    this.loadMaintainTree()
  },
  methods: {
    ...mapActions('contractSubmit', ['updateContractField', 'updateBuildings']),

    // 递归挂 parent
    transformToTrees(rawData) {
      function attachParent(nodes, parent = null) {
        return nodes.map(node => {
          const n = { ...node, parent }
          if (n.children && n.children.length) {
            n.children = attachParent(n.children, n)
          }
          return n
        })
      }
      return attachParent(rawData)
    },
    beforeUpload(file) {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!allowedTypes.includes(file.type)) {
        this.$message.error('只支持上传 JPG, PNG, PDF, DOC, DOCX 格式文件')
        return false
      }

      if (file.size > maxSize) {
        this.$message.error('文件大小不能超过 10MB')
        return false
      }

      return true
    },
    // 自定义上传逻辑
    async handleUpload({ file, onSuccess, onError }) {
      try {
        const res = await uploadDoc(file)
        this.$message.success('上传成功')
        // 假设上传返回的是 { url: 'xxx' }
        this.fileUrls = BASE_URL + '/uploads' + res.filePath || ''
        this.fileList.push({
          name: file.name,
          url: this.fileUrls || '',
          raw: file
        })
        onSuccess(res.filePath)
      } catch (err) {
        this.$message.error('上传失败')
        onError(err)
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePreview(file) {
      if (file.url) {
        window.open(file.url, '_blank')
      } else {
        this.$message.warning('暂无预览地址')
      }
    },
    transformToTree(data) {
      const getPeriodLabel = (p) => {
        if (!p) return ''
        if (p === 1) return '月检'
        if (p === 12) return '年检'
        return `${p}`
      }

      return data.map(system => ({
        id: system._id,
        label: system.category,
        children: (system.devices || []).map(device => ({
          id: device._id,
          label: device.device,
          children: (device.items || []).map(item => ({
            id: item._id,
            label: item.maintainSlim,
            data: {
              id: item._id,
              system: system.category,
              item: device.device,
              content: item.maintainContent,
              period: getPeriodLabel(item.frequency),
              standard: item.attention || ''
            }
          }))
        }))
      }))
    },

    async loadMaintainTree() {
      try {
        const res = await getMaintainStandardItems()
        const rawData = res.data
        this.maintTree = this.transformToTree(rawData)
      } catch (err) {
        this.$message.error('加载维保项目失败')
      }
    },
    handleTreeCheck(data, { checkedKeys }) {
      this.checkedKeys = checkedKeys
      this.updateCheckedMaintList()
      // 控制全选
      const allIds = this.getAllLeafIds(this.maintTree)
      this.treeCheckAll = checkedKeys.length === allIds.length
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

    // 提取所有叶子节点id
    getAllLeafIds(nodes, arr = []) {
      nodes.forEach(n => {
        if (n.children && n.children.length) {
          this.getAllLeafIds(n.children, arr)
        } else {
          arr.push(n.id)
        }
      })
      return arr
    },
    // 生成右侧表格完整内容
    updateCheckedMaintList() {
      const checkedNodes = this.$refs.maintTree.getCheckedNodes(true)
      this.checkedMaintList = checkedNodes
        .filter(n => !n.children || n.children.length === 0)
        .map(n => n.data || {
          system: n.label,
          item: '', content: '', period: '', standard: ''
        })

      console.log(this.checkedMaintList)
    },

    handleContractTypeChange(value) {
      if (['施工', '评估', '检测'].includes(value)) {
        // 一次性合同时，其他字段默认无
        this.form.payCycle = ''
        this.form.buildType = ''
        this.form.maintType = ''
        this.form.maintArea = ''
        this.form.remind = 0
        this.form.designOrg = ''
        this.form.debugOrg = ''
        this.form.recordOrg = ''
        this.form.remark = ''
        // 清空建筑信息
        this.buildingList = [{ name: '', area: '', floor: '', height: '', remark: '' }]
        // 清空维保内容
        this.checkedMaintList = []
        this.checkedKeys = []
        if (this.$refs.maintTree) {
          this.$refs.maintTree.setCheckedKeys([])
        }
      }
      // 项目维保保持原有逻辑
    },
    nextStep() {
      console.log('nextStep 被调用')

      // 如果是一次性合同，临时移除维保方式的验证规则
      // const originalRules = { ...this.rules }
      if (['施工', '评估', '检测'].includes(this.form.contractType)) {
        this.rules.maintType = []
        this.form.maintType = '' // 确保维保方式为空
      }

      // 检查必填字段
      const requiredFields = ['entrustName', 'contractName', 'contractType', 'dateStart', 'dateEnd', 'creditCode']
      const missingFields = requiredFields.filter(field => !this.form[field])

      if (missingFields.length > 0) {
        this.$message.error(`请填写必填字段: ${missingFields.join(', ')}`)
        return
      }

      console.log('必填字段检查通过，准备验证表单')

      // 简化验证逻辑，直接提交
      const data = {
        contractName: this.form.contractName,
        contractNo: this.form.contractNo,
        contractType: this.form.contractType,
        entrustName: this.form.entrustName,
        creditCode: this.form.creditCode,
        payCycle: this.form.payCycle,
        buildType: this.form.buildType,
        maintType: this.form.maintType,
        maintArea: this.form.maintArea,
        amount: this.form.amount,
        dateStart: this.form.dateStart,
        dateEnd: this.form.dateEnd,
        remind: this.form.remind,
        designOrg: this.form.designOrg,
        debugOrg: this.form.debugOrg,
        recordOrg: this.form.recordOrg,
        remark: this.form.remark,
        fileUrls: [this.fileUrls],
        buildingList: this.buildingList,
        checkedMaintList: this.checkedMaintList
      }
      console.log('合同信息页面准备发送数据:', data)
      this.$emit('update', data)
      console.log('合同信息页面发送 next 事件')
      this.$emit('next')
    },
    addRow() {
      this.buildingList.push({ name: '', area: '', floor: '', height: '', remark: '' })
    },
    removeRow(idx) {
      this.buildingList.splice(idx, 1)
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
</style>
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

/* 一次性合同禁用字段样式 */
.contract-info-root :deep(.el-select.is-disabled .el-input__inner) {
  background-color: #f5f7fa;
  color: #c0c4cc;
}

.contract-info-root :deep(.el-input-number.is-disabled .el-input__inner) {
  background-color: #f5f7fa;
  color: #c0c4cc;
}

.contract-info-root :deep(.el-radio.is-disabled .el-radio__label) {
  color: #c0c4cc;
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
