<!-- 续签合同信息 -->
<template>
  <div class="renewal-contract-info">
    <!-- 大标题 -->
    <div class="main-title">续签合同</div>
    <!-- 内容区 -->
    <div class="form-card">
      <div class="form-section-title">合同信息</div>
      <el-form :model="form" label-width="120px" class="contract-form" :inline="false">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="委托单位名称" required>
              <el-input v-model="form.orgName" placeholder="请输入委托单位名称" />
            </el-form-item>
            <el-form-item label="合同时间" required>
              <el-date-picker
                v-model="form.date"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="合同名称">
              <el-input v-model="form.contractName" placeholder="请输入合同名称" />
            </el-form-item>
            <el-form-item label="合同编号">
              <el-input v-model="form.contractNo" placeholder="请输入合同编号" />
            </el-form-item>
            <el-form-item label="付款周期">
              <el-select v-model="form.payPeriod" placeholder="请选择">
                <el-option label="半年" value="半年" />
                <el-option label="一年" value="一年" />
                <el-option label="季度" value="季度" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" required>
              <el-input v-model="form.uscc" placeholder="请输入统一社会信用代码" />
            </el-form-item>
            <el-form-item label="维保方式" required>
              <el-select v-model="form.maintType" placeholder="请选择">
                <el-option label="系统维保" value="系统维保" />
                <el-option label="综合维保" value="综合维保" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保面积">
              <el-input-number
                v-model="form.area"
                :step="100"
                :min="0"
                controls-position="right"
                style="width: 170px;"
              />
              <span style="margin-left:8px;">㎡</span>
            </el-form-item>
            <el-form-item label="合同金额">
              <el-input-number
                v-model="form.amount"
                :step="1000"
                :min="0"
                controls-position="right"
                style="width: 170px;"
              />
              <span style="margin-left:8px;">元</span>
            </el-form-item>
            <el-form-item label="收款提醒">
              <el-radio-group v-model="form.notify">
                <el-radio :label="false">关闭</el-radio>
                <el-radio :label="true">开启</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 操作按钮 -->
        <el-row>
          <el-col :span="24" style="text-align:center;margin-top:16px;">
            <el-button type="primary" size="large" class="next-btn" @click="nextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RenewalContractInformation',
  data() {
    return {
      form: {
        orgName: 'Cell C',
        date: ['2026-05-29', '2026-05-29'],
        contractName: 'VDS',
        contractNo: '',
        payPeriod: '半年',
        uscc: '91440101304662708A',
        maintType: '系统维保',
        area: 3000,
        amount: 20000,
        notify: false
      }
    }
  },
  methods: {
    nextStep() {
      this.$emit('next')
    }
  }
}
</script>

<style scoped>
.renewal-contract-info {
  background: #fafbfc;
  min-height: 100vh;
  padding-bottom: 32px;
}
.main-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #1888fe;
  margin: 24px 0 18px 0;
  letter-spacing: 2px;
}
.form-card {
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  max-width: 98%;
  padding: 22px 28px 28px 28px;
  box-shadow: 0 4px 24px #e3f2ff30;
}
.form-section-title {
  background: #e8f3fe;
  color: #222;
  font-size: 22px;
  font-weight: 700;
  padding: 16px 0 16px 18px;
  border-radius: 8px 8px 0 0;
  margin-bottom: 26px;
}
.contract-form >>> .el-form-item__label {
  font-size: 17px;
  color: #222;
  font-weight: 600;
}
.contract-form >>> .el-input__inner,
.contract-form >>> .el-input-number__inner {
  font-size: 16px;
  height: 40px;
}
.next-btn {
  width: 180px;
  height: 48px;
  font-size: 20px;
  background: #1888fe;
  border: none;
  border-radius: 6px;
  color: #fff;
  letter-spacing: 10px;
}
.next-btn:hover {
  background: #157de6;
}
</style>
