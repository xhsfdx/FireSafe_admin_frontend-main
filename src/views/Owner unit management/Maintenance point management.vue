<template>
  <div class="plan-list-page">
    <!-- 顶部筛选栏 -->
    <div class="search-bar">
      <el-input v-model="filters.name" placeholder="项目名称搜索" clearable class="search-input" />
      <el-select v-model="filters.makingStatus" placeholder="制定情况" clearable class="search-input">
        <el-option label="已制定" value="已制定" />
        <el-option label="未制定" value="未制定" />
      </el-select>
      <el-select v-model="filters.planType" placeholder="计划类型" clearable class="search-input">
        <el-option label="月" value="月" />
        <el-option label="季度" value="季度" />
      </el-select>
      <el-select v-model="filters.planStatus" placeholder="计划状态" clearable class="search-input">
        <el-option label="进行中" value="进行中" />
        <el-option label="已完成" value="已完成" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
      <el-button type="success" icon="el-icon-check" class="green-btn">一键制定所选计划</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%;"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="项目名称" align="center" />
      <el-table-column prop="owner" label="业主单位名称" align="center" />
      <el-table-column prop="planType" label="计划类型" align="center">
        <template slot-scope="{ row }">
          <span style="color: #16c336;">{{ row.planType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="maintType" label="维保方式" align="center">
        <template slot-scope="{ row }">
          <span style="color: #7814ea;">{{ row.maintType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="makingStatus" label="制定情况" align="center">
        <template slot-scope="{ row }">
          <span style="color: #1bb214;">{{ row.makingStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planStatus" label="计划状态" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary" style="font-weight: bold;">
            {{ row.planStatus }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="{ row }">
          <el-link type="primary" @click="showPlan(row)">计划详情</el-link>
          <el-link type="info" style="margin: 0 8px;" @click="showTask(row)">任务详情</el-link>
          <el-link type="danger" @click="delRow(row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 右下角设置按钮 -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle />

    <!-- 底部分页与统计 -->
    <div class="table-footer">
      <div class="total">共查询到 {{ tableData.length }} 条</div>
      <el-pagination background layout="prev, pager, next" :page-size="10" :total="tableData.length" style="float:right"
        :current-page="1" @current-change="() => { }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanListPage',
  data() {
    return {
      filters: {
        name: '',
        makingStatus: '',
        planType: '',
        planStatus: ''
      },
      allData: [
        {
          name: 'ue',
          owner: '小学',
          planType: '月',
          maintType: '系统维保',
          makingStatus: '已制定',
          planStatus: '进行中'
        },
        {
          name: '高坪汽车站消防维保…',
          owner: '高坪汽车站',
          planType: '月',
          maintType: '系统维保',
          makingStatus: '已制定',
          planStatus: '进行中'
        }
      ],
      tableData: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      // 实际项目应从接口拉数据
      const { name, makingStatus, planType, planStatus } = this.filters
      this.tableData = this.allData.filter(item =>
        (!name || item.name.includes(name)) &&
        (!makingStatus || item.makingStatus === makingStatus) &&
        (!planType || item.planType === planType) &&
        (!planStatus || item.planStatus === planStatus)
      )
    },
    onReset() {
      this.filters = { name: '', makingStatus: '', planType: '', planStatus: '' }
      this.onSearch()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showPlan(row) {
      // 可传参：比如计划ID/项目名等，这里传 name
      this.$router.push({
        name: 'OwnerUnitPlanDetail', // 路由name要和router里配置的name一致
        query: { name: row.name }
      })
    },
    showTask(row) {
      this.$router.push({
        name: 'OwnerUnitTaskDetail',
        query: { name: row.name }
      })
    },
    delRow(row) {
      this.tableData = this.tableData.filter(item => item !== row)
      this.$message.success('删除成功')
    }
  }
}
</script>

<style scoped>
.plan-list-page {
  min-height: 100vh;
  background: #fafbfc;
  padding: 16px 16px 0 16px;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.search-input {
  width: 240px;
}

.green-btn {
  background: #50b94e !important;
  color: #fff !important;
  border: none !important;
}

.setting-btn {
  position: fixed;
  right: 42px;
  bottom: 120px;
  z-index: 20;
  width: 56px;
  height: 56px;
  font-size: 26px;
  background: #1d8cff;
  border: none;
  box-shadow: 0 4px 24px #b7dfff44;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  margin-bottom: 0;
  position: relative;
}

.total {
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 18px;
  color: #333;
  margin-left: 16px;
  margin-top: 4px;
}
</style>
