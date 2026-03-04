<template>
  <div class="wechat-push-config">
    <!-- 微信基础配置 -->
    <el-card class="config-card">
      <div slot="header" class="card-header">
        <span>微信基础配置</span>
        <el-tag v-if="configStatus.ready" type="success" size="small">已配置</el-tag>
        <el-tag v-else type="danger" size="small">未配置</el-tag>
      </div>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      >
        <div slot="title">
          <p style="margin: 0">微信消息推送需要配置公众号/小程序的 AppID 和 AppSecret。</p>
          <p style="margin: 4px 0 0">获取方式：登录
            <a href="https://mp.weixin.qq.com" target="_blank">微信公众平台</a>，在「开发 → 开发管理 → 开发设置」中获取。
          </p>
        </div>
      </el-alert>

      <el-form :model="baseForm" label-width="160px" label-position="right">
        <el-form-item label="AppID">
          <el-input
            v-model="baseForm.wechat_appid"
            placeholder="请输入微信 AppID"
            style="width: 450px"
            clearable
          />
        </el-form-item>
        <el-form-item label="AppSecret">
          <el-input
            v-model="baseForm.wechat_appsecret"
            type="password"
            show-password
            placeholder="请输入微信 AppSecret"
            style="width: 450px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="savingBase" @click="saveBaseConfig">
            保存基础配置
          </el-button>
          <el-button :loading="testing" @click="testConnection">
            测试连接
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 消息模板配置 -->
    <el-card class="config-card">
      <div slot="header">
        <span>消息模板 ID 配置</span>
      </div>

      <el-alert
        type="warning"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      >
        <div slot="title">
          <p style="margin: 0">每种消息类型对应一个微信消息模板。请在微信公众平台「功能 → 订阅通知」或「模板消息」中创建模板并填入模板 ID。</p>
          <p style="margin: 4px 0 0">未配置模板 ID 的消息类型将无法发送推送。</p>
        </div>
      </el-alert>

      <el-form :model="templateForm" label-width="160px" label-position="right">
        <el-form-item v-for="item in templateConfigs" :key="item.key" :label="item.label">
          <el-input
            v-model="templateForm[item.key]"
            :placeholder="'请输入' + item.label + '的模板 ID'"
            style="width: 450px"
            clearable
          >
            <template slot="prepend">
              <el-tag :type="item.tagType" size="small" style="border: none">{{ item.typeLabel }}</el-tag>
            </template>
          </el-input>
          <span class="config-hint">{{ item.hint }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="savingTemplates" @click="saveTemplateConfig">
            保存模板配置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 配置说明 -->
    <el-card class="config-card">
      <div slot="header">
        <span>配置说明</span>
      </div>
      <el-collapse>
        <el-collapse-item title="1. 如何获取 AppID 和 AppSecret？" name="1">
          <ol class="guide-list">
            <li>登录 <a href="https://mp.weixin.qq.com" target="_blank">微信公众平台</a></li>
            <li>进入「开发」→「开发管理」→「开发设置」</li>
            <li>AppID(小程序ID) 在页面顶部可见</li>
            <li>AppSecret(小程序密钥) 需要点击「重置」后获取，请妥善保存</li>
          </ol>
        </el-collapse-item>
        <el-collapse-item title="2. 如何创建消息模板？" name="2">
          <ol class="guide-list">
            <li>登录微信公众平台，进入「功能」→「订阅通知」</li>
            <li>点击「选用」，从公共模板库中选择合适的模板</li>
            <li>配置模板关键词（如：任务名称、状态、时间等）</li>
            <li>提交后获取模板 ID，填入上方对应配置项</li>
          </ol>
        </el-collapse-item>
        <el-collapse-item title="3. 各消息类型推荐模板关键词" name="3">
          <el-table :data="templateGuide" border size="small" style="width: 100%">
            <el-table-column prop="type" label="消息类型" width="150" />
            <el-table-column prop="keywords" label="推荐关键词" />
            <el-table-column prop="scene" label="使用场景" width="250" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="4. 用户 OpenID 如何获取？" name="4">
          <p class="guide-text">用户通过微信小程序/公众号授权登录时，系统会自动获取并存储用户的 OpenID。确保用户已通过微信授权绑定账号后，才能接收推送消息。</p>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import { batchGetConfigs, batchUpdateConfigs } from '@/api/systemConfig'
import { getWechatConfig } from '@/api/messagePush'

const BASE_CONFIG_KEYS = ['wechat_appid', 'wechat_appsecret']

const TEMPLATE_CONFIGS = [
  {
    key: 'wechat_template_maintenance_overdue',
    label: '维保任务逾期',
    typeLabel: '逾期',
    tagType: 'danger',
    hint: '当维保任务超过截止日期未完成时推送'
  },
  {
    key: 'wechat_template_monthly_task',
    label: '每月任务',
    typeLabel: '月度',
    tagType: '',
    hint: '每月初通知用户本月维保任务安排'
  },
  {
    key: 'wechat_template_contract_expiry',
    label: '合同到期',
    typeLabel: '合同',
    tagType: 'warning',
    hint: '合同即将到期或已到期时提醒相关人员'
  },
  {
    key: 'wechat_template_payment',
    label: '付款信息',
    typeLabel: '付款',
    tagType: 'success',
    hint: '付款相关信息变更时通知'
  },
  {
    key: 'wechat_template_task_status',
    label: '任务状态',
    typeLabel: '状态',
    tagType: 'info',
    hint: '维保任务状态发生变更时通知'
  }
]

const TEMPLATE_KEYS = TEMPLATE_CONFIGS.map(c => c.key)

export default {
  name: 'WechatPushConfig',
  data() {
    return {
      baseForm: {
        wechat_appid: '',
        wechat_appsecret: ''
      },
      templateForm: {},
      templateConfigs: TEMPLATE_CONFIGS,
      configStatus: {
        ready: false
      },
      savingBase: false,
      savingTemplates: false,
      testing: false,
      templateGuide: [
        { type: '维保任务逾期', keywords: '任务名称、项目名称、截止时间、状态', scene: '任务超时未完成自动或手动推送' },
        { type: '每月任务', keywords: '月份、任务数量、任务概要、通知时间', scene: '每月初定期推送当月任务' },
        { type: '合同到期', keywords: '合同名称、委托单位、到期时间、状态', scene: '合同到期前30/7/1天推送' },
        { type: '付款信息', keywords: '项目名称、付款金额、付款状态、付款日期', scene: '付款状态变更时推送' },
        { type: '任务状态', keywords: '任务名称、变更前状态、变更后状态、时间', scene: '任务派发/完成/评价等状态变更' }
      ]
    }
  },
  created() {
    this.initTemplateForm()
    this.loadAllConfigs()
  },
  methods: {
    initTemplateForm() {
      const form = {}
      TEMPLATE_KEYS.forEach(k => { form[k] = '' })
      this.templateForm = form
    },

    async loadAllConfigs() {
      try {
        const allKeys = [...BASE_CONFIG_KEYS, ...TEMPLATE_KEYS]
        const res = await batchGetConfigs(allKeys)
        if (res && res.success && res.data) {
          this.baseForm.wechat_appid = res.data.wechat_appid || ''
          this.baseForm.wechat_appsecret = res.data.wechat_appsecret || ''
          TEMPLATE_KEYS.forEach(k => {
            this.$set(this.templateForm, k, res.data[k] || '')
          })
          this.configStatus.ready = !!(res.data.wechat_appid && res.data.wechat_appsecret)
        }
      } catch (e) {
        console.error('加载配置失败:', e)
      }
    },

    async saveBaseConfig() {
      if (!this.baseForm.wechat_appid.trim()) {
        this.$message.warning('请输入 AppID')
        return
      }
      if (!this.baseForm.wechat_appsecret.trim()) {
        this.$message.warning('请输入 AppSecret')
        return
      }

      this.savingBase = true
      try {
        await batchUpdateConfigs([
          { key: 'wechat_appid', value: this.baseForm.wechat_appid.trim(), description: '微信公众号/小程序 AppID' },
          { key: 'wechat_appsecret', value: this.baseForm.wechat_appsecret.trim(), description: '微信公众号/小程序 AppSecret' }
        ])
        this.$message.success('基础配置保存成功')
        this.configStatus.ready = true
      } catch (e) {
        this.$message.error('保存失败: ' + (e.message || '未知错误'))
      } finally {
        this.savingBase = false
      }
    },

    async saveTemplateConfig() {
      const configs = TEMPLATE_CONFIGS.map(item => ({
        key: item.key,
        value: (this.templateForm[item.key] || '').trim(),
        description: item.label + '消息模板 ID'
      })).filter(c => c.value)

      if (!configs.length) {
        this.$message.warning('请至少填写一个模板 ID')
        return
      }

      this.savingTemplates = true
      try {
        await batchUpdateConfigs(configs)
        this.$message.success(`已保存 ${configs.length} 个模板配置`)
      } catch (e) {
        this.$message.error('保存失败: ' + (e.message || '未知错误'))
      } finally {
        this.savingTemplates = false
      }
    },

    async testConnection() {
      if (!this.baseForm.wechat_appid.trim() || !this.baseForm.wechat_appsecret.trim()) {
        this.$message.warning('请先填写并保存 AppID 和 AppSecret')
        return
      }

      this.testing = true
      try {
        const res = await getWechatConfig()
        if (res && res.success && res.data) {
          if (res.data.appIdConfigured && res.data.appSecretConfigured) {
            this.$message.success('微信配置已生效，连接正常')
          } else {
            this.$message.warning('配置未生效，请先保存配置')
          }
        }
      } catch (e) {
        this.$message.error('连接测试失败: ' + (e.message || '未知错误'))
      } finally {
        this.testing = false
      }
    }
  }
}
</script>

<style scoped>
.wechat-push-config {
  padding: 20px;
}

.config-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-hint {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

.guide-list {
  padding-left: 20px;
  line-height: 2;
  color: #606266;
}

.guide-list a {
  color: #409EFF;
}

.guide-text {
  color: #606266;
  line-height: 1.8;
}
</style>
