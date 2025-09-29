<template>
  <div class="create-task-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <i class="el-icon-plus" />
          </div>
          <div class="title-info">
            <h1 class="page-title">新建维保任务</h1>
            <p class="page-subtitle">创建新的维保任务并分配给相关人员</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button icon="el-icon-arrow-left" @click="goBack">
            返回列表
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表单区域 -->
    <div class="form-section">
      <el-form
        ref="taskForm"
        :model="taskForm"
        :rules="formRules"
        label-width="120px"
        class="task-form"
      >
        <el-card class="form-card" shadow="never">
          <div slot="header" class="card-header">
            <i class="el-icon-s-order" />
            <span>基本信息</span>
          </div>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目名称" prop="projectName">
                <el-select
                  v-model="taskForm.projectName"
                  placeholder="请选择项目"
                  filterable
                  remote
                  :remote-method="searchProjects"
                  :loading="projectLoading"
                  style="width: 100%"
                >
                  <el-option
                    v-for="project in projectOptions"
                    :key="project._id"
                    :label="project.name"
                    :value="project.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划类型" prop="planType">
                <el-select v-model="taskForm.planType" placeholder="请选择计划类型" style="width: 100%">
                  <el-option label="月度计划" value="月" />
                  <el-option label="季度计划" value="季" />
                  <el-option label="半年计划" value="半年" />
                  <el-option label="年度计划" value="年" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="任务名称" prop="taskName">
                <el-input
                  v-model="taskForm.taskName"
                  placeholder="请输入任务名称"
                  :disabled="taskForm.projectName && taskForm.planType"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划日期" prop="planDate">
                <el-date-picker
                  v-model="taskForm.planDate"
                  type="date"
                  placeholder="选择计划日期"
                  style="width: 100%"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目负责人" prop="principal">
                <el-select
                  v-model="taskForm.principal"
                  placeholder="请选择项目负责人"
                  filterable
                  remote
                  :remote-method="searchStaff"
                  :loading="staffLoading"
                  style="width: 100%"
                >
                  <el-option
                    v-for="staff in staffOptions"
                    :key="staff._id"
                    :label="staff.name"
                    :value="staff.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维保人员" prop="maintainPersons">
                <el-select
                  v-model="taskForm.maintainPersons"
                  placeholder="请选择维保人员"
                  multiple
                  filterable
                  remote
                  :remote-method="searchStaff"
                  :loading="staffLoading"
                  style="width: 100%"
                >
                  <el-option
                    v-for="staff in staffOptions"
                    :key="staff._id"
                    :label="staff.name"
                    :value="staff.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="任务描述" prop="description">
            <el-input
              v-model="taskForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入任务描述"
            />
          </el-form-item>
        </el-card>

        <el-card class="form-card" shadow="never">
          <div slot="header" class="card-header">
            <i class="el-icon-s-check" />
            <span>维保内容</span>
          </div>

          <div class="maintenance-content">
            <div class="content-header">
              <el-button type="primary" icon="el-icon-plus" @click="addMaintenanceItem">
                添加维保项目
              </el-button>
            </div>

            <div class="content-list">
              <div
                v-for="(item, index) in taskForm.maintenanceItems"
                :key="index"
                class="maintenance-item"
              >
                <el-row :gutter="10">
                  <el-col :span="6">
                    <el-input
                      v-model="item.category"
                      placeholder="分类"
                    />
                  </el-col>
                  <el-col :span="6">
                    <el-input
                      v-model="item.device"
                      placeholder="设备名称"
                    />
                  </el-col>
                  <el-col :span="10">
                    <el-input
                      v-model="item.content"
                      placeholder="维保内容"
                    />
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      @click="removeMaintenanceItem(index)"
                    />
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-card>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="action-section">
      <el-button size="large" @click="goBack">
        取消
      </el-button>
      <el-button type="primary" size="large" :loading="saving" @click="saveTask">
        保存任务
      </el-button>
    </div>
  </div>
</template>

<script>
import { getProjects } from '@/api/project'
import { getStaff } from '@/api/staff'
import { createMaintainTask } from '@/api/maintainTask'

