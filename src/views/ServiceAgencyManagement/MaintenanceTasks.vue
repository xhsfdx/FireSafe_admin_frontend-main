<template>
  <div class="work-order-management-page">
    <!-- 顶部导航/选项卡 -->
    <div class="tab-navigation">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ 'tab-item': true, 'active': currentTab === tab.value }"
        @click="selectTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 内容区域：根据选项卡展示不同界面 -->
    <div class="tab-content">
      <!-- 例行维保 -->
      <div v-show="currentTab === 'routine'">
        <div class="search-filter">
          <div class="filter-item">
            <input
              v-model="searchParams.projectName"
              type="text"
              placeholder="输入项目名称搜索"
              class="filter-input"
            >
          </div>
          <div class="filter-item">
            <el-select v-model="searchParams.statusroutine" placeholder="选择计划类型">
              <el-option label="月" value="0" />
              <el-option label="季" value="1" />
              <el-option label="年" value="2" />
              <el-option label="半年" value="3" />
            </el-select>
          </div>
          <div class="filter-item">
            <el-select
              v-model="searchParams.statusroutine"
              placeholder="任务状态"
            >
              <el-option label="待处理" value="0" />
              <el-option label="处理中" value="1" />
              <el-option label="已完成" value="2" />
              <el-option label="待审批" value="3" />
            </el-select>
          </div>
          <div class="filter-item">
            <el-select
              v-model="searchParams.timeliness"
              placeholder="任务时效"
            >
              <el-option label="正常" value="0" />
              <el-option label="已逾期" value="1" />
            </el-select>
          </div>
          <el-date-picker
            type="date"
            placeholder="选择任务日期"
            class="input-item"
            style="width: 200px"
          />
          <div class="filter-actions">
            <button class="btn btn-primary" icon="el-icon-search" @click="handleSearch">
              <i class="el-icon-search search-icon" /> 查询
            </button>
            <button class="btn btn-secondary" @click="handleReset">
              <i class="el-icon-refresh reset-icon" /> 重置
            </button>
          </div>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>项目名称</th>
                <th>计划类型</th>
                <th>任务名称</th>
                <th>项目负责人</th>
                <th>现场维保人员</th>
                <th>任务状态</th>
                <th>任务时效</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <!-- 始终显示无数据状态 -->
              <tr>
                <td colspan="9" class="no-data">
                  <div class="empty-state">
                    <img src="your-xls-icon-path.png" alt="没有数据" class="empty-icon">
                    <p>暂无数据</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 可以在这里添加分页组件 -->
        </div>
      </div>

      <!-- 故障工单 -->
      <div v-show="currentTab === 'fault'">
        <div class="search-filter">
          <div class="filter-item">
            <input
              v-model="searchParams.projectName"
              type="text"
              placeholder="输入项目名称搜索"
              class="filter-input"
            >
          </div>
          <div class="filter-item">
            <input
              v-model="searchParams.projectName"
              type="text"
              placeholder="输入上报人员"
              class="filter-input"
            >
          </div>
          <div class="filter-item">
            <el-select
              v-model="searchParams.statusfault"
              placeholder="工单状态"
            >
              <el-option label="待处理" value="0" />
              <el-option label="处理中" value="1" />
              <el-option label="已完成" value="2" />
            </el-select>
          </div>
          <div class="filter-item">
            <el-select
              v-model="searchParams.timeliness"
              placeholder="选择工单时效"
            >
              <el-option label="正常" value="0" />
              <el-option label="已逾期" value="1" />
            </el-select>
          </div>
          <div class="filter-item">
            <el-select
              v-model="searchParams.statusfault"
              placeholder="选择故障来源"
            >
              <el-option label="例行转故障" value="0" />
              <el-option label="预约工单" value="1" />
              <el-option label="应急工单" value="2" />
            </el-select>
          </div>
          <div class="filter-actions">
            <button class="btn btn-primary" @click="handleSearch">
              <i class="el-icon-search search-icon" /> 查询
            </button>
            <button class="btn btn-secondary" @click="handleReset">
              <i class="el-icon-refresh reset-icon" /> 重置
            </button>
          </div>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>项目名称</th>
                <th>上报时间</th>
                <th>工单来源</th>
                <th>上报人员</th>
                <th>工单时效</th>
                <th>工单状态</th>
                <th>当前所属人</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <!-- 始终显示无数据状态 -->
              <tr>
                <td colspan="9" class="no-data">
                  <div class="empty-state">
                    <img src="your-xls-icon-path.png" alt="没有数据" class="empty-icon">
                    <p>暂无数据</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 可以在这里添加分页组件 -->
        </div>
      </div>

      <!-- 附加维保 -->
      <div v-show="currentTab === 'additional'">
        <!-- 搜索过滤区域 -->
        <div class="search-filter">
          <div class="filter-item">
            <input
              v-model="searchParams.projectName"
              type="text"
              placeholder="输入项目名称搜索"
              class="filter-input"
            >
          </div>
          <div class="filter-item">
            <el-select
              v-model="searchParams.maintenanceType"
              placeholder="选择工单状态"
            >
              <el-option label="待处理" value="0" />
              <el-option label="处理中" value="1" />
              <el-option label="已完成" value="2" />
            </el-select>
          </div>
          <div class="filter-item">
            <el-select
              v-model="searchParams.timeliness"
              placeholder="选择工单时效"
            >
              <el-option label="正常" value="0" />
              <el-option label="已逾期" value="1" />
            </el-select>
          </div>
          <div class="filter-actions">
            <button class="btn btn-primary" @click="handleSearch">
              <i class="el-icon-search search-icon" /> 查询
            </button>
            <button class="btn btn-secondary" @click="handleReset">
              <i class="el-icon-refresh reset-icon" /> 重置
            </button>
          </div>
        </div>
        <!-- 表格区域 -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>项目名称</th>
                <th>上报时间</th>
                <th>上报人员</th>
                <th>工单时效</th>
                <th>工单状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="9" class="no-data">
                  <div class="empty-state">
                    <img src="your-xls-icon-path.png" alt="没有数据" class="empty-icon">
                    <p>暂无数据</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 工作上报 -->
      <div v-show="currentTab === 'report'">
        <div class="search-filter">
          <div class="filter-item">
            <input
              v-model="searchParams.projectName"
              type="text"
              placeholder="输入项目名称搜索"
              class="filter-input"
            >
          </div>
          <div class="filter-item">
            <el-select
              v-model="searchParams.statusreport"
              placeholder="选择上报类型"
            >
              <el-option label="故障处理" value="0" />
              <el-option label="培训演练" value="1" />
              <el-option label="其他事项" value="2" />
            </el-select>
          </div>
          <div class="filter-item">
            <el-date-picker
              v-model="searchParams.dateRange"
              type="daterange"
              range-separator=" - "
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              class="filter-date"
            />
          </div>
          <div class="filter-actions">
            <button class="btn btn-primary" @click="handleSearch">
              <i class="el-icon-search search-icon" /> 查询
              <!-- <i class="search-icon"/> 查询 -->
            </button>
            <button class="btn btn-secondary" @click="handleReset">
              <i class="el-icon-refresh reset-icon" /> 重置
            </button>
          </div>
        </div>
        <!-- 表格区域 -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>项目名称</th>
                <th>业主单位名称</th>
                <th>上报类型</th>
                <th>上报时间</th>
                <th>上报人员</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="9" class="no-data">
                  <div class="empty-state">
                    <img src="your-xls-icon-path.png" alt="没有数据" class="empty-icon">
                    <p>暂无数据</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaintenanceTasks',
  data() {
    return {
      tabs: [
        { label: '例行维保', value: 'routine' },
        { label: '故障工单', value: 'fault' },
        { label: '附加维保', value: 'additional' },
        { label: '工作上报', value: 'report' }
      ],
      currentTab: 'routine',
      searchParams: {
        routine: { projectName: '', statusroutine: '', timeliness: '' },
        fault: { projectName: '', submitter: '', statusfault: '', source: '' },
        additional: { projectName: '', maintenanceType: '', timeliness: '' },
        report: { projectName: '', statusreport: '', dateRange: [] }
        // projectName: '',
        // submitter: '',
        // status: '',
        // timeliness: '',
        // source: '',
        // dateRange: [], // 新增日期范围字段
        // maintenanceType: ''
      }
    }
  },
  methods: {
    selectTab(tabValue) {
      this.currentTab = tabValue
      this.handleReset()
    },
    handleSearch() {
      console.log('执行搜索:', this.searchParams)
      const [startDate, endDate] = this.searchParams.dateRange || []
      console.log('例行维保搜索参数:', {
        ...this.searchParams,
        startDate,
        endDate
      })
    },
    handleReset() {
      this.searchParams = {
        projectName: '',
        submitter: '',
        status: '',
        timeliness: '',
        source: ''
      }
    }
  }
}
</script>

