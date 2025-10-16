# 维护点位管理页面 - 数据问题修复说明

## 问题分析
从数据库截图可以看到，`maintenancepoints` 集合中确实有5条数据，但前端页面没有显示。经过分析发现：

1. **数据源不匹配**: 原来的API调用的是 `MaintenancePlan` 集合，但实际数据存储在 `maintenancepoints` 集合中
2. **数据结构不同**: 数据库中的数据结构与前端期望的格式不匹配

## 解决方案

### 1. 创建新的数据模型
**文件**: `新建文件夹/FireSafe_backend/models/maintenancePoint.model.js`
- 创建了 `MaintenancePoint` 模型来对应 `maintenancepoints` 集合
- 定义了正确的字段结构：`name`, `type`, `address`, `status`, `faultCount`, `task` 等

### 2. 添加新的API接口
**文件**: `新建文件夹/FireSafe_backend/controllers/maintainpoint.controller.js`
- 添加了 `getMaintenancePoints()` 函数
- 直接查询 `maintenancepoints` 集合
- 返回完整的点位数据

### 3. 更新路由配置
**文件**: `新建文件夹/FireSafe_backend/routes/maintainPoint.routes.js`
- 添加了新的路由：`GET /api/point/maintainPoint/list`
- 映射到新的控制器函数

### 4. 更新前端API调用
**文件**: `src/api/maintainPoint.js`
- 添加了 `getMaintenancePoints()` 函数
- 调用新的API接口

### 5. 修改前端组件
**文件**: `src/views/Owner unit management/Maintenance point management.vue`

#### 主要更改：
- 使用新的API接口 `getMaintenancePoints()`
- 调整数据映射逻辑，适配新的数据结构
- 更新表格列显示：
  - 点位名称
  - 点位类型（二维码、NFC、蓝牙、其他）
  - 地址
  - 服务状态
  - 故障次数
- 更新搜索功能，支持按地址搜索
- 调整状态映射逻辑

## 数据映射说明

### 后台数据结构：
```javascript
{
  _id: ObjectId,
  name: "点位名称",
  type: "二维码|NFC|蓝牙|其他",
  address: "详细地址",
  status: "待维护|维护中|已完成|故障",
  faultCount: 0,
  task: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### 前端显示格式：
```javascript
{
  id: point._id,
  name: point.name,
  entrust: "维护点位", // 固定值
  status: "服务中|已到期", // 转换后的状态
  maintType: "点位维保", // 固定值
  pointCount: 1, // 每个点位都是1个
  pointData: point // 完整的点位数据
}
```

## 状态映射规则
- `待维护` → `服务中`
- `维护中` → `服务中`
- `已完成` → `已到期`
- `故障` → `已到期`

## 测试步骤

1. **启动后台服务**:
   ```bash
   cd 新建文件夹/FireSafe_backend
   npm start
   ```

2. **启动前端服务**:
   ```bash
   cd FireSafe_admin_frontend-main
   npm run dev
   ```

3. **访问页面**: 导航到维护点位管理页面

4. **验证数据**: 应该能看到5条维护点位数据

## 预期结果

页面应该显示以下数据：
1. 中梁 - 二维码 - 四川省南充市顺庆区澄泉路中梁壹号院
2. 东门 - 二维码 - 四川省南充市顺庆区澄泉路东门
3. 测试点位 - 二维码 - 测试地址
4. 其他2条数据

## 注意事项

1. 确保后台服务正常运行
2. 确保数据库连接正常
3. 确保用户已登录并具有相应权限
4. 如果仍有问题，请检查浏览器控制台的错误信息