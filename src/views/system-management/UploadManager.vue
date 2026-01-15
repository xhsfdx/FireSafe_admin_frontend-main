<template>
  <div class="upload-manager">
    <el-card>
      <div slot="header" class="clearfix">
        <span>上传文件管理</span>
        <span class="disk-info" v-if="disk">
          磁盘空间：
          已用 {{ formatSize(disk.used) }} /
          总共 {{ formatSize(disk.total) }}，
          剩余 {{ formatSize(disk.free) }}
        </span>
      </div>

      <div class="actions">
        <el-button
          type="danger"
          size="small"
          :disabled="selectedFiles.length === 0"
          @click="handleDeleteSelected"
        >
          删除选中文件
        </el-button>
        <el-button
          size="small"
          @click="handleCleanup(7)"
        >
          删除一周前文件
        </el-button>
        <el-button
          size="small"
          @click="handleCleanup(30)"
        >
          删除一月前文件
        </el-button>
        <el-button
          size="small"
          @click="loadFiles"
        >
          刷新
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="files"
        border
        height="500"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          label="文件名"
          min-width="220"
        >
          <template slot-scope="scope">
            <a
              :href="getFileUrl(scope.row)"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="大小"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatSize(scope.row.size) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="mtime"
          label="最后修改时间"
          width="200"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.mtime) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { fetchUploadFiles, deleteUploadFiles, cleanupUploadFiles } from '@/api/upload'
import { BASE_URL } from '@/utils/request'

export default {
  name: 'UploadManager',
  data() {
    return {
      files: [],
      loading: false,
      disk: null,
      selectedFiles: []
    }
  },
  created() {
    this.loadFiles()
  },
  methods: {
    async loadFiles() {
      this.loading = true
      try {
        const res = await fetchUploadFiles()
        if (res && res.success) {
          this.files = res.data || []
          this.disk = res.disk || null
        } else {
          this.$message.error('获取文件列表失败')
        }
      } catch (e) {
        console.error('获取文件列表失败:', e)
        this.$message.error('获取文件列表失败: ' + (e.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },
    handleSelectionChange(selection) {
      this.selectedFiles = selection.map(item => item.name)
    },
    async handleDeleteSelected() {
      if (this.selectedFiles.length === 0) return
      try {
        await this.$confirm(
          `确认删除选中的 ${this.selectedFiles.length} 个文件吗？`,
          '提示',
          {
            type: 'warning'
          }
        )
      } catch (e) {
        return
      }

      try {
        const res = await deleteUploadFiles(this.selectedFiles)
        if (res && res.success) {
          this.$message.success(res.message || '删除成功')
          this.selectedFiles = []
          this.loadFiles()
        } else {
          this.$message.error('删除失败')
        }
      } catch (e) {
        console.error('删除文件失败:', e)
        this.$message.error('删除文件失败: ' + (e.message || '未知错误'))
      }
    },
    async handleCleanup(days) {
      try {
        await this.$confirm(
          `确认删除 ${days} 天前的所有文件吗？此操作不可恢复！`,
          '警告',
          { type: 'warning' }
        )
      } catch (e) {
        return
      }

      try {
        const res = await cleanupUploadFiles(days)
        if (res && res.success) {
          this.$message.success(res.message || '清理完成')
          this.loadFiles()
        } else {
          this.$message.error('清理失败')
        }
      } catch (e) {
        console.error('清理文件失败:', e)
        this.$message.error('清理文件失败: ' + (e.message || '未知错误'))
      }
    },
    formatSize(bytes) {
      if (!bytes && bytes !== 0) return '-'
      const kb = 1024
      const mb = kb * 1024
      const gb = mb * 1024
      if (bytes >= gb) return (bytes / gb).toFixed(2) + ' GB'
      if (bytes >= mb) return (bytes / mb).toFixed(2) + ' MB'
      if (bytes >= kb) return (bytes / kb).toFixed(2) + ' KB'
      return bytes + ' B'
    },
    formatDate(date) {
      if (!date) return '-'
      const d = new Date(date)
      if (Number.isNaN(d.getTime())) return '-'
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const h = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const s = String(d.getSeconds()).padStart(2, '0')
      return `${y}-${m}-${day} ${h}:${mm}:${s}`
    },
    getFileUrl(row) {
      // row.url 已经是 /uploads/xxx
      if (row.url) {
        return BASE_URL + row.url
      }
      return BASE_URL + '/uploads/' + row.name
    }
  }
}
</script>

<style scoped>
.upload-manager {
  padding: 20px;
}

.actions {
  margin-bottom: 10px;
}

.actions .el-button + .el-button {
  margin-left: 8px;
}

.disk-info {
  float: right;
  font-size: 13px;
  color: #666;
}
</style>

