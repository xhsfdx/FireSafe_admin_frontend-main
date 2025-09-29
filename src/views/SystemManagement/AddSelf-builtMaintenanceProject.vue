<template>
  <div class="add-maintenance-project-page">
    <div class="header-bar">
      <span class="title">新增自建维保项目</span>
      <el-button type="primary" size="medium" style="float: right;" @click="onSubmit">保存</el-button>
    </div>

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="left"
      class="main-form"
    >
      <!-- 第一行：消防系统设施 + 维保项目 -->
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="* 消防系统设施" prop="facility">
            <el-select v-model="form.facility" placeholder="请选择消防系统设施" clearable>
              <el-option label="消防供配电设施" value="消防供配电设施" />
              <el-option label="火灾自动报警系统" value="火灾自动报警系统" />
              <el-option label="电气火灾监控系统" value="电气火灾监控系统" />
              <el-option label="可燃气体探测报警系统" value="可燃气体探测报警系统" />
              <el-option label="消防给水及消火栓系统" value="消防给水及消火栓系统" />
              <el-option label="自动喷水灭火系统" value="自动喷水灭火系统" />
              <el-option label="泡沫灭火系统" value="泡沫灭火系统" />
              <el-option label="消防炮灭火系统" value="消防炮灭火系统" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="* 维保项目" prop="project">
            <el-input v-model="form.project" placeholder="请输入维保项目" />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="content-box">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="* 维保周期" prop="cycle">
              <el-select v-model="form.cycle" placeholder="请选择维保周期" clearable>
                <el-option label="月" value="月" />
                <el-option label="季" value="季" />
                <el-option label="半年" value="半年" />
                <el-option label="年" value="年" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="* 检测内容" prop="checkContent">
              <el-input v-model="form.checkContent" placeholder="请输入检测内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检测标准与方法" prop="checkStandard">
              <el-input
                v-model="form.checkStandard"
                type="textarea"
                rows="6"
                placeholder="请输入检测标准与方法"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="extra-actions">
          <el-button type="primary" icon="el-icon-plus" @click="addExtraContent">
            新增内容
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddSelfBuiltMaintenanceProject',
  data() {
    return {
      form: {
        facility: '',
        project: '',
        cycle: '',
        checkContent: '',
        checkStandard: ''
      },
      rules: {
        facility: [{ required: true, message: '请选择消防系统设施', trigger: 'change' }],
        project: [{ required: true, message: '请输入维保项目', trigger: 'blur' }],
        cycle: [{ required: true, message: '请选择维保周期', trigger: 'change' }],
        checkContent: [{ required: true, message: '请输入检测内容', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('保存成功！（这里只做演示，实际应提交后端）')
        }
      })
    },
    addExtraContent() {
      this.$message.info('自定义内容扩展区域，可根据需要实现')
    }
  }
}
</script>

<style scoped>
.add-maintenance-project-page {
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
.content-box {
  border: 1px dashed #2c80ff80;
  padding: 16px 18px 10px 18px;
  border-radius: 6px;
  margin-top: 16px;
  background: #fcfdff;
  margin-bottom: 30px;
}
.extra-actions {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
