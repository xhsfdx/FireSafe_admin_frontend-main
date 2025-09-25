<template>
  <div class="edit-maintenance-project-page">
    <div class="header-bar">
      <span class="title">编辑自建维保项目</span>
      <el-button type="primary" size="medium" style="float: right;" :loading="loading" @click="onSave">保存</el-button>
    </div>

    <el-form
      ref="form"
      :model="{ maintenanceItems }"
      :rules="rules"
      label-width="140px"
      label-position="left"
      class="main-form"
    >
      <!-- 动态维保项目列表 -->
      <div v-for="(item, index) in maintenanceItems" :key="item.id" class="maintenance-item">
        <div class="item-header">
          <span class="item-title">维保项目 {{ index + 1 }}</span>
          <el-button
            v-if="maintenanceItems.length > 1"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            class="remove-btn"
            @click="removeItem(index)"
          >
            删除
          </el-button>
        </div>

        <!-- 第一行：消防系统/设施 + 维保项目 -->
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item :label="'* 消防系统/设施'" :prop="`maintenanceItems.${index}.system`">
              <el-select v-model="item.system" placeholder="请选择消防系统/设施" clearable>
                <el-option label="消防供配电设施" value="消防供配电设施" />
                <el-option label="火灾自动报警系统" value="火灾自动报警系统" />
                <el-option label="自动喷水灭火系统" value="自动喷水灭火系统" />
                <el-option label="消火栓系统" value="消火栓系统" />
                <el-option label="防烟排烟系统" value="防烟排烟系统" />
                <el-option label="气体灭火系统" value="气体灭火系统" />
                <el-option label="泡沫灭火系统" value="泡沫灭火系统" />
                <el-option label="干粉灭火系统" value="干粉灭火系统" />
                <el-option label="消防应急照明和疏散指示系统" value="消防应急照明和疏散指示系统" />
                <el-option label="消防电梯" value="消防电梯" />
                <el-option label="消防通信设备" value="消防通信设备" />
                <el-option label="其他消防设施" value="其他消防设施" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="'* 维保项目'" :prop="`maintenanceItems.${index}.project`">
              <el-input v-model="item.project" placeholder="请输入维保项目" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行：维保周期 + 检测内容 -->
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item :label="'* 维保周期'" :prop="`maintenanceItems.${index}.cycle`">
              <el-select v-model="item.cycle" placeholder="请选择维保周期" clearable>
                <el-option label="日" value="日" />
                <el-option label="周" value="周" />
                <el-option label="月" value="月" />
                <el-option label="季" value="季" />
                <el-option label="半年" value="半年" />
                <el-option label="年" value="年" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="'* 检测内容'" :prop="`maintenanceItems.${index}.content`">
              <el-input v-model="item.content" placeholder="请输入检测内容" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行：检测标准与方法 -->
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item :label="'检测标准与方法'" :prop="`maintenanceItems.${index}.standard`">
              <el-input
                v-model="item.standard"
                type="textarea"
                rows="4"
                placeholder="请输入检测标准与方法"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 新增内容按钮 -->
      <div class="extra-actions">
        <el-button type="primary" icon="el-icon-plus" @click="addMaintenanceItem">
          新增内容
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getMaintainProject, updateMaintainProject } from '@/api/maintainProject'

