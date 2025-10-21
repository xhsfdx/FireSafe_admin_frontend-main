<template>
  <div class="info-block">
    <div class="info-title">合同详情</div>
    <el-table :data="detailList" border style="width:100%">
      <el-table-column prop="item" label="条款编号" align="center" width="120" />
      <el-table-column prop="content" label="内容描述" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    projectId: { type: String, default: '' }
  },
  data() {
    return {
      detailList: [
        { item: '1', content: '服务项目包含每月定期巡检', remark: '' },
        { item: '2', content: '遇故障2小时内响应', remark: '' },
        { item: '3', content: '重大隐患整改需提交报告', remark: '' }
      ]
    }
  }
}
</script>
<style scoped>
.info-block { margin: 32px 12px 12px 12px; }
.info-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 18px;
}
</style>
