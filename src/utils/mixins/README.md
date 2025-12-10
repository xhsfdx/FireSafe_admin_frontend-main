# 公共 Mixins 使用说明

## 概述

这些 mixins 用于简化 Vue 组件中的常见功能，减少重复代码。

## TableList Mixin

用于表格列表页面，提供分页、搜索、loading 等通用功能。

### 使用方法

```javascript
import tableListMixin from '@/utils/mixins/table-list'

export default {
  mixins: [tableListMixin],
  data() {
    return {
      filters: {
        // 你的筛选条件
      }
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.filters
        }
        const res = await yourApiFunction(params)
        
        // 使用 mixin 提供的方法处理响应
        const dataMapper = (item) => {
          // 数据映射逻辑
          return mappedItem
        }
        this.handleApiResponse(res, dataMapper)
      } catch (e) {
        this.handleApiError(e)
      } finally {
        this.loading = false
      }
    }
  }
}
```

### 提供的属性和方法

**Data:**
- `loading`: 加载状态
- `tableData`: 表格数据
- `pagination`: 分页信息 `{ page, limit, total }`
- `filters`: 筛选条件（需要在组件中定义）

**Methods:**
- `handlePageChange(page)`: 处理分页变化
- `onSearch()`: 查询（重置到第一页）
- `onReset()`: 重置筛选条件
- `getSerialNumber(index)`: 获取序号（考虑分页）
- `handleApiResponse(res, dataMapper)`: 处理API响应
- `handleApiError(error)`: 处理API错误

## FormHandler Mixin

用于表单页面，提供表单验证、提交、错误处理等功能。

### 使用方法

```javascript
import formHandlerMixin from '@/utils/mixins/form-handler'

export default {
  mixins: [formHandlerMixin],
  methods: {
    async handleSave() {
      await this.handleSubmit(
        async () => {
          return await saveApi(this.formData)
        },
        '保存成功',
        (res) => {
          // 成功回调
          this.$router.back()
        }
      )
    }
  }
}
```

### 提供的属性和方法

**Data:**
- `formLoading`: 表单提交状态
- `formData`: 表单数据
- `formRules`: 表单验证规则（需要在组件中定义）

**Methods:**
- `validateForm(formRef)`: 验证表单
- `resetForm(formRef)`: 重置表单
- `handleSubmit(submitFn, successMsg, onSuccess)`: 处理表单提交

## 状态工具函数

位置：`@/utils/status-helper.js`

### 可用函数

- `getStatusTagType(status, statusMap)`: 获取状态标签类型
- `getStatusDisplayText(status, statusMap)`: 获取状态显示文本
- `getRemainDays(endDate)`: 计算剩余天数
- `formatAmount(amount, prefix)`: 格式化金额
- `formatDate(date, format)`: 格式化日期

### 使用示例

```javascript
import { getStatusTagType, getStatusDisplayText, formatAmount } from '@/utils/status-helper'

// 在模板中使用
<el-tag :type="getStatusTagType(row.status)">
  {{ getStatusDisplayText(row.status) }}
</el-tag>

// 格式化金额
{{ formatAmount(item.amount) }}
```

## 迁移指南

### 从旧代码迁移到使用 Mixins

1. **导入 mixin**
```javascript
import tableListMixin from '@/utils/mixins/table-list'
```

2. **添加到 mixins 数组**
```javascript
export default {
  mixins: [tableListMixin],
  // ...
}
```

3. **移除重复的 data 属性**（如果 mixin 已提供）
```javascript
// 移除这些，因为 mixin 已提供
// loading: false,
// tableData: [],
// pagination: { page: 1, limit: 10, total: 0 }
```

4. **使用 mixin 提供的方法替换重复代码**
```javascript
// 旧代码
handlePageChange(page) {
  this.pagination.page = page
  this.loadData()
}

// 新代码：直接使用 mixin 提供的方法，无需重写
```

5. **使用工具函数替换重复的逻辑**
```javascript
// 旧代码
getStatusTagType(status) {
  const statusMap = { ... }
  return statusMap[status] || 'info'
}

// 新代码
import { getStatusTagType } from '@/utils/status-helper'
// 直接使用 getStatusTagType(status)
```

## 注意事项

1. 如果组件需要自定义某些方法，可以在组件中重写该方法
2. Mixin 的方法会与组件方法合并，组件方法优先级更高
3. 确保在 `loadData` 方法中正确设置 `this.loading = false`

