<template>
  <div class="add-point-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">业主单位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">维保点位管理</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">维保点位管理详情</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">添加点位</span>
    </div>

    <div class="form-card">
      <!-- 基础信息 -->
      <div class="section-title">
        <span style="color:#f56c6c;">*</span> 基础信息
      </div>
      
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="basic-form">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="点位名称" prop="pointName" required>
              <el-input v-model="form.pointName" placeholder="请输入点位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="点位类型" prop="pointType" required>
              <el-select v-model="form.pointType" placeholder="请选择" style="width: 100%">
                <el-option label="NFC" value="NFC" />
                <el-option label="二维码" value="二维码" />
                <el-option label="普通" value="普通" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="点位照片">
              <el-upload
                class="upload-demo"
                action="#"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
              >
                <div class="upload-area">
                  <i class="el-icon-camera upload-icon"></i>
                  <div class="upload-text">上传图片</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="save-button-col">
            <el-button 
              type="primary" 
              size="medium" 
              :loading="saving"
              :disabled="saving"
              @click="handleSave"
            >
              {{ saving ? '保存中...' : '保存' }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 维保内容 -->
      <div class="section-title" style="margin-top: 32px;">
        维保内容
      </div>
      
      <el-row :gutter="14">
        <!-- 左侧树形列表 + 全选 -->
        <el-col :span="6">
          <div style="margin-bottom: 12px;">
            <el-checkbox v-model="treeCheckAll" style="margin-left: 2px;" @change="handleCheckAll">一键全选</el-checkbox>
          </div>
          <el-tabs v-model="activeTab" class="tab-tree">
            <el-tab-pane label="平台标准系统" name="standard">
              <el-tree
                ref="maintTree"
                :data="maintTree"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkedKeys"
                :expand-on-click-node="false"
                @check="handleTreeCheck"
              />
            </el-tab-pane>
            <el-tab-pane label="自建标准系统" name="custom">
              <div class="tab-empty">暂无内容</div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        
        <!-- 右侧表格展示 -->
        <el-col :span="18">
          <el-table :data="checkedMaintList" border style="width: 100%;">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="system" label="消防系统/设施" align="center" />
            <el-table-column prop="item" label="维保项目" align="center" />
            <el-table-column prop="content" label="检测内容" align="center" />
            <el-table-column prop="period" label="维保周期" align="center" />
            <el-table-column prop="standard" label="规范" align="center" />
          </el-table>
          <div v-if="checkedMaintList.length === 0" class="empty-box">
            <img src="@/assets/无数据.jpg" style="width: 128px; opacity: 0.7; margin-top: 20px;">
            <div style="color: #888; margin-top: 8px;">暂无数据</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getMaintainStandardItems } from '@/api/contract'
import request from '@/utils/request'

