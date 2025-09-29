
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
        <el-option label="未开始" value="未开始" />
        <el-option label="进行中" value="进行中" />
        <el-option label="已完成" value="已完成" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
      <el-button
        type="success"
        icon="el-icon-check"
        class="green-btn"
        :disabled="multipleSelection.length === 0"
        @click="batchCreatePlans"
      >
        一键制定所选计划 ({{ multipleSelection.length }})
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%;"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <!-- <el-table-column v-show="false" prop="_id" label="项目ID" align="center"  /> -->
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="ownerName" label="业主单位名称" align="center" />
      <el-table-column prop="planType" label="计划类型" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.planType === '月' ? 'primary' : 'warning'"
            size="small"
            style="font-weight: bold;"
          >
            {{ row.planType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="maintenanceMethod" label="维保方式" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="getMaintenanceMethodType(row.maintenanceMethod)"
            size="small"
            style="font-weight: bold;"
          >
            {{ row.maintenanceMethod }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="planDefinedStatus" label="制定情况" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.planDefinedStatus === '已制定' ? 'success' : 'danger'"
            size="small"
            style="font-weight: bold;"
          >
            {{ row.planDefinedStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="planStatus" label="计划状态" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="getStatusType(row.planStatus)"
            size="small"
            style="font-weight: bold;"
          >
            {{ row.planStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{ row }">
          <template v-if="row.planDefinedStatus === '未制定'">
            <el-link type="success" @click="createPlan(row)">制定</el-link>
            <el-link type="danger" style="margin-left: 8px;" @click="delRow(row)">删除</el-link>
          </template>
          <template v-else>
            <el-link type="primary" @click="showProject(row)">项目详情</el-link>
            <el-link type="info" style="margin: 0 8px;" @click="showPlan(row)">任务详情</el-link>
            <el-link type="danger" @click="delRow(row)">删除</el-link>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 右下角设置按钮 -->
    <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle />

    <!-- 底部分页与统计 -->
    <div class="table-footer">
      <div class="total">共查询到 {{ tableData.length }} 条</div>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="tableData.length"
        style="float:right"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getMaintainPlans, deleteMaintenancePlan } from '@/api/maintainPlan'
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
      allData: [],
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.onLoad()
    // 监听计划状态更新事件
    this.$bus && this.$bus.$on('plan-status-updated', this.handlePlanStatusUpdate)

    // 启动定时器检查状态更新
    this.statusCheckTimer = setInterval(() => {
      this.checkForStatusUpdate()
    }, 2000) // 每2秒检查一次

    // 检查批量制定进度
    this.checkBatchCreateProgress()
  },
  beforeDestroy() {
    // 移除事件监听器
    this.$bus && this.$bus.$off('plan-status-updated', this.handlePlanStatusUpdate)
    // 清除定时器
    if (this.statusCheckTimer) {
      clearInterval(this.statusCheckTimer)
    }
  },
  activated() {
    // 当页面被激活时（比如从其他页面返回），检查是否有状态更新
    this.checkForStatusUpdate()
    // 重新加载数据
    this.onLoad()
    // 检查批量制定进度
    this.checkBatchCreateProgress()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 检查是否从制定页面返回，并且有状态更新参数
      if ((from.name === 'PointMaintenancePlan' || from.name === 'SystemMaintenancePlan') && to.query.planUpdated) {
        console.log('路由参数:', to.query)
        // 延迟执行，确保数据已加载
        setTimeout(() => {
          if (to.query.rowIndex !== undefined) {
            // 使用行索引直接更新
            vm.updatePlanStatusByIndex(parseInt(to.query.rowIndex), '已制定', '进行中')
          } else {
            // 使用ID更新
            vm.updatePlanStatus(to.query.planId, '已制定', '进行中')
          }
        }, 500)
      }
    })
  },
  methods: {
    onSearch() {
      // 根据筛选条件过滤数据
      const { name, makingStatus, planType, planStatus } = this.filters
      this.tableData = this.allData.filter(item => {
        const nameMatch = !name || (item.projectName && item.projectName.toLowerCase().includes(name.toLowerCase()))
        const makingStatusMatch = !makingStatus || item.planDefinedStatus === makingStatus
        const planTypeMatch = !planType || item.planType === planType
        const planStatusMatch = !planStatus || item.planStatus === planStatus

        return nameMatch && makingStatusMatch && planTypeMatch && planStatusMatch
      })

      // 重置到第一页
      this.currentPage = 1
      this.$message.success(`查询完成，共找到 ${this.tableData.length} 条记录`)
    },
    async onLoad() {
      try {
        // 传递参数获取所有数据，设置一个足够大的limit
        const res = await getMaintainPlans({
          page: 1,
          limit: 1000 // 设置足够大的limit来获取所有数据
        })
        console.log('API响应:', res)

        // 检查数据重复问题
        const rawData = res.data || []
        console.log('原始数据:', rawData)

        // 去重处理 - 根据_id去重，如果_id相同则根据项目名称和业主单位名称去重
        const uniqueData = rawData.filter((item, index, self) => {
          // 首先根据_id去重
          const idIndex = self.findIndex(t => t._id === item._id)
          if (idIndex !== index) return false

          // 如果_id相同，则根据项目名称和业主单位名称组合去重
          const businessKey = `${item.projectName || ''}_${item.ownerName || ''}`
          const businessIndex = self.findIndex(t =>
            `${t.projectName || ''}_${t.ownerName || ''}` === businessKey
          )

          return businessIndex === index
        })

        // 确保每个项目都有唯一的ID
        const processedData = uniqueData.map((item, index) => {
          if (!item._id) {
            // 如果没有_id，生成一个临时的唯一ID
            item._id = `temp_${Date.now()}_${index}`
            console.warn('项目缺少_id，已生成临时ID:', item._id, item)
          }
          return item
        })

        console.log('去重前数据量:', rawData.length)
        console.log('去重后数据量:', uniqueData.length)
        console.log('处理后的数据:', processedData)
        console.log('API返回的total字段:', res.total)

        if (rawData.length !== uniqueData.length) {
          console.warn('发现重复数据，已自动去重')
        }

        // 如果API返回的total和实际数据量不匹配，给出警告
        if (res.total && res.total !== rawData.length) {
          console.warn(`API返回total: ${res.total}, 实际数据量: ${rawData.length}`)
        }

        this.allData = processedData
        this.tableData = [...this.allData]

        // 显示更详细的信息
        this.$message.success(`数据加载成功，共 ${processedData.length} 条记录`)

        // 如果数据量很少，给出提示
        if (processedData.length < 5) {
          console.warn('数据量较少，可能存在问题')
          this.$message.warning(`当前只加载到 ${processedData.length} 条记录，如果预期应该有更多数据，请检查后端数据库`)
        }
      } catch (error) {
        this.$message.error(`数据加载失败：${error.msg || error.message}`)
        this.allData = []
        this.tableData = []
      }
    },
    onReset() {
      // 重置筛选条件
      this.filters = {
        name: '',
        makingStatus: '',
        planType: '',
        planStatus: ''
      }

      // 恢复显示所有数据
      this.tableData = [...this.allData]
      this.currentPage = 1

      this.$message.success('筛选条件已重置')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(page) {
      this.currentPage = page
    },
    getStatusType(status) {
      switch (status) {
        case '未开始':
          return 'info'
        case '进行中':
          return 'warning'
        case '已完成':
          return 'success'
        default:
          return 'info'
      }
    },
    getMaintenanceMethodType(method) {
      switch (method) {
        case '点位维保':
          return 'success' // 绿色
        case '系统维保':
          return 'primary' // 蓝色
        case '第三方维保':
          return 'warning' // 橙色
        default:
          return 'info' // 灰色
      }
    },
    showPlan(row) {
      // 跳转到任务列表页面（显示该计划下的所有任务）
      console.log('🔍 准备跳转到任务列表页面，数据:', row)
      this.$router.push({
        name: 'OwnerTaskDetail', // 跳转到任务列表页面
        query: {
          planId: row._id, // 传递计划ID
          projectId: row.projectId || row._id, // 传递项目ID
          projectName: row.projectName // 传递项目名称
        }
      })
    },
    showProject(row) {
      console.log('🔍 准备跳转到项目详情页面，行数据:', row)
      console.log('🔍 可用的ID字段:', {
        _id: row._id,
        projectId: row.projectId,
        contractId: row.contractId
      })

      // 优先使用contractId，如果没有则使用projectId
      const targetId = row.contractId || row.projectId

      if (!targetId) {
        console.error('❌ 没有可用的项目ID或合同ID')
        this.$message.error('无法获取项目详情：缺少项目ID或合同ID')
        return
      }

      console.log('🎯 最终使用的目标ID:', targetId)

      this.$router.push({
        name: 'UnitDetail',
        query: {
          id: targetId,
          contractId: row.contractId,
          projectId: row.projectId
        }
      })
    },
    createPlan(row) {
      this.$confirm(`确定要为项目"${row.projectName}"制定维护计划吗？`, '制定计划', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 根据维保方式跳转到不同的制定页面
        this.navigateToPlanPage(row)
      }).catch(() => {
        this.$message.info('已取消制定计划')
      })
    },

    // 根据维保方式跳转到对应的制定页面
    navigateToPlanPage(row) {
      const { maintenanceMethod, projectName, ownerName, planType, _id } = row

      console.log('准备跳转到制定页面，行数据:', row)
      console.log('提取的参数:', { maintenanceMethod, projectName, ownerName, planType, _id })

      // 准备路由参数
      const routeParams = {
        projectName: projectName || '',
        ownerName: ownerName || '',
        planType: planType || '月',
        planId: _id || '',
        projectId: row.projectId || '',
        rowIndex: this.tableData.indexOf(row) // 传递行索引，用于后续更新
      }

      console.log('准备传递的路由参数:', routeParams)

      try {
        if (maintenanceMethod === '系统维保') {
          // 跳转到系统维保制定页面
          this.$router.push({
            name: 'SystemMaintenancePlan',
            query: routeParams
          })
          this.$message.success(`正在为项目"${projectName}"制定系统维保计划`)
        } else if (maintenanceMethod === '点位维保') {
          // 跳转到点位维保制定页面
          this.$router.push({
            name: 'PointMaintenancePlan',
            query: routeParams
          })
          this.$message.success(`正在为项目"${projectName}"制定点位维保计划`)
        } else {
          // 未知的维保方式，显示错误信息
          this.$message.error(`未知的维保方式：${maintenanceMethod}`)
          console.error('未知的维保方式:', maintenanceMethod)
        }
      } catch (error) {
        console.error('页面跳转失败:', error)
        this.$message.error('页面跳转失败，请重试')
      }
    },
    // 检查localStorage中的状态更新信息
    checkForStatusUpdate() {
      try {
        const statusUpdate = localStorage.getItem('planStatusUpdate')
        if (statusUpdate) {
          const updateData = JSON.parse(statusUpdate)
          console.log('发现状态更新信息:', updateData)
          // 检查时间戳，如果超过5分钟则忽略
          if (Date.now() - updateData.timestamp < 5 * 60 * 1000) {
            console.log('应用状态更新:', updateData)
            this.updatePlanStatus(updateData.planId, updateData.planDefinedStatus, updateData.planStatus)
            // 清除localStorage中的更新信息
            localStorage.removeItem('planStatusUpdate')
            console.log('状态更新完成，已清除localStorage')
          } else {
            console.log('状态更新信息已过期，清除')
            localStorage.removeItem('planStatusUpdate')
          }
        }
      } catch (error) {
        console.error('检查状态更新失败:', error)
      }
    },
    // 更新计划状态
    updatePlanStatus(planId, definedStatus, planStatus) {
      console.log('开始更新计划状态:', { planId, definedStatus, planStatus })
      console.log('当前allData:', this.allData)
      console.log('当前tableData:', this.tableData)

      // 在allData和tableData中查找并更新对应的计划
      let found = false
      const updateItem = (item) => {
        console.log('检查项目:', item._id, item.planId, '目标ID:', planId)
        if (item._id === planId || item.planId === planId) {
          console.log('找到匹配项目，更新状态:', item)
          // 使用Vue.set确保响应式更新
          this.$set(item, 'planDefinedStatus', definedStatus)
          this.$set(item, 'planStatus', planStatus)
          found = true
          return true
        }
        return false
      }

      // 更新allData
      this.allData.forEach(updateItem)
      // 更新tableData
      this.tableData.forEach(updateItem)

      console.log('更新后allData:', this.allData)
      console.log('更新后tableData:', this.tableData)
      console.log('是否找到匹配项:', found)

      // 强制更新视图
      this.$forceUpdate()

      if (found) {
        this.$message.success('计划状态已更新')

        // 检查是否在批量制定过程中，如果是则清除标记
        this.clearBatchCreateIfCompleted()
      } else {
        this.$message.warning('未找到对应的计划项目')
      }
    },
    // 通过行索引更新计划状态
    updatePlanStatusByIndex(rowIndex, definedStatus, planStatus) {
      console.log('通过行索引更新状态:', { rowIndex, definedStatus, planStatus })
      console.log('当前tableData长度:', this.tableData.length)
      console.log('当前allData长度:', this.allData.length)

      // 如果数据还没有加载完成，延迟执行
      if (this.tableData.length === 0 || this.allData.length === 0) {
        console.log('数据未加载完成，延迟执行状态更新')
        setTimeout(() => {
          this.updatePlanStatusByIndex(rowIndex, definedStatus, planStatus)
        }, 1000)
        return
      }

      if (rowIndex >= 0 && rowIndex < this.tableData.length) {
        // 更新tableData中的对应项
        const tableItem = this.tableData[rowIndex]
        console.log('更新tableData项:', tableItem)
        // 使用Vue.set确保响应式更新
        this.$set(tableItem, 'planDefinedStatus', definedStatus)
        this.$set(tableItem, 'planStatus', planStatus)

        // 在allData中找到对应的项并更新
        const allDataIndex = this.allData.findIndex(item =>
          item._id === tableItem._id ||
          item.projectId === tableItem.projectId ||
          item.projectName === tableItem.projectName
        )

        if (allDataIndex >= 0) {
          console.log('找到allData对应项:', this.allData[allDataIndex])
          // 使用Vue.set确保响应式更新
          this.$set(this.allData[allDataIndex], 'planDefinedStatus', definedStatus)
          this.$set(this.allData[allDataIndex], 'planStatus', planStatus)
        }

        // 强制更新视图
        this.$forceUpdate()
        this.$message.success('计划状态已更新')
        console.log('状态更新完成')
      } else {
        console.warn('行索引超出范围，使用ID方式更新:', rowIndex)
        // 如果行索引超出范围，尝试使用ID方式更新
        // 这里可以添加备用更新逻辑
      }
    },
    // 处理计划状态更新事件
    handlePlanStatusUpdate(updateData) {
      console.log('收到计划状态更新事件:', updateData)
      this.updatePlanStatus(updateData.planId, updateData.planDefinedStatus, updateData.planStatus)
    },
    async delRow(row) {
      this.$confirm('确定要删除这条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          // 调用后端API删除
          await deleteMaintenancePlan(row._id)

          // 从本地数据中移除
          this.tableData = this.tableData.filter(item => item._id !== row._id)
          this.allData = this.allData.filter(item => item._id !== row._id)

          this.$message.success('删除成功')
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error(`删除失败：${error.message || '请重试'}`)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    batchCreatePlans() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择要制定计划的记录')
        return
      }

      // 检查选中的记录是否都是未制定状态
      const unformulatedPlans = this.multipleSelection.filter(item => item.planDefinedStatus === '未制定')
      if (unformulatedPlans.length === 0) {
        this.$message.warning('选中的记录中没有未制定的计划')
        return
      }

      if (unformulatedPlans.length !== this.multipleSelection.length) {
        this.$message.warning(`选中的 ${this.multipleSelection.length} 条记录中，只有 ${unformulatedPlans.length} 条是未制定状态，将只为未制定的记录制定计划`)
      }

      this.$confirm(`确定要为选中的 ${unformulatedPlans.length} 条未制定记录制定计划吗？`, '批量制定计划', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 开始批量制定流程
        this.startBatchCreateProcess(unformulatedPlans)
      }).catch(() => {
        this.$message.info('已取消批量制定')
      })
    },

    // 开始批量制定流程
    startBatchCreateProcess(plans) {
      if (plans.length === 0) {
        this.$message.warning('没有需要制定的计划')
        return
      }

      // 按维保方式分组
      const groupedPlans = this.groupPlansByMaintenanceMethod(plans)

      // 显示分组信息
      this.showBatchCreateDialog(groupedPlans)
    },

    // 按维保方式分组
    groupPlansByMaintenanceMethod(plans) {
      const groups = {
        '点位维保': [],
        '系统维保': [],
        '第三方维保': []
      }

      plans.forEach(plan => {
        const method = plan.maintenanceMethod || '系统维保'
        if (groups[method]) {
          groups[method].push(plan)
        } else {
          groups['系统维保'].push(plan) // 默认归类到系统维保
        }
      })

      // 过滤掉空的分组
      return Object.keys(groups).reduce((result, key) => {
        if (groups[key].length > 0) {
          result[key] = groups[key]
        }
        return result
      }, {})
    },

    // 显示批量制定对话框
    showBatchCreateDialog(groupedPlans) {
      const groupCounts = Object.keys(groupedPlans).map(method =>
        `${method}: ${groupedPlans[method].length}条`
      ).join('，')

      this.$confirm(
        `检测到以下维保方式：${groupCounts}\n\n由于不同维保方式的制定流程不同，建议分别制定。\n\n是否继续批量制定？`,
        '批量制定计划确认',
        {
          confirmButtonText: '继续制定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: false
        }
      ).then(() => {
        // 开始逐个制定
        this.processBatchCreate(groupedPlans)
      }).catch(() => {
        this.$message.info('已取消批量制定')
      })
    },

    // 处理批量制定
    processBatchCreate(groupedPlans) {
      const allPlans = []
      Object.keys(groupedPlans).forEach(method => {
        allPlans.push(...groupedPlans[method])
      })

      // 显示进度提示
      this.$message.info(`开始批量制定 ${allPlans.length} 条计划，请按提示操作`)

      // 逐个制定计划
      this.createPlansSequentially(allPlans, 0)
    },

    // 逐个制定计划
    createPlansSequentially(plans, index) {
      if (index >= plans.length) {
        this.$message.success(`批量制定完成！共处理 ${plans.length} 条计划`)
        this.multipleSelection = []
        return
      }

      const currentPlan = plans[index]
      const progress = `(${index + 1}/${plans.length})`

      this.$confirm(
        `${progress} 正在为项目"${currentPlan.projectName}"制定${currentPlan.maintenanceMethod}计划\n\n点击确定跳转到制定页面，完成后返回继续下一个`,
        '制定计划',
        {
          confirmButtonText: '跳转制定',
          cancelButtonText: '跳过',
          type: 'info'
        }
      ).then(() => {
        // 跳转到制定页面
        this.navigateToPlanPage(currentPlan)

        // 设置一个标记，表示正在批量制定中
        localStorage.setItem('batchCreateInProgress', JSON.stringify({
          plans: plans,
          currentIndex: index,
          timestamp: Date.now()
        }))
      }).catch(() => {
        // 跳过当前计划，继续下一个
        this.$message.info(`已跳过项目"${currentPlan.projectName}"`)
        this.createPlansSequentially(plans, index + 1)
      })
    },

    // 检查是否有批量制定进行中
    checkBatchCreateProgress() {
      try {
        const batchData = localStorage.getItem('batchCreateInProgress')
        if (batchData) {
          const data = JSON.parse(batchData)
          // 检查时间戳，如果超过30分钟则清除
          if (Date.now() - data.timestamp < 30 * 60 * 1000) {
            console.log('检测到批量制定进行中:', data)
            // 继续批量制定流程
            this.createPlansSequentially(data.plans, data.currentIndex + 1)
          } else {
            console.log('批量制定数据已过期，清除')
            localStorage.removeItem('batchCreateInProgress')
          }
        }
      } catch (error) {
        console.error('检查批量制定进度失败:', error)
        localStorage.removeItem('batchCreateInProgress')
      }
    },

    // 检查并清除批量制定标记（如果已完成）
    clearBatchCreateIfCompleted() {
      try {
        const batchData = localStorage.getItem('batchCreateInProgress')
        if (batchData) {
          const data = JSON.parse(batchData)
          // 如果当前计划已制定完成，清除批量制定标记
          if (data.currentIndex >= data.plans.length - 1) {
            console.log('批量制定已完成，清除标记')
            localStorage.removeItem('batchCreateInProgress')
            this.$message.success('批量制定流程已完成！')
          }
        }
      } catch (error) {
        console.error('清除批量制定标记失败:', error)
        localStorage.removeItem('batchCreateInProgress')
      }
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
