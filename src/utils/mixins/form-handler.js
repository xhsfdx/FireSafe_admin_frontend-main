/**
 * 表单处理通用 Mixin
 * 提供表单验证、提交、错误处理等通用功能
 */
export default {
  data() {
    return {
      formLoading: false,
      formData: {},
      formRules: {}
    }
  },
  methods: {
    /**
     * 表单验证
     * @param {String} formRef - 表单ref名称
     */
    async validateForm(formRef = 'form') {
      try {
        await this.$refs[formRef].validate()
        return true
      } catch (error) {
        this.$message.warning('请完善表单信息')
        return false
      }
    },
    /**
     * 重置表单
     * @param {String} formRef - 表单ref名称
     */
    resetForm(formRef = 'form') {
      if (this.$refs[formRef]) {
        this.$refs[formRef].resetFields()
      }
      this.formData = {}
    },
    /**
     * 处理表单提交
     * @param {Function} submitFn - 提交函数
     * @param {String} successMsg - 成功消息
     * @param {Function} onSuccess - 成功回调
     */
    async handleSubmit(submitFn, successMsg = '操作成功', onSuccess = null) {
      if (!await this.validateForm()) {
        return false
      }
      
      this.formLoading = true
      try {
        const res = await submitFn()
        if (res && res.success) {
          this.$message.success(successMsg)
          if (onSuccess) {
            onSuccess(res)
          }
          return true
        } else {
          const errorMsg = res?.message || '操作失败'
          this.$message.error(errorMsg)
          return false
        }
      } catch (error) {
        console.error('提交错误:', error)
        this.$message.error('操作失败: ' + (error.message || '未知错误'))
        return false
      } finally {
        this.formLoading = false
      }
    }
  }
}

