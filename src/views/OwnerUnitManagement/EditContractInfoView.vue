// EditContractInfoView.vue
<template>
  <div class="contract-info-root">
    <div class="form-card">
      <div class="section-title">编辑合同信息</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="112px" class="double-form-row">
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="委托单位名称" prop="clientCompany">
              <el-input v-model="form.clientCompany" @change="updateParentData" />
            </el-form-item>
            <el-form-item label="合同时间" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" style="width: 140px" @change="updateParentData" />
              <span class="date-sep">-</span>
              <el-date-picker v-model="form.endDate" type="date" style="width: 140px" @change="updateParentData" />
            </el-form-item>
            <el-form-item label="合同名称" prop="name">
              <el-input v-model="form.name" @change="updateParentData" />
            </el-form-item>
            <el-form-item label="合同编号" prop="code">
              <el-input v-model="form.code" @change="updateParentData" />
            </el-form-item>
            <el-form-item label="付款周期" prop="payCycle">
              <el-select v-model="form.payCycle" style="width: 100%" @change="updateParentData">
                <el-option label="月" value="月" />
                <el-option label="季" value="季" />
                <el-option label="半年" value="半年" />
                <el-option label="年" value="年" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保建筑类型" prop="warrantyType">
              <el-select v-model="form.warrantyType" style="width: 100%" @change="updateParentData">
                <el-option label="高层" value="高层" />
                 <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
            <el-form-item label="设计单位">
              <el-input v-model="form.designCompany" @change="updateParentData" />
            </el-form-item>
            <el-form-item label="备注说明">
              <el-input v-model="form.note" type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" @change="updateParentData" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="creditCode">
              <el-input v-model="form.creditCode" @change="updateParentData" />
            </el-form-item>
            <el-form-item label="维保方式" prop="warrantyMethod">
              <el-select v-model="form.warrantyMethod" style="width: 100%" @change="updateParentData">
                <el-option label="系统维保" value="系统维保" />
                <el-option label="点位维保" value="点位维保" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保面积">
              <el-input-number v-model="form.warrantyArea" style="width: 130px" @change="updateParentData" />
              <span class="unit-text">㎡</span>
            </el-form-item>
            <el-form-item label="合同金额">
              <el-input-number v-model="form.amount" style="width: 130px" @change="updateParentData" />
              <span class="unit-text">元</span>
            </el-form-item>
            <el-form-item label="收款提醒">
              <el-radio-group v-model="form.autoNotice" @change="updateParentData">
                <el-radio :label="true">开通</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="调试单位">
              <el-input v-model="form.debugCompany" @change="updateParentData" />
            </el-form-item>
            <el-form-item label="验收备案">
              <el-input v-model="form.checkCompany" @change="updateParentData" />
            </el-form-item>
            <el-form-item label="合同文件">
              <el-button v-on:click="handlePreview(form.fileUrls)" size="mini">查看合同文件</el-button>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>

       <div class="section-title" style="margin-top:32px;">建筑信息</div>
      <el-table :data="formData.buildingList" border style="width: 100%; margin-bottom: 12px;">
        <el-table-column prop="name" label="建筑信息" align="center" />
        <el-table-column prop="area" label="建筑面积(m²)" align="center" />
        <el-table-column prop="floor" label="建筑层数" align="center" />
        <el-table-column prop="height" label="建筑高度(m)" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
      </el-table>

      <div class="section-title" style="margin-top:28px;">合同维保内容</div>
      <el-table :data="formData.checkedMaintList" border style="width:100%;">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="systemCategory" label="消防系统/设施" align="center" />
        <el-table-column prop="deviceName" label="维保项目" align="center" />
        <el-table-column prop="maintainSlim" label="检测内容" align="center" />
        <el-table-column prop="frequency" label="维保周期" align="center" />
        <el-table-column prop="maintainContent" label="规范" align="center" />
      </el-table>

      <div style="text-align: center; margin: 38px 0 12px 0;">
        <el-button type="primary" size="large" @click="nextStep">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EditContractInfoView',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // Use a local 'form' object for v-model
      form: {},
      // Add validation rules
      rules: {
        clientCompany: [{ required: true, message: '请输入委托单位名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择合同开始日期', trigger: 'change' }],
        payCycle: [{ required: true, message: '请选择付款周期', trigger: 'change' }],
        warrantyType: [{ required: true, message: '请选择维保建筑类型', trigger: 'change' }],
        warrantyMethod: [{ required: true, message: '请选择维保方式', trigger: 'change' }],
        creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // When the prop changes, update the local 'form'
    formData: {
      handler(newVal) {
        if (newVal) {
          // Use JSON to create a deep copy to avoid mutating the prop
          this.form = JSON.parse(JSON.stringify(newVal))
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // This new method validates the form before emitting 'next'
    nextStep() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateParentData() // Send final changes to parent
          this.$emit('next')
        } else {
          this.$message.error('表单校验失败，请检查红色标记的字段')
          return false
        }
      })
    },
    // This new method emits local form changes to the parent
    updateParentData() {
      this.$emit('update', this.form)
    },
    // handlePreview is identical to your 'Look' component
    handlePreview(file) {
      if (file && file.length > 0) {
        window.open(file[0], '_blank')
      } else {
        this.$message.warning('暂无预览地址')
      }
    }
  }
}
</script>

<style scoped>
/* (All styles from look_ContractInfo_View.vue) */
.contract-info-root {
  width: 100%;
  padding: 0 16px 26px 16px;
  background: #f9fbfd;
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

/* Remove the 'disabled' styles if you don't want them */
/* .view-form >>> .el-input.is-disabled .el-input__inner, ... */
</style>