# 维护点位管理页面 - 前后端集成说明

## 概述
将维护点位管理页面从静态数据改为从后台API动态获取数据。

## 修改内容

### 1. 创建前端API文件
**文件**: `src/api/maintainPoint.js`
- 添加了 `getMaintainPointPlans()` 函数用于获取维保点位计划列表
- 添加了 `getPlanCheckpoints()` 函数用于获取指定计划的点位列表  
- 添加了 `createOrUpdateCheckpoint()` 函数用于创建或更新点位信息

### 2. 修改Vue组件
**文件**: `src/views/Owner unit management/Maintenance point management.vue`

#### 主要更改：
- 导入 `getMaintainPointPlans` API函数
- 移除静态数据 `allData`，改为从API获取
- 添加 `loading` 状态管理
- 添加 `loadData()` 方法用于从后台获取数据
- 添加 `getServiceStatus()` 方法用于状态转换
- 更新 `viewDetail()` 和 `addPoint()` 方法，支持路由跳转
- 在表格中添加加载状态显示
- 添加"刷新数据"按钮

#### 数据映射：
后台返回的维保计划数据会被转换为前端表格所需的格式：
```javascript
{
  id: plan._id,
  name: plan.projectName || plan.projectId?.name || '未命名项目',
  entrust: plan.ownerName || plan.projectId?.ownerCompany || '未知委托单位', 
  status: this.getServiceStatus(plan),
  maintType: plan.maintenanceMethod || '点位维保',
  pointCount: plan.checkpoints ? plan.checkpoints.length : 0,
  planData: plan
}
```

## 后台API接口

### 获取维保点位计划列表
- **URL**: `GET /api/point/maintainPoint`
- **功能**: 获取所有维保方式为"点位维保"的计划
- **返回数据**: 包含项目信息、委托单位、维保方式、点位数量等

### 获取指定计划的点位详情
- **URL**: `GET /api/point/maintainPoint/:planId/checkpoint`  
- **功能**: 获取特定计划的详细点位信息
- **返回数据**: 包含计划信息和所有关联的点位详情

### 创建或更新点位
- **URL**: `POST /api/point/maintainPoint/checkpoint`
- **功能**: 创建新的点位或更新现有点位信息

## 使用说明

1. **启动后台服务**: 确保后台服务运行在 `http://localhost:5000`
2. **启动前端服务**: 运行 `npm run dev` 启动前端开发服务器
3. **访问页面**: 导航到维护点位管理页面
4. **数据加载**: 页面会自动从后台API加载数据
5. **搜索过滤**: 支持按项目名称、委托单位、服务状态进行搜索
6. **刷新数据**: 点击"刷新数据"按钮重新从后台获取最新数据

## 错误处理

- 添加了完整的错误处理机制
- 网络请求失败时会显示错误提示
- 数据加载过程中显示加载状态
- 空数据时显示友好的空状态页面

## 注意事项

1. 确保后台服务正常运行
2. 确保用户已登录并具有相应的权限
3. 如果API返回的数据结构与预期不符，可能需要调整数据映射逻辑
4. 路由跳转功能需要确保目标页面已正确配置