<template>
  <div class="checkin-region-page">
    <!-- 查询栏 -->
    <div class="search-bar">
      <el-select v-model="filters.unit" placeholder="请选择单位" style="width: 200px; margin-right: 12px">
        <el-option v-for="item in units" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button type="primary" style="margin-right: 8px" @click="onSearch">查询</el-button>
      <el-button @click="onReset">重置</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="main-content">
      <el-table
        :data="pagedData"
        border
        :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="unitName" label="单位名称" />
        <el-table-column prop="range" label="打卡范围（公里）" />
        <el-table-column prop="purpose" label="打卡用途" />
        <el-table-column label="操作" width="100" align="right">
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
export default {
  name: 'CheckInRegion',
  data() {
    return {
      filters: { unit: '' },
      units: ['小学', '高坪汽车站'],
      rawData: [
        { unitName: '小学', range: 2, purpose: '外出维保打卡' },
        { unitName: '高坪汽车站', range: 2, purpose: '外出维保打卡' }
      ],
      filteredData: [],
      pagedData: [],
      currentPage: 1,
      pageSize: 10,
      // 弹窗相关
      dialogVisible: false,
      dialogData: {
        unitName: '',
        range: 2
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
    this.filteredData = this.rawData
    this.updatePagedData()
  },
  methods: {
    onSearch() {
      this.filteredData = this.filters.unit
        ? this.rawData.filter(d => d.unitName === this.filters.unit)
        : this.rawData
      this.currentPage = 1
      this.updatePagedData()
    },
    onReset() {
      this.filters.unit = ''
      this.filteredData = this.rawData
      this.currentPage = 1
      this.updatePagedData()
    },
    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      this.pagedData = this.filteredData.slice(start, start + this.pageSize)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.updatePagedData()
    },
    viewDetail(row) {
      this.dialogIndex = this.rawData.findIndex(item => item.unitName === row.unitName)
      this.dialogData = { ...row }
      // 按单位定位地图中心，建议后端实际配置真实坐标
      if (row.unitName === '高坪汽车站') {
        this.mapCenter = [106.130833, 30.784689]
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
    saveEdit() {
      if (this.dialogIndex > -1) {
        this.$set(this.rawData, this.dialogIndex, { ...this.dialogData })
        this.onSearch()
        this.dialogVisible = false
        this.$message.success('保存成功')
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
  background: #fff;
  min-width: 800px;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 8px;
  padding-left: 10px;
}
.main-content {
  padding: 0 40px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.footer-bar {
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 0 36px 0 0;
  box-shadow: 0 -2px 6px -4px #eee;
  z-index: 10;
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
</style>
