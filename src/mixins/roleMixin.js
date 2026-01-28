/**
 * 角色权限混入
 * 在组件中使用: mixins: [roleMixin]
 */

import { isOwner, isAdmin, isSuperAdmin, canViewSensitiveData, canEdit, maskAmount, maskSensitiveText } from '@/utils/roleUtils'

export default {
  computed: {
    /**
     * 当前用户是否是业主
     */
    $isOwner() {
      return isOwner()
    },
    
    /**
     * 当前用户是否是管理员
     */
    $isAdmin() {
      return isAdmin()
    },
    
    /**
     * 当前用户是否是超级管理员
     */
    $isSuperAdmin() {
      return isSuperAdmin()
    },
    
    /**
     * 当前用户是否可以查看敏感数据
     */
    $canViewSensitiveData() {
      return canViewSensitiveData()
    },
    
    /**
     * 当前用户是否可以编辑
     */
    $canEdit() {
      return canEdit()
    }
  },
  
  methods: {
    /**
     * 脱敏金额显示
     * @param {number|string} amount 
     */
    $maskAmount(amount) {
      return maskAmount(amount)
    },
    
    /**
     * 脱敏敏感文本
     * @param {string} text 
     */
    $maskSensitiveText(text) {
      return maskSensitiveText(text)
    }
  }
}