<style scoped>
/* 原样保留原有样式，这里省略样式部分以节省空间，可根据需要继续使用原样式 */
.work-order-management-page {
  padding: 20px;
}

/* 顶部导航/选项卡 */
.tab-navigation {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab-item {
  padding: 10px 15px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  position: relative;
  margin-right: 10px;
}

.tab-item.active {
  color: #409EFF; /* 选中状态颜色 */
  border-bottom: 2px solid #409EFF; /* 选中状态下划线 */
  font-weight: bold;
}

/* 搜索过滤区域 */
.search-filter {
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  gap: 15px; /* 输入框之间的间隔 */
  margin-bottom: 20px;
  align-items: center; /* 垂直居中对齐 */
}

.filter-item {
    display: flex;
    align-items: center;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  height: 36px; /* 统一高度 */
}

.filter-actions {
  display: flex;
  gap: 10px; /* 按钮之间的间隔 */
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.btn-primary {
  background-color: #409EFF; /* 主色调 */
  color: white;
  text-align: center;
}

.btn-primary:hover {
   background-color: #66b1ff;
}

.btn-secondary {
   background-color: #f0f0f0;
   color: #333;
}

.btn-secondary:hover {
   background-color: #ddd;
}

/* 图标样式 (示例，需要替换为实际的 SVG 或图标字体) */
.search-icon, .reset-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    /* 这里可以添加背景图片或使用图标字体 */
    /* 必要，否则伪元素不显示 */
    /* content: "icon="el-icon-search""; */
}

/* 表格样式 */
.table-container {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow-x: auto; /* 水平滚动 */
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f5f7fa; /* 表头背景色 */
  font-weight: bold;
}

/* 无数据状态 */
.no-data {
  text-align: center;
  padding: 50px 0;
  color: #909399;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty-icon {
    width: 80px; /* 根据图标实际大小调整 */
    height: 80px; /* 根据图标实际大小调整 */
    margin-bottom: 10px;
}

.filter-date {
  width: 260px;
}
</style>
