<template>
  <div class="contract-add-root">
    <!-- 顶部步骤条 -->
    <div class="steps-header">
      <div :class="['step', {active: step === 1}]">
        <span class="step-num">1</span> 新增合同信息
      </div>
      <div class="step-arrow"></div>
      <div :class="['step', {active: step === 2}]">
        <span class="step-num">2</span> 新增项目信息
      </div>
      <div class="step-arrow"></div>
      <div :class="['step', {active: step === 3}]">
        <span class="step-num">3</span> 配置维保人员
      </div>
    </div>
    <div class="page-title">新增合同</div>

    <!-- 合同信息表单区 -->
    <el-form :model="form" label-width="110px" class="form-flex" :rules="rules" ref="addForm">
      <!-- 左 -->
      <div class="form-col">
        <el-form-item label="委托单位名称" prop="entrustName" required>
          <el-input v-model="form.entrustName" placeholder="请输入委托单位名称"/>
        </el-form-item>
        <el-form-item label="合同时间" required>
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="开始日期"
            style="width: 150px"
          />
          <span style="margin:0 12px;">-</span>
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="结束日期"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="form.contractName" placeholder="请输入合同名称"/>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input v-model="form.contractNo" placeholder="请输入合同编号"/>
        </el-form-item>
        <el-form-item label="付款周期">
          <el-select v-model="form.payPeriod" placeholder="请选择付款周期" style="width: 100%">
            <el-option label="半年" value="半年" />
            <el-option label="一年" value="一年" />
          </el-select>
        </el-form-item>
      </div>
      <!-- 右 -->
      <div class="form-col">
        <el-form-item label="统一社会信用代码" prop="creditCode" required>
          <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码"/>
        </el-form-item>
        <el-form-item label="维保方式" prop="maintType" required>
          <el-select v-model="form.maintType" placeholder="请选择维保方式" style="width: 100%">
            <el-option label="系统维保" value="系统维保" />
            <el-option label="设备维保" value="设备维保" />
          </el-select>
        </el-form-item>
        <el-form-item label="维保面积">
          <el-input-number v-model="form.maintArea" :min="0" style="width:160px"/>
          <span style="margin-left:8px;">㎡</span>
        </el-form-item>
        <el-form-item label="合同金额">
          <el-input-number v-model="form.amount" :min="0" style="width:160px"/>
          <span style="margin-left:8px;">元</span>
        </el-form-item>
        <el-form-item label="收款提醒">
          <el-radio-group v-model="form.remind" style="vertical-align: middle;">
            <el-radio :label="1">开通</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <!-- 底部按钮 -->
    <div style="text-align:center;margin: 38px 0 12px 0;">
      <el-button type="primary" style="width: 160px;font-size:18px;" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContractAdd',
  data() {
    return {
      step: 1,
      form: {
        entrustName: '',
        startDate: '',
        endDate: '',
        contractName: '',
        contractNo: '',
        payPeriod: '',
        creditCode: '',
        maintType: '',
        maintArea: null,
        amount: null,
        remind: 0,
      },
      rules: {
        entrustName: [{ required: true, message: '请输入委托单位', trigger: 'blur' }],
        creditCode: [{ required: true, message: '请输入信用代码', trigger: 'blur' }],
        maintType: [{ required: true, message: '请选择维保方式', trigger: 'change' }]
      }
    }
  },
  methods: {
    nextStep() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 跳转到下一步（如第二步页面）
          this.$router.push({ name: 'ProjectAdd' }) // 你可以根据路由实际调整
        }
      })
    }
  }
}
</script>

<style scoped>
.contract-add-root {
  background: #fff;
  border-radius: 10px;
  padding: 0 18px 48px 18px;
  min-height: 100vh;
}
.steps-header {
  display: flex;
  align-items: center;
  gap: 0 38px;
  margin: 0 0 16px 0;
}
.step {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #888;
  background: #f5faff;
  border-radius: 12px 12px 0 12px;
  padding: 16px 32px 16px 24px;
  min-width: 220px;
  font-weight: 500;
  position: relative;
}
.step.active {
  background: linear-gradient(90deg, #409eff11 0%, #eaf4ff 100%);
  color: #2977c7;
  border-bottom: 3px solid #409EFF;
}
.step-num {
  background: #409EFF;
  color: #fff;
  border-radius: 50%;
  padding: 2px 12px;
  margin-right: 14px;
  font-size: 20px;
}
.step-arrow {
  width: 50px;
  height: 3px;
  border-bottom: 3px solid #d8eafd;
  background: transparent;
  align-self: flex-end;
  margin-bottom: 12px;
}
.page-title {
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #1685e7;
  margin: 18px 0 10px 0;
  letter-spacing: 2px;
}
.form-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #f6faff;
  border-radius: 8px;
  padding: 32px 14px 12px 14px;
  margin-bottom: 0;
  gap: 0 34px;
}
.form-col {
  flex: 1;
  min-width: 380px;
  max-width: 510px;
  margin: 0 18px;
}
</style>