export default {
  name: 'EditSelfBuiltMaintenanceProject',
  data() {
    return {
      loading: false,
      projectId: null,
      maintenanceItems: [
        {
          id: 1,
          system: '',
          project: '',
          cycle: '',
          content: '',
          standard: ''
        }
      ],
      rules: {
        system: [{ required: true, message: '请选择消防系统/设施', trigger: 'change' }],
        project: [{ required: true, message: '请输入维保项目', trigger: 'blur' }],
        cycle: [{ required: true, message: '请选择维保周期', trigger: 'change' }],
        content: [{ required: true, message: '请输入检测内容', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.projectId = this.$route.params.id || this.$route.query.id
    if (this.projectId) {
      this.loadData()
    } else {
      this.$message.error('缺少项目ID参数')
      this.$router.back()
    }
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const res = await getMaintainProject(this.projectId)
        console.log('项目详情响应:', res)

        if (res.success && res.data) {
          const data = res.data
          console.log('原始数据:', data)

          // 处理maintenanceItems数组，转换为可读的字符串
          let maintenanceItemsStr = ''
          if (data.maintenanceItems && Array.isArray(data.maintenanceItems)) {
            const items = data.maintenanceItems.map(item => {
              if (typeof item === 'object' && item !== null) {
                // 如果是populate后的对象，提取有用信息
                if (item.devices && Array.isArray(item.devices)) {
                  return item.devices.map(device => {
                    if (device.items && Array.isArray(device.items)) {
                      return device.items.map(item => item.maintainSlim || item.maintainContent || '未知检测项').join(', ')
                    }
                    return device.device || '未知设备'
                  }).join(', ')
                }
                return item.category || item.systemType || '未知类别'
              } else {
                // 如果是字符串ID，显示ID
                return item
              }
            })
            maintenanceItemsStr = items.join(', ')
          } else if (typeof data.maintenanceItems === 'string') {
            maintenanceItemsStr = data.maintenanceItems
          }

          // 初始化维保项目列表
          this.maintenanceItems = [
            {
              id: 1,
              system: data.type || data.system || '',
              project: data.name || data.project || '',
              cycle: data.planType || data.cycle || '月',
              content: maintenanceItemsStr || data.content || '',
              standard: data.description || data.standard || ''
            }
          ]

          console.log('处理后的表单数据:', this.form)
        } else {
          this.$message.error(res.message || '获取项目详情失败')
        }
      } catch (error) {
        console.error('获取项目详情失败:', error)
        this.$message.error('获取项目详情失败')
      } finally {
        this.loading = false
      }
    },

    async onSave() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            // 验证所有维保项目都有必填字段
            const hasEmptyRequiredFields = this.maintenanceItems.some(item =>
              !item.system || !item.project || !item.cycle || !item.content
            )

            if (hasEmptyRequiredFields) {
              this.$message.error('请填写所有必填字段')
              this.loading = false
              return
            }

            // 准备保存数据 - 保存第一个维保项目的数据到主记录
            const firstItem = this.maintenanceItems[0]
            const data = {
              system: firstItem.system,
              project: firstItem.project,
              cycle: firstItem.cycle,
              content: firstItem.content,
              standard: firstItem.standard,
              // 如果有多个维保项目，将额外的项目作为数组保存
              additionalItems: this.maintenanceItems.slice(1)
            }

            console.log('更新数据:', data)
            const res = await updateMaintainProject(this.projectId, data)
            console.log('更新响应:', res)

            if (res.success) {
              this.$message.success('保存成功！')
              // 返回上一页
              this.$router.back()
            } else {
              this.$message.error(res.message || '保存失败')
            }
          } catch (error) {
            console.error('保存失败:', error)
            this.$message.error('保存失败')
          } finally {
            this.loading = false
          }
        }
      })
    },

    addMaintenanceItem() {
      const newId = Math.max(...this.maintenanceItems.map(item => item.id)) + 1
      this.maintenanceItems.push({
        id: newId,
        system: '',
        project: '',
        cycle: '',
        content: '',
        standard: ''
      })
    },

    removeItem(index) {
      if (this.maintenanceItems.length > 1) {
        this.maintenanceItems.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.edit-maintenance-project-page {
  padding: 24px 16px;
  background: #fafcff;
  min-height: 100vh;
}

.header-bar {
  background: #e9f3fc;
  border-radius: 6px 6px 0 0;
  padding: 20px 24px 10px 24px;
  margin-bottom: 20px;
  position: relative;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #222;
  line-height: 38px;
}

.main-form {
  background: #fff;
  border-radius: 0 0 8px 8px;
  padding: 20px 20px 36px 20px;
  box-shadow: 0 2px 10px 0 #edf6ff3d;
}

.extra-actions {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-select, .el-input {
  width: 100%;
}

.maintenance-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fafbfc;
  position: relative;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.item-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.maintenance-item:last-of-type {
  margin-bottom: 0;
}
</style>
