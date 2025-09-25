<template>
  <div class="checkin-region-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <div class="search-filters">
        <el-select v-model="filters.unit" placeholder="请选择单位" class="filter-select">
          <el-option v-for="item in units" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="search-actions">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="main-content">
      <el-table
        v-loading="loading"
        :data="pagedData"
        border
        :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
        empty-text="暂无数据"
        header-cell-class-name="table-header"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="unitName" label="单位名称" align="center" />
        <el-table-column prop="range" label="打卡范围（公里）" align="center" />
        <el-table-column prop="purpose" label="打卡用途" align="center" />
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="viewDetail(row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 底部统计和分页 -->
    <div class="footer-bar">
      <span>共查询到 {{ filteredData.length }} 条</span>
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        :total="filteredData.length"
        @current-change="handlePageChange"
        :page-size-text="'条/页'"
        :total-text="'共 {total} 条'"
        :go-to-text="'前往'"
        :jump-text="'页'"
      />
    </div>

    <!-- 打卡区域编辑弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
      center
      top="60px"
      custom-class="edit-region-dialog"
    >
      <span slot="title" style="font-size:22px;font-weight: bold;">
        打卡范围编辑
      </span>
      <div class="form-area">
        <el-form :model="dialogData" label-width="90px" label-position="top">
          <el-form-item label="单位名称">
            <el-input v-model="dialogData.unitName" readonly />
          </el-form-item>
          <el-form-item label="* 定位半径(公里)">
            <div class="range-row">
              <el-button :disabled="dialogData.range <= 1" @click="adjustRange(-1)">-</el-button>
              <el-input
                v-model.number="dialogData.range"
                type="number"
                min="1"
                max="20"
                style="width:80px;margin:0 8px;"
                :readonly="true"
              />
              <el-button :disabled="dialogData.range >= 20" @click="adjustRange(1)">+</el-button>
            </div>
          </el-form-item>
          <div class="map-img-wrap">
            <!-- 使用 vue-amap 高德地图组件 -->
            <el-amap
              :center="mapCenter"
              :zoom="zoom"
              style="width:100%;height:260px"
            >
              <el-amap-circle
                :center="mapCenter"
                :radius="dialogData.range * 1000"
                stroke-color="#409EFF"
                fill-color="#79bbff88"
              />
              <el-amap-marker :position="mapCenter" />
            </el-amap>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEdit">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckinRegions, updateCheckinRegion, getAllUnits } from '@/api/checkinRegion'

export default {
  name: 'CheckInRegion',
  data() {
    return {
      filters: { unit: '' },
      units: [],
      rawData: [],
      filteredData: [],
      pagedData: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
      // 弹窗相关
      dialogVisible: false,
      dialogData: {
        unitName: '',
        range: 2,
        purpose: '外出维保打卡',
        coordinates: {
          lng: 106.110698,
          lat: 30.799492
        },
        address: ''
      },
      dialogIndex: -1, // 标记当前编辑的行
      // 地图相关
      mapCenter: [106.110698, 30.799492], // 默认南充
      zoom: 14
    }
  },
  watch: {
    currentPage() { this.updatePagedData() }
  },
  created() {
    this.loadData()
    this.loadUnits()
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize
        }
        
        if (this.filters.unit) {
          params.unitName = this.filters.unit
        }

        console.log('请求参数:', params)
        console.log('当前token:', this.$store.getters.token)
        const res = await getCheckinRegions(params)
        console.log('打卡区域API响应:', res)
        if (res.success) {
          this.rawData = res.data || []
          this.filteredData = this.rawData
          this.updatePagedData()
          console.log('加载的数据:', this.rawData)
        } else {
          this.$message.error(res.message || '加载数据失败')
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },

    // 加载单位列表
    async loadUnits() {
      try {
        console.log('加载单位列表...')
        const res = await getAllUnits()
        console.log('单位列表API响应:', res)
        if (res.success) {
          this.units = res.data || []
          console.log('加载的单位列表:', this.units)
        }
      } catch (error) {
        console.error('加载单位列表失败:', error)
      }
    },

    onSearch() {
      this.currentPage = 1
      this.loadData()
    },
    
    onReset() {
      this.filters.unit = ''
      this.currentPage = 1
      this.loadData()
    },
    
    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      this.pagedData = this.filteredData.slice(start, start + this.pageSize)
    },
    
    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },
    
    viewDetail(row) {
      this.dialogIndex = this.rawData.findIndex(item => item._id === row._id)
      this.dialogData = { 
        ...row,
        coordinates: row.coordinates || { lng: 106.110698, lat: 30.799492 }
      }
      
      // 设置地图中心点
      if (row.coordinates && row.coordinates.lng && row.coordinates.lat) {
        this.mapCenter = [row.coordinates.lng, row.coordinates.lat]
      } else {
        this.mapCenter = [106.110698, 30.799492] // 默认南充
      }
      this.dialogVisible = true
    },
    
    adjustRange(delta) {
      let val = this.dialogData.range + delta
      if (val < 1) val = 1
      if (val > 20) val = 20
      this.dialogData.range = val
    },
    
    async saveEdit() {
      if (this.dialogIndex > -1) {
        try {
          const updateData = {
            range: this.dialogData.range,
            coordinates: this.dialogData.coordinates,
            address: this.dialogData.address || ''
          }
          
          const res = await updateCheckinRegion(this.dialogData._id, updateData)
          if (res.success) {
            this.$message.success('保存成功')
            this.dialogVisible = false
            this.loadData() // 重新加载数据
          } else {
            this.$message.error(res.message || '保存失败')
          }
        } catch (error) {
          console.error('保存失败:', error)
          this.$message.error('保存失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.checkin-region-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  min-width: 800px;
  padding: 20px;
  box-sizing: border-box;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-select {
  width: 200px;
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-content {
  flex: 1;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: auto;
}

.footer-bar {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 0 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.table-header {
  background: #f5f7fa !important;
  color: #606266 !important;
  font-weight: 600 !important;
}

/* 弹窗样式 */
.edit-region-dialog {
  border-radius: 12px;
}
.form-area {
  margin: 10px 0 0 0;
}
.range-row {
  display: flex;
  align-items: center;
}
.map-img-wrap {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 16px;
}
.dialog-footer {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .checkin-region-page {
    padding: 16px;
  }
  
  .search-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .search-filters,
  .search-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .checkin-region-page {
    padding: 12px;
    min-width: auto;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .search-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .search-actions .el-button {
    width: 100%;
  }
}
</style>
