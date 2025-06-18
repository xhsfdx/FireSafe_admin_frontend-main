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

    <!-- 搜索过滤区域 -->
    <div class="search-filter">
      <div class="filter-item">
        <input
          type="text"
          v-model="searchParams.projectName"
          placeholder="输入项目名称搜索"
          class="filter-input"
        />
      </div>
      <div class="filter-item">
        <input
          type="text"
          v-model="searchParams.submitter"
          placeholder="输入上报人员"
          class="filter-input"
        />
      </div>
      <div class="filter-item">
        <select
          v-model="searchParams.status"
          class="filter-select"
        >
          <option value="">选择工单状态</option>
          <!-- 实际应用中这些选项通常从数据中生成 -->
          <option value="pending">待处理</option>
          <option value="processing">处理中</option>
          <option value="completed">已完成</option>
          <option value="canceled">已取消</option>
        </select>
      </div>
       <div class="filter-item">
        <select
          v-model="searchParams.timeliness"
          class="filter-select"
        >
          <option value="">选择工单时效</option>
           <!-- 实际应用中这些选项通常从数据中生成 -->
          <option value="timely">及时</option>
          <option value="overdue">超时</option>
        </select>
      </div>
       <div class="filter-item">
        <select
          v-model="searchParams.source"
          class="filter-select"
        >
          <option value="">选择故障来源</option>
           <!-- 实际应用中这些选项通常从数据中生成 -->
           <option value="user">用户报告</option>
           <option value="system">系统检测</option>
           <option value="other">其他</option>
        </select>
      </div>
      <div class="filter-actions">
        <button class="btn btn-primary" @click="handleSearch">
          <i class="search-icon"></i> 查询
        </button>
        <button class="btn btn-secondary" @click="handleReset">
          <i class="reset-icon"></i> 重置
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
</template>

<script>
export default {
  name: 'Faultworkorder',
  data() {
    return {
      tabs: [
        { label: '例行维保', value: 'routine' },
        { label: '故障工单', value: 'fault' },
        { label: '附加维保', value: 'additional' },
        { label: '工作上报', value: 'report' }
      ],
      currentTab: 'fault', // 默认选中故障工单

      searchParams: { // 搜索过滤条件
        projectName: '',
        submitter: '',
        status: '',
        timeliness: '',
        source: ''
      }

      // 下拉选择框的选项 (直接写在模板中，或者根据需要从固定数据中读取)
      // statusOptions 数组等不再需要
    }
  },
  methods: {
    // 选择顶部选项卡
    selectTab(tabValue) {
      this.currentTab = tabValue
      console.log('切换到选项卡:', tabValue)
      // 切换选项卡后可以考虑重置搜索条件
      this.handleReset();
       // 在这里执行根据不同选项卡可能需要的动作 (例如加载数据，如果将来需要的话)
    },

    // 执行搜索操作
    handleSearch() {
      console.log('执行搜索:', this.searchParams);
      // TODO: 在这里放置查询的逻辑，例如调用后端接口
      // 如果将来需要加载数据，将数据加载逻辑放在这里
    },

    // 重置搜索条件
    handleReset() {
      this.searchParams = {
        projectName: '',
        submitter: '',
        status: '',
        timeliness: '',
        source: '',
      };
      console.log('重置搜索条件');
      // 重置后是否立即执行搜索取决于业务需求
      // this.handleSearch(); // 重置后立即搜索
    },
  },
};
</script>

<style scoped>
/* 页面容器 */
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
  border-radius: 4px;
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
    content: ""; /* 必要，否则伪元素不显示 */
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
</style>
