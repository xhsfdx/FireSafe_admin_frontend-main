<template>
  <div class="checkin-region-page">
    <!-- 表格区域 -->
    <div class="main-content">
      <el-table
        v-loading="loading"
        :data="projectList"
        border
        :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
        empty-text="暂无项目数据"
        header-cell-class-name="table-header"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="name" label="项目名称" align="center" />
        <el-table-column prop="address" label="项目地址" align="center" show-overflow-tooltip />
        <el-table-column label="签到范围（公里）" align="center" width="200">
          <template slot-scope="{ row }">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <el-button 
                :disabled="getCheckinRange(row) <= 1" 
                size="mini"
                @click="adjustProjectRange(row, -1)"
              >-</el-button>
              <el-input
                v-model.number="row.checkinRange"
                type="number"
                min="1"
                max="20"
                style="width:80px;"
                @blur="saveProjectRange(row)"
                @keyup.enter.native="saveProjectRange(row)"
              />
              <el-button 
                :disabled="getCheckinRange(row) >= 20" 
                size="mini"
                @click="adjustProjectRange(row, 1)"
              >+</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{ row }">
            <el-tag v-if="row.checkinRegionId" type="success" size="small">已设置</el-tag>
            <el-tag v-else type="info" size="small">未设置</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 底部统计 -->
    <div class="footer-bar">
      <span>共 {{ projectList.length }} 个项目</span>
    </div>
  </div>
</template>

<script>
import { getCheckinRegions, updateCheckinRegion, createCheckinRegion } from '@/api/checkinRegion'
import { getProjects } from '@/api/project'

export default {
  name: 'CheckInRegion',
  data() {
    return {
      loading: false,
      projectList: [], // 项目列表
      checkinRegionsMap: {} // 项目ID -> 签到区域映射
    }
  },
  created() {
    this.loadProjects()
    this.loadCheckinRegions()
  },
  methods: {
    // 加载项目列表
    async loadProjects() {
      this.loading = true
      try {
        const response = await getProjects({ page: 1, limit: 1000 })
        const projects = response.data?.list || []
        
        // 合并签到范围信息
        this.projectList = projects.map(project => {
          const region = this.checkinRegionsMap[project._id]
          return {
            ...project,
            checkinRange: region ? region.range : 2, // 默认2公里
            checkinRegionId: region ? region._id : null
          }
        })
      } catch (error) {
        console.error('加载项目列表失败:', error)
        this.$message.error('加载项目列表失败')
      } finally {
        this.loading = false
      }
    },

    // 加载签到区域列表
    async loadCheckinRegions() {
      try {
        const res = await getCheckinRegions({ page: 1, limit: 1000 })
        if (res.success) {
          // 构建项目ID到签到区域的映射
          const map = {}
          res.data.forEach(region => {
            if (region.projectId) {
              const projectId = region.projectId._id || region.projectId
              map[projectId] = region
            }
          })
          this.checkinRegionsMap = map
          
          // 重新加载项目列表以合并签到范围
          if (this.projectList.length > 0) {
            this.projectList = this.projectList.map(project => {
              const region = this.checkinRegionsMap[project._id]
              return {
                ...project,
                checkinRange: region ? region.range : 2,
                checkinRegionId: region ? region._id : null
              }
            })
          } else {
            // 如果项目列表还没加载，先加载项目
            await this.loadProjects()
          }
        }
      } catch (error) {
        console.error('加载签到区域失败:', error)
      }
    },

    // 获取项目的签到范围
    getCheckinRange(project) {
      return project.checkinRange || 2
    },

    // 调整项目签到范围
    adjustProjectRange(project, delta) {
      let newRange = (project.checkinRange || 2) + delta
      if (newRange < 1) newRange = 1
      if (newRange > 20) newRange = 20
      project.checkinRange = newRange
      this.saveProjectRange(project)
    },

    // 保存项目签到范围
    async saveProjectRange(project) {
      // 验证范围
      if (project.checkinRange < 1) {
        project.checkinRange = 1
      }
      if (project.checkinRange > 20) {
        project.checkinRange = 20
      }

      try {
        // 检查项目是否有位置信息
        if (!project.position || !project.position.lng || !project.position.lat) {
          this.$message.warning(`项目"${project.name}"未设置位置信息，无法设置签到范围`)
          return
        }

        const regionData = {
          unitName: project.name,
          range: project.checkinRange,
          purpose: '外出维保打卡',
          coordinates: {
            lng: project.position.lng,
            lat: project.position.lat
          },
          address: project.address || '',
          projectId: project._id
        }

        if (project.checkinRegionId) {
          // 更新现有签到区域
          const res = await updateCheckinRegion(project.checkinRegionId, {
            range: project.checkinRange
          })
          if (res.success) {
            this.$message.success('保存成功')
            // 更新本地映射
            this.checkinRegionsMap[project._id].range = project.checkinRange
          } else {
            this.$message.error(res.message || '保存失败')
          }
        } else {
          // 创建新签到区域
          const res = await createCheckinRegion(regionData)
          if (res.success) {
            this.$message.success('保存成功')
            // 更新本地数据
            project.checkinRegionId = res.data._id
            this.checkinRegionsMap[project._id] = res.data
          } else {
            this.$message.error(res.message || '保存失败')
          }
        }
      } catch (error) {
        console.error('保存签到范围失败:', error)
        this.$message.error('保存失败')
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
