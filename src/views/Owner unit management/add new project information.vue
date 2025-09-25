<template>
  <div class="project-info-root">
    <div class="form-card">
      <div class="section-title">合同关联项目信息</div>
      <div class="tips" v-if="isOneTimeContract">
        <div style="color: #409EFF;">
          <i class="el-icon-info" /> 一次性合同可以跳过项目信息，直接进入下一步
        </div>
      </div>
      <!-- 基本信息只读 -->
      <el-form ref="form" :model="form" label-width="130px" class="single-form-row">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="委托单位名称">
              <el-input v-model="form.entrustName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码">
              <el-input v-model="form.creditCode" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表格部分 -->
      <el-table :data="projectList" style="width:100%;margin-top:14px;" border :empty-text="' '">
        <el-table-column prop="index" label="序号" width="70" align="center" />
        <el-table-column prop="name" label="项目名称" align="center" />
        <el-table-column prop="ownerName" label="业主单位名称" align="center" />
        <el-table-column prop="address" label="项目地址" align="center" />
        <el-table-column prop="area" label="项目区域" align="center" />
        <el-table-column prop="linkman" label="项目单位联系人" align="center" />
        <el-table-column prop="phone" label="联系人电话" align="center" />
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-link type="primary" @click="editProject(scope.$index, scope.row)">编辑</el-link>
            <el-link type="danger" style="margin-left:8px;" @click="deleteProject(scope.$index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 空表格图片 -->
      <div v-if="!projectList.length" class="empty-table">
        <img src="@/assets/无数据.jpg" alt="暂无数据">
        <div class="empty-desc">暂无数据</div>
      </div>
      <div style="text-align: center; margin: 30px 0 0 0;">
        <el-button type="primary" size="large" @click="addProject">添加项目</el-button>
      </div>
      <div style="text-align: center; margin: 28px 0 0 0;">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
    </div>
    <!-- 新增/编辑项目弹窗 -->
    <el-dialog
      title="新增项目"
      :visible.sync="projectDialogVisible"
      width="820px"
      :close-on-click-modal="false"
      destroy-on-close
      @closed="resetProjectForm"
    >
      <ProjectFormDialog
        ref="projectFormDialog"
        :form-data="currentProject"
        @save="saveProject"
        @cancel="projectDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import ProjectFormDialog from './ProjectFormDialog.vue'

export default {
  name: 'AddNewProjectInfo',
  components: { ProjectFormDialog },
  props: {
    formData: Object
  },
  data() {
    return {
      form: {
        entrustName: '',
        creditCode: ''
      },
      projectList: [],
      projectDialogVisible: false,
      currentProject: null,
      editingIndex: -1
    }
  },
  computed: {
    isOneTimeContract() {
      return this.formData && ['施工', '评估', '检测'].includes(this.formData.contractType)
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        console.log('🔍 AddNewProjectInfo 接收到 formData:', newVal)
        if (newVal) {
          this.form.entrustName = newVal.entrustName || ''
          this.form.creditCode = newVal.creditCode || ''
          this.projectList = newVal.projectList || []
          console.log('🔍 设置后的 projectList:', this.projectList)
          console.log('🔍 projectList 长度:', this.projectList.length)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    addProject() {
      this.currentProject = null
      this.editingIndex = -1
      this.projectDialogVisible = true
    },
    editProject(index, row) {
      this.currentProject = { ...row }
      this.editingIndex = index
      this.projectDialogVisible = true
    },
    deleteProject(index) {
      this.$confirm('确定删除该项目？', '提示', { type: 'warning' }).then(() => {
        this.projectList.splice(index, 1)
      })
    },
    saveProject(project) {
      const projectWithOwner = {
        ...project,
        ownerName: this.form.entrustName
      }
      if (this.editingIndex > -1) {
        this.$set(this.projectList, this.editingIndex, { ...projectWithOwner, index: this.editingIndex + 1 })
      } else {
        this.projectList.push({ ...projectWithOwner, index: this.projectList.length + 1 })
      }
      this.projectDialogVisible = false
    },
    resetProjectForm() {
      this.currentProject = null
      this.editingIndex = -1
    },
    prevStep() {
      this.$emit('update', { projectList: this.projectList })
      this.$emit('prev')
    },
    nextStep() {
      console.log('🔍 nextStep 被调用')
      console.log('🔍 当前 projectList:', this.projectList)
      console.log('🔍 projectList 长度:', this.projectList.length)
      console.log('🔍 是否一次性合同:', this.isOneTimeContract)
      
      // 如果是一次性合同且没有项目信息，创建一个默认项目
      let projectList = this.projectList
      if (this.isOneTimeContract && this.projectList.length === 0) {
        console.log('🔍 创建默认项目')
        projectList = [{
          ownerName: this.form.entrustName,
          name: this.formData.contractName || '一次性合同项目',
          address: '',
          area: '',
          linkman: '',
          phone: '',
          index: 1
        }]
      }
      console.log('🔍 最终 projectList:', projectList)
      this.$emit('update', { projectList: projectList })
      this.$emit('next')
    }
  }
}
</script>

<style scoped>
.project-info-root { width: 100%; padding: 0 20px; }
.form-card { background: #f7fafd; border-radius: 12px; padding: 38px 28px 36px 28px; margin: 0 auto; max-width: 1480px;}
.section-title { font-size: 20px; font-weight: bold; color: #111; margin-bottom: 16px;}
.tips { color: #ff5e5e; font-size: 15px; margin-bottom: 8px; }
.empty-table { text-align:center; margin:42px 0;}
.empty-table img { width: 120px; opacity: 0.6;}
.empty-desc { color: #bbb; margin-top: 8px; }
</style>

