<template>
  <div class="fault-list-detail-page">
    <!-- 悬浮设置按钮 -->
    <el-button
      class="setting-btn"
      type="primary"
      icon="el-icon-setting"
      circle
      @click="onSetting"
    />
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 12px;"
      :header-cell-style="{fontWeight:'bold',fontSize:'15px'}"
      empty-text="暂无数据"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="reportTime" label="上报时间" align="center" />
      <el-table-column prop="system" label="消防系统/设施" align="center" />
      <el-table-column prop="project" label="项目" align="center" />
      <el-table-column prop="reporter" label="上报人员" align="center" />
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="viewDetail(row)">详情</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'FaultListDetailPage',
  data() {
    return {
      // 为空数组即“暂无数据”效果
      tableData: [
        // {
        //   reportTime: '2025-06-01 10:05',
        //   system: '火灾报警系统',
        //   project: '1号楼',
        //   reporter: '张三'
        // }
      ]
    }
  },
  methods: {
    viewDetail(row) {
      this.$message.info('这里可跳转详情页')
    },
    onSetting() {
      this.$message.info('设置')
    }
  }
}
</script>

<style scoped>
.fault-list-detail-page {
  background: #fff;
  min-height: 80vh;
  position: relative;
}
.setting-btn {
  position: fixed;
  right: 32px;
  top: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px #87b7fd33;
}
</style>
