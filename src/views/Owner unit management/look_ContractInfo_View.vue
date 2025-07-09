<template>
  <div class="contract-info-root">
    <div class="form-card">
      <div class="section-title">合同信息</div>
      <el-form label-width="112px" class="double-form-row view-form">
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="委托单位名称">
              <el-input :value="formData.clientCompany" disabled />
            </el-form-item>
            <el-form-item label="合同时间">
              <el-date-picker :value="formData.startDate" type="date" style="width: 140px" disabled />
              <span class="date-sep">-</span>
              <el-date-picker :value="formData.endDate" type="date" style="width: 140px" disabled />
            </el-form-item>
            <el-form-item label="合同名称">
              <el-input :value="formData.name" disabled />
            </el-form-item>
            <el-form-item label="合同编号">
              <el-input :value="formData.contractNo" disabled />
            </el-form-item>
            <el-form-item label="付款周期">
              <el-select :value="formData.payCycle" style="width: 100%" disabled>
                <el-option label="月" value="月" />
                <el-option label="季" value="季" />
                <el-option label="半年" value="半年" />
                <el-option label="年" value="年" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保建筑类型">
              <el-select :value="formData.buildType" style="width: 100%" disabled>
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
              <el-input :value="formData.designOrg" disabled />
            </el-form-item>
            <el-form-item label="备注说明">
              <el-input :value="formData.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码">
              <el-input :value="formData.creditCode" disabled />
            </el-form-item>
            <el-form-item label="维保方式">
              <el-select :value="formData.maintType" style="width: 100%" disabled>
                <el-option label="系统维保" value="系统维保" />
                <el-option label="点位维保" value="点位维保" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保面积">
              <el-input-number :value="formData.maintArea" style="width: 130px" disabled />
              <span class="unit-text">㎡</span>
            </el-form-item>
            <el-form-item label="合同金额">
              <el-input-number :value="formData.amount" style="width: 130px" disabled />
              <span class="unit-text">元</span>
            </el-form-item>
            <el-form-item label="收款提醒">
              <el-radio-group :value="formData.remind" disabled>
                <el-radio :label="1">开通</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="调试单位">
              <el-input :value="formData.debugOrg" disabled />
            </el-form-item>
            <el-form-item label="验收备案">
              <el-input :value="formData.recordOrg" disabled />
            </el-form-item>
            <el-form-item label="合同文件">
              <el-button size="mini" disabled>查看合同文件</el-button>
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
        <el-table-column prop="system" label="消防系统/设施" align="center" />
        <el-table-column prop="item" label="维保项目" align="center" />
        <el-table-column prop="content" label="检测内容" align="center" />
        <el-table-column prop="period" label="维保周期" align="center" />
        <el-table-column prop="standard" label="规范" align="center" />
      </el-table>
      <div v-if="!formData.checkedMaintList || formData.checkedMaintList.length === 0" class="empty-box">
        暂无维保内容
      </div>

      <div style="text-align: center; margin: 38px 0 12px 0;">
        <el-button type="primary" size="large" @click="nextStep">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContractInfoView',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    formatDate(date) {
      return date ? date.substring(0, 10) : 'N/A'
    },
    nextStep() {
      this.$emit('next')
    }
  }
}
</script>

<style scoped>
.contract-info-root {
  width: 100%;
  padding: 0 16px 26px 16px;
  background: #f9fbfd;
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
.empty-box {
  text-align: center;
  padding: 20px;
  color: #888;
}
.date-sep {
  margin: 0 12px;
  color: #aaa;
  font-size: 16px;
}
.unit-text {
  margin-left: 8px;
  color: #666;
}
.view-form >>> .el-input.is-disabled .el-input__inner,
.view-form >>> .el-textarea.is-disabled .el-textarea__inner,
.view-form >>> .el-input-number.is-disabled .el-input__inner {
  color: #606266 !important;
  background-color: #F5F7FA !important;
  border-color: #E4E7ED !important;
  cursor: default !important;
}
.view-form >>> .el-radio__input.is-disabled+span.el-radio__label {
  color: #606266 !important;
}
.view-form >>> .el-select .el-input.is-disabled .el-input__inner {
    cursor: default !important;
    color: #606266 !important;
    background-color: #F5F7FA !important;
}
</style> 