<template>
  <div class="ai-config">
    <el-card>
      <div slot="header">
        <span>AI 配置（DeepSeek）</span>
      </div>

      <el-form :model="form" label-width="150px">
        <el-form-item label="DeepSeek API Key">
          <el-input
            v-model="form.apiKey"
            type="password"
            show-password
            placeholder="请输入 DeepSeek API Key"
            style="width: 500px"
          />
          <el-button
            type="primary"
            @click="handleSave"
            :loading="saving"
            style="margin-left: 10px"
          >
            保存
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-alert
            type="info"
            :closable="false"
            show-icon
          >
            <div slot="title">
              <p>DeepSeek API Key 用于 AI 聊天功能。</p>
              <p>获取方式：访问 <a href="https://platform.deepseek.com" target="_blank">DeepSeek 平台</a> 注册并获取 API Key。</p>
            </div>
          </el-alert>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getSystemConfig, updateSystemConfig } from '@/api/systemConfig'

export default {
  name: 'AIConfig',
  data() {
    return {
      form: {
        apiKey: ''
      },
      saving: false
    }
  },
  created() {
    this.loadConfig()
  },
  methods: {
    async loadConfig() {
      try {
        const res = await getSystemConfig('deepseek_api_key')
        if (res && res.success && res.data) {
          this.form.apiKey = res.data.value || ''
        }
      } catch (e) {
        console.error('加载配置失败:', e)
      }
    },
    async handleSave() {
      if (!this.form.apiKey.trim()) {
        this.$message.warning('请输入 API Key')
        return
      }

      this.saving = true
      try {
        await updateSystemConfig('deepseek_api_key', {
          value: this.form.apiKey.trim(),
          description: 'DeepSeek API Key for AI chat functionality'
        })
        this.$message.success('保存成功')
      } catch (e) {
        this.$message.error('保存失败: ' + (e.message || '未知错误'))
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.ai-config {
  padding: 20px;
}
</style>