export default {
  name: 'CreateTask',
  data() {
    return {
      taskForm: {
        projectName: '',
        planType: '',
        taskName: '',
        planDate: '',
        principal: '',
        maintainPersons: [],
        description: '',
        maintenanceItems: []
      },
      formRules: {
        projectName: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ],
        planType: [
          { required: true, message: '请选择计划类型', trigger: 'change' }
        ],
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        planDate: [
          { required: true, message: '请选择计划日期', trigger: 'change' }
        ],
        principal: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        maintainPersons: [
          { required: true, message: '请选择维保人员', trigger: 'change' }
        ]
      },
      projectOptions: [],
      staffOptions: [],
      projectLoading: false,
      staffLoading: false,
      saving: false
    }
  },
  watch: {
    'taskForm.projectName'() {
      this.generateTaskName()
    },
    'taskForm.planType'() {
      this.generateTaskName()
    }
  },
  mounted() {
    this.loadInitialData()
  },
  methods: {
    // 加载初始数据
    async loadInitialData() {
      try {
        await Promise.all([
          this.loadProjects(),
          this.loadStaff()
        ])
      } catch (error) {
        console.error('加载初始数据失败:', error)
        this.$message.error('加载初始数据失败')
      }
    },

    // 加载项目列表
    async loadProjects() {
      try {
        this.projectLoading = true
        const response = await getProjects({ page: 1, limit: 100 })
        this.projectOptions = response.data.list || []
      } catch (error) {
        console.error('加载项目列表失败:', error)
      } finally {
        this.projectLoading = false
      }
    },

    // 加载人员列表
    async loadStaff() {
      try {
        this.staffLoading = true
        const response = await getStaff({ page: 1, limit: 100 })
        this.staffOptions = response.data.list || []
      } catch (error) {
        console.error('加载人员列表失败:', error)
      } finally {
        this.staffLoading = false
      }
    },

    // 搜索项目
    async searchProjects(query) {
      if (query !== '') {
        try {
          this.projectLoading = true
          const response = await getProjects({
            page: 1,
            limit: 20,
            name: query
          })
          this.projectOptions = response.data.list || []
        } catch (error) {
          console.error('搜索项目失败:', error)
        } finally {
          this.projectLoading = false
        }
      }
    },

    // 搜索人员
    async searchStaff(query) {
      if (query !== '') {
        try {
          this.staffLoading = true
          const response = await getStaff({
            page: 1,
            limit: 20,
            name: query
          })
          this.staffOptions = response.data.list || []
        } catch (error) {
          console.error('搜索人员失败:', error)
        } finally {
          this.staffLoading = false
        }
      }
    },

    // 生成任务名称
    generateTaskName() {
      if (this.taskForm.projectName && this.taskForm.planType) {
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')

        let planTypeText = ''
        switch (this.taskForm.planType) {
          case '月':
            planTypeText = `${year}年${month}月维保任务`
            break
          case '季':
            const quarter = Math.ceil((currentDate.getMonth() + 1) / 3)
            planTypeText = `${year}年第${quarter}季度维保任务`
            break
          case '半年':
            const half = currentDate.getMonth() < 6 ? '上半年' : '下半年'
            planTypeText = `${year}年${half}维保任务`
            break
          case '年':
            planTypeText = `${year}年维保任务`
            break
        }

        this.taskForm.taskName = planTypeText
      }
    },

    // 添加维保项目
    addMaintenanceItem() {
      this.taskForm.maintenanceItems.push({
        category: '',
        device: '',
        content: ''
      })
    },

    // 删除维保项目
    removeMaintenanceItem(index) {
      this.taskForm.maintenanceItems.splice(index, 1)
    },

    // 保存任务
    async saveTask() {
      try {
        // 表单验证
        await this.$refs.taskForm.validate()

        this.saving = true

        // 准备提交数据
        const submitData = {
          ...this.taskForm,
          status: '已派发',
          maintenanceItems: this.taskForm.maintenanceItems.filter(item =>
            item.category && item.device && item.content
          )
        }

        // 调用API创建任务
        const response = await createMaintainTask(submitData)

        if (response.success) {
          this.$message.success('任务创建成功')
          this.goBack()
        } else {
          this.$message.error(response.message || '任务创建失败')
        }
      } catch (error) {
        console.error('保存任务失败:', error)
        if (error.message) {
          this.$message.error(error.message)
        } else {
          this.$message.error('保存任务失败')
        }
      } finally {
        this.saving = false
      }
    },

    // 返回列表
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.create-task-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
}

.page-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.page-icon i {
  font-size: 28px;
  color: white;
}

.title-info h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.title-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.header-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.form-section {
  margin-bottom: 24px;
}

.form-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.card-header i {
  margin-right: 8px;
  color: #667eea;
}

.task-form {
  padding: 20px;
}

.maintenance-content {
  margin-top: 20px;
}

.content-header {
  margin-bottom: 20px;
}

.content-list {
  max-height: 400px;
  overflow-y: auto;
}

.maintenance-item {
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: #fafafa;
}

.action-section {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.action-section .el-button {
  margin: 0 10px;
  min-width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .create-task-page {
    padding: 10px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .title-section {
    margin-bottom: 20px;
  }

  .action-section .el-button {
    display: block;
    width: 100%;
    margin: 10px 0;
  }
}
</style>