export default {
  name: 'MPMAddPoint',
  data() {
    return {
      form: {
        pointName: '',
        pointType: '',
        address: '',
        photo: ''
      },
      projectInfo: {
        projectId: '',
        projectName: '',
        entrustName: ''
      },
      rules: {
        pointName: [{ required: true, message: '请输入点位名称', trigger: 'blur' }],
        pointType: [{ required: true, message: '请选择点位类型', trigger: 'change' }]
      },
      activeTab: 'standard',
      maintTree: [],
      checkedKeys: [],
      checkedMaintList: [],
      treeCheckAll: false,
      saving: false // 保存状态
    }
  },
  mounted() {
    this.initProjectInfo()
    this.loadMaintainTree()
  },
  methods: {
    // 初始化项目信息
    initProjectInfo() {
      const query = this.$route.query
      if (query.projectId) {
        this.projectInfo = {
          projectId: query.projectId,
          projectName: query.projectName || '',
          entrustName: query.entrustName || ''
        }
        console.log('接收到的项目信息:', this.projectInfo)
      } else {
        // 如果没有项目信息，显示警告
        this.$message.warning('缺少项目信息，请从维保点位管理页面进入')
        console.warn('缺少项目信息，无法正常添加点位')
      }
    },

    // 上传相关方法
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }
      return true
    },

    handleUploadSuccess(response, file) {
      this.form.photo = response.url || file.url
      this.$message.success('图片上传成功')
    },

    // 维保内容相关方法
    transformToTree(data) {
      const getPeriodLabel = (p) => {
        if (!p) return ''
        if (p === 1) return '月检'
        if (p === 12) return '年检'
        return `${p}`
      }

      return data.map(system => ({
        id: `system_${system.category}`, // 系统级别的ID
        label: system.category,
        children: (system.devices || []).map(device => ({
          id: `device_${device.device}`, // 设备级别的ID
          label: device.device,
          children: (device.items || []).map(item => ({
            id: item._id, // 使用维保项目的真实ID
            label: item.maintainSlim,
            data: {
              id: item._id, // 保存真实的维保项目ID
              system: system.category,
              item: device.device,
              content: item.maintainContent,
              period: getPeriodLabel(item.frequency),
              standard: '' // 后端API没有返回attention字段，暂时设为空
            }
          }))
        }))
      }))
    },

    async loadMaintainTree() {
      try {
        const res = await getMaintainStandardItems()
        if (res.success && res.data) {
          const rawData = res.data
          this.maintTree = this.transformToTree(rawData)
        } else {
          console.error('获取标准维保项目失败:', res)
          this.maintTree = []
        }
      } catch (err) {
        console.error('加载维保项目失败:', err)
        this.$message.error('加载维保项目失败: ' + (err.message || '未知错误'))
      }
    },


    handleTreeCheck(data, { checkedKeys }) {
      this.checkedKeys = checkedKeys
      this.updateCheckedMaintList()
      // 控制全选
      const allIds = this.getAllLeafIds(this.maintTree)
      this.treeCheckAll = checkedKeys.length === allIds.length
    },

    // 全选
    handleCheckAll(val) {
      const getAllLeafIds = (nodes, arr = []) => {
        nodes.forEach(n => {
          if (n.children && n.children.length) {
            getAllLeafIds(n.children, arr)
          } else {
            arr.push(n.id)
          }
        })
        return arr
      }
      if (val) {
        const allIds = getAllLeafIds(this.maintTree)
        this.checkedKeys = allIds
        this.$refs.maintTree.setCheckedKeys(allIds)
      } else {
        this.checkedKeys = []
        this.$refs.maintTree.setCheckedKeys([])
      }
      this.updateCheckedMaintList()
    },

    // 提取所有叶子节点id
    getAllLeafIds(nodes, arr = []) {
      nodes.forEach(n => {
        if (n.children && n.children.length) {
          this.getAllLeafIds(n.children, arr)
        } else {
          arr.push(n.id)
        }
      })
      return arr
    },

    // 生成右侧表格完整内容
    updateCheckedMaintList() {
      const checkedNodes = this.$refs.maintTree.getCheckedNodes(true)
      this.checkedMaintList = checkedNodes
        .filter(n => !n.children || n.children.length === 0) // 只处理叶子节点
        .filter(n => n.data && n.data.id) // 确保有维保项目ID
        .map(n => n.data)

      console.log('勾选的维保项目:', this.checkedMaintList)
      console.log('维保项目ID列表:', this.checkedMaintList.map(item => item.id))
    },

    // 保存方法
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            projectInfo: this.projectInfo,
            checkedMaintList: this.checkedMaintList
          }
          console.log('保存点位数据:', data)
          
          // 调用保存到后端的方法
          this.savePointToServer(data)
        } else {
          this.$message.error('请填写必填字段')
          return false
        }
      })
    },

    // 保存点位到后端服务器
    async savePointToServer(data) {
      try {
        this.saving = true
        console.log('开始保存点位到后端:', data)
        
        // 检查是否有项目信息
        if (!data.projectInfo.projectId) {
          this.$message.error('缺少项目信息，无法保存点位')
          return
        }

        // 检查是否有维保内容
        if (!data.checkedMaintList || data.checkedMaintList.length === 0) {
          this.$message.error('请至少选择一个维保项目')
          return
        }

        // 构建请求数据
        const requestData = {
          planId: data.projectInfo.projectId, // 这里实际上是维保计划的ID
          checkpoints: [{
            name: data.pointName,
            type: data.pointType,
            address: data.address,
            photo: data.photo || '',
            maintenanceItems: data.checkedMaintList.map(item => {
              // 根据数据结构，maintenanceItems应该是字符串数组
              // 如果item有item，使用item；否则使用id
              return item.item || item.id
            })
          }]
        }

        console.log('发送到后端的请求数据:', requestData)

        // 调用后端API
        const response = await request.post('/point/maintainPoint/checkpoint', requestData)
        
        console.log('后端响应:', response)
        
        if (response.success) {
          this.$message.success('点位保存成功')
          
          // 保存成功后返回上一页
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        } else {
          this.$message.error(response.message || '保存失败')
        }
        
      } catch (error) {
        console.error('保存点位失败:', error)
        
        // 处理不同类型的错误
        if (error.response) {
          // 服务器响应错误
          const errorMessage = error.response.data?.message || '服务器错误'
          this.$message.error(`保存失败: ${errorMessage}`)
        } else if (error.request) {
          // 网络错误
          this.$message.error('网络连接失败，请检查网络后重试')
        } else {
          // 其他错误
          this.$message.error('保存失败: ' + (error.message || '未知错误'))
        }
      } finally {
        this.saving = false
      }
    },

  }
}
</script>

<style scoped>
.add-point-page {
  padding: 20px;
  background: #f9fbfd;
  min-height: 100vh;
}

/* 面包屑导航 */
.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #666;
}

.breadcrumb-item.active {
  color: #409EFF;
  font-weight: bold;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
}

.form-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409EFF;
}

.basic-form {
  margin-bottom: 20px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  width: 120px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409EFF;
}

.upload-icon {
  font-size: 24px;
  color: #999;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #666;
}

.save-button-col {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.tab-tree {
  background: #fff;
  min-height: 320px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.tab-empty {
  color: #888;
  text-align: center;
  padding: 30px 0;
}

.empty-box {
  text-align: center;
  margin-top: 38px;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .basic-form .el-col {
    margin-bottom: 16px;
  }
  
  .save-button-col {
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
