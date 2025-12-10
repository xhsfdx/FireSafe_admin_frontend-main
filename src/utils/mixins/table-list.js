/**
 * 表格列表通用 Mixin
 * 提供分页、搜索、loading等通用功能
 */
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      filters: {}
    }
  },
  methods: {
    /**
     * 处理分页变化
     */
    handlePageChange(page) {
      this.pagination.page = page
      this.loadData()
    },
    /**
     * 查询 - 重置到第一页并加载数据
     */
    onSearch() {
      this.pagination.page = 1
      this.loadData()
    },
    /**
     * 重置筛选条件
     */
    onReset() {
      this.filters = {}
      this.pagination.page = 1
      this.loadData()
    },
    /**
     * 获取序号（考虑分页）
     */
    getSerialNumber(index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    /**
     * 处理API响应数据
     * @param {Object} res - API响应
     * @param {Function} dataMapper - 数据映射函数（可选）
     */
    handleApiResponse(res, dataMapper = null) {
      if (res && res.success) {
        const list = res.data || []
        this.tableData = dataMapper ? list.map(dataMapper) : list
        
        if (res.pagination) {
          this.pagination.total = res.pagination.total || 0
          this.pagination.page = res.pagination.page || 1
          this.pagination.limit = res.pagination.limit || 10
        } else {
          this.pagination.total = this.tableData.length
        }
        return true
      } else {
        this.tableData = []
        this.pagination.total = 0
        const errorMsg = res?.message || '获取数据失败'
        this.$message.error(errorMsg)
        return false
      }
    },
    /**
     * 处理API错误
     */
    handleApiError(error) {
      console.error('API错误:', error)
      this.tableData = []
      this.pagination.total = 0
      this.$message.error('网络异常或接口出错: ' + (error.message || '未知错误'))
    }
  }
}

