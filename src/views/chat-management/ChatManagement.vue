<template>
  <div class="chat-management">
    <!-- 左侧会话列表 -->
    <div class="conversation-list">
      <div class="list-header">
        <h3>消息列表</h3>
        <el-badge :value="totalUnread" :hidden="totalUnread === 0" class="unread-badge">
          <el-button size="small" icon="el-icon-refresh" circle @click="loadConversations" />
        </el-badge>
      </div>
      
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名/手机号"
          prefix-icon="el-icon-search"
          clearable
          size="small"
          @input="handleSearch"
        />
      </div>
      
      <!-- 会话列表 -->
      <div class="conversations" v-loading="loadingConversations">
        <div
          v-for="conv in conversations"
          :key="conv.conversationId"
          class="conversation-item"
          :class="{ active: selectedUserId === conv.user._id }"
          @click="selectConversation(conv)"
        >
          <div class="avatar">
            <el-avatar :size="48" :src="getAvatarUrl(conv.user.avatar)">
              {{ conv.user.name ? conv.user.name[0] : '?' }}
            </el-avatar>
            <span v-if="conv.unreadCount > 0" class="unread-dot">{{ conv.unreadCount > 99 ? '99+' : conv.unreadCount }}</span>
          </div>
          <div class="conv-info">
            <div class="conv-header">
              <span class="user-name">{{ conv.user.name || '未知用户' }}</span>
              <span class="conv-time">{{ formatTime(conv.lastMessage.createdAt) }}</span>
            </div>
            <div class="last-message">
              <span v-if="conv.lastMessage.isFromAdmin" class="admin-tag">[我]</span>
              {{ conv.lastMessage.messageType === 'image' ? '[图片]' : conv.lastMessage.content }}
            </div>
          </div>
        </div>
        
        <div v-if="conversations.length === 0 && !loadingConversations" class="empty-list">
          <i class="el-icon-chat-dot-square" />
          <p>暂无消息</p>
        </div>
      </div>
    </div>

    <!-- 右侧聊天窗口 -->
    <div class="chat-window">
      <template v-if="selectedUserId">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="user-info">
            <el-avatar :size="40" :src="getAvatarUrl(selectedUser.avatar)">
              {{ selectedUser.name ? selectedUser.name[0] : '?' }}
            </el-avatar>
            <div class="user-detail">
              <span class="name">{{ selectedUser.name || '未知用户' }}</span>
              <span class="mobile">{{ selectedUser.mobile || '' }}</span>
            </div>
          </div>
          <div class="chat-actions">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="handleExport"
              :loading="exporting"
            >
              导出记录
            </el-button>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="message-list" ref="messageList" v-loading="loadingMessages">
          <div v-if="hasMore" class="load-more" @click="loadMoreMessages">
            <span v-if="!loadingMore">加载更多</span>
            <span v-else><i class="el-icon-loading" /> 加载中...</span>
          </div>
          
          <div
            v-for="(msg, index) in messages"
            :key="msg._id"
            class="message-item"
            :class="{ 'self': msg.isFromAdmin, 'other': !msg.isFromAdmin }"
          >
            <!-- 时间分隔 -->
            <div v-if="shouldShowTime(index)" class="time-divider">
              {{ formatFullTime(msg.createdAt) }}
            </div>
            
            <div class="message-row">
              <el-avatar
                v-if="!msg.isFromAdmin"
                :size="36"
                :src="getAvatarUrl(selectedUser.avatar)"
                class="msg-avatar"
              >
                {{ selectedUser.name ? selectedUser.name[0] : '?' }}
              </el-avatar>
              
              <div class="message-content">
                <!-- 文本消息 -->
                <div v-if="msg.messageType === 'text'" class="text-bubble">
                  {{ msg.content }}
                </div>
                <!-- 图片消息 -->
                <div v-else-if="msg.messageType === 'image'" class="image-bubble">
                  <el-image
                    :src="getFullImageUrl(msg.imageUrl)"
                    :preview-src-list="[getFullImageUrl(msg.imageUrl)]"
                    fit="contain"
                    style="max-width: 300px; max-height: 300px; border-radius: 8px;"
                  />
                </div>
                <div class="message-meta">
                  <span class="msg-time">{{ formatMsgTime(msg.createdAt) }}</span>
                  <span v-if="msg.isFromAdmin && msg.isRead" class="read-status">已读</span>
                </div>
              </div>
              
              <el-avatar
                v-if="msg.isFromAdmin"
                :size="36"
                icon="el-icon-service"
                class="msg-avatar admin-avatar"
              />
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-tools">
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button icon="el-icon-picture-outline" circle size="small" title="发送图片" />
            </el-upload>
          </div>
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="输入消息，按 Ctrl+Enter 发送"
            resize="none"
            @keydown.ctrl.enter.native="sendMessage"
          />
          <el-button
            type="primary"
            :disabled="!inputMessage.trim()"
            :loading="sending"
            @click="sendMessage"
          >
            发送
          </el-button>
        </div>
      </template>

      <!-- 未选择会话时的占位 -->
      <div v-else class="no-conversation">
        <i class="el-icon-chat-line-square" />
        <p>请选择一个会话开始聊天</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getConversations,
  getMessagesByUserId,
  adminSendMessage,
  getAdminUnreadCount,
  markAsRead,
  exportChatHistory
} from '@/api/chat'
import { getToken } from '@/utils/auth'

export default {
  name: 'ChatManagement',
  data() {
    return {
      // 会话列表
      conversations: [],
      loadingConversations: false,
      searchKeyword: '',
      searchTimer: null,
      
      // 选中的用户
      selectedUserId: null,
      selectedUser: {},
      
      // 消息列表
      messages: [],
      loadingMessages: false,
      loadingMore: false,
      page: 1,
      hasMore: false,
      
      // 输入
      inputMessage: '',
      sending: false,
      
      // 导出
      exporting: false,
      
      // 未读数
      totalUnread: 0,
      
      // 轮询
      pollTimer: null,
      
      // 上传相关
      uploadUrl: process.env.VUE_APP_BASE_API + '/upload_img/upload_img',
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      }
    }
  },
  mounted() {
    this.loadConversations()
    this.loadUnreadCount()
    this.startPolling()
  },
  beforeDestroy() {
    this.stopPolling()
  },
  methods: {
    // 加载会话列表
    async loadConversations() {
      this.loadingConversations = true
      try {
        const res = await getConversations({
          page: 1,
          limit: 100,
          search: this.searchKeyword
        })
        if (res.success) {
          this.conversations = res.data || []
        }
      } catch (error) {
        console.error('加载会话列表失败:', error)
      } finally {
        this.loadingConversations = false
      }
    },
    
    // 搜索
    handleSearch() {
      if (this.searchTimer) clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.loadConversations()
      }, 300)
    },
    
    // 选择会话
    async selectConversation(conv) {
      this.selectedUserId = conv.user._id
      this.selectedUser = conv.user
      this.messages = []
      this.page = 1
      this.hasMore = false
      
      await this.loadMessages()
      
      // 标记为已读
      if (conv.unreadCount > 0) {
        await markAsRead(conv.user._id)
        conv.unreadCount = 0
        this.loadUnreadCount()
      }
    },
    
    // 加载消息
    async loadMessages() {
      if (!this.selectedUserId) return
      this.loadingMessages = true
      
      try {
        const res = await getMessagesByUserId(this.selectedUserId, {
          page: 1,
          limit: 50
        })
        if (res.success) {
          this.messages = res.data.messages || []
          this.hasMore = res.pagination && res.pagination.pages > 1
          this.page = 1
          
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      } catch (error) {
        console.error('加载消息失败:', error)
      } finally {
        this.loadingMessages = false
      }
    },
    
    // 加载更多消息
    async loadMoreMessages() {
      if (this.loadingMore || !this.hasMore) return
      this.loadingMore = true
      this.page++
      
      try {
        const res = await getMessagesByUserId(this.selectedUserId, {
          page: this.page,
          limit: 50
        })
        if (res.success && res.data.messages && res.data.messages.length > 0) {
          this.messages = [...res.data.messages, ...this.messages]
          this.hasMore = this.page < res.pagination.pages
        } else {
          this.hasMore = false
        }
      } catch (error) {
        console.error('加载更多消息失败:', error)
        this.page--
      } finally {
        this.loadingMore = false
      }
    },
    
    // 发送消息
    async sendMessage() {
      const content = this.inputMessage.trim()
      if (!content || this.sending) return
      
      this.sending = true
      this.inputMessage = ''
      
      try {
        const res = await adminSendMessage({
          userId: this.selectedUserId,
          content,
          messageType: 'text'
        })
        
        if (res.success) {
          this.messages.push(res.data)
          this.$nextTick(() => {
            this.scrollToBottom()
          })
          // 更新会话列表
          this.updateConversationLastMessage(res.data)
        } else {
          this.$message.error(res.message || '发送失败')
          this.inputMessage = content // 恢复输入
        }
      } catch (error) {
        console.error('发送消息失败:', error)
        this.$message.error('发送失败')
        this.inputMessage = content
      } finally {
        this.sending = false
      }
    },
    
    // 发送图片
    async sendImageMessage(imageUrl) {
      try {
        const res = await adminSendMessage({
          userId: this.selectedUserId,
          content: '[图片]',
          messageType: 'image',
          imageUrl
        })
        
        if (res.success) {
          this.messages.push(res.data)
          this.$nextTick(() => {
            this.scrollToBottom()
          })
          this.updateConversationLastMessage(res.data)
        } else {
          this.$message.error(res.message || '发送失败')
        }
      } catch (error) {
        console.error('发送图片失败:', error)
        this.$message.error('发送图片失败')
      }
    },
    
    // 上传前检查
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt10M = file.size / 1024 / 1024 < 10
      
      if (!isImage) {
        this.$message.error('只能上传图片文件')
        return false
      }
      if (!isLt10M) {
        this.$message.error('图片大小不能超过 10MB')
        return false
      }
      return true
    },
    
    // 上传成功
    handleUploadSuccess(res) {
      if (res.filePath) {
        this.sendImageMessage(res.filePath)
      } else {
        this.$message.error('上传失败')
      }
    },
    
    // 上传失败
    handleUploadError() {
      this.$message.error('上传失败')
    },
    
    // 导出聊天记录
    async handleExport() {
      if (this.exporting) return
      this.exporting = true
      
      try {
        const res = await exportChatHistory(this.selectedUserId)
        
        // 创建下载链接
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `聊天记录_${this.selectedUser.name || this.selectedUserId}_${new Date().toISOString().slice(0, 10)}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        this.$message.success('导出成功')
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败')
      } finally {
        this.exporting = false
      }
    },
    
    // 更新会话列表的最后一条消息
    updateConversationLastMessage(msg) {
      const conv = this.conversations.find(c => c.user._id === this.selectedUserId)
      if (conv) {
        conv.lastMessage = {
          content: msg.content,
          messageType: msg.messageType,
          imageUrl: msg.imageUrl,
          createdAt: msg.createdAt,
          isFromAdmin: msg.isFromAdmin
        }
        // 将该会话移到最前面
        const index = this.conversations.indexOf(conv)
        if (index > 0) {
          this.conversations.splice(index, 1)
          this.conversations.unshift(conv)
        }
      }
    },
    
    // 加载未读数
    async loadUnreadCount() {
      try {
        const res = await getAdminUnreadCount()
        if (res.success) {
          this.totalUnread = res.data.count || 0
        }
      } catch (error) {
        console.error('加载未读数失败:', error)
      }
    },
    
    // 开始轮询
    startPolling() {
      this.stopPolling()
      this.pollTimer = setInterval(() => {
        this.refreshData()
      }, 5000)
    },
    
    // 停止轮询
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
    },
    
    // 刷新数据
    async refreshData() {
      // 刷新会话列表
      try {
        const res = await getConversations({
          page: 1,
          limit: 100,
          search: this.searchKeyword
        })
        if (res.success) {
          this.conversations = res.data || []
        }
      } catch (error) {
        // 静默失败
      }
      
      // 刷新当前会话的消息
      if (this.selectedUserId) {
        try {
          const res = await getMessagesByUserId(this.selectedUserId, {
            page: 1,
            limit: 50
          })
          if (res.success) {
            const newMessages = res.data.messages || []
            if (newMessages.length > this.messages.length) {
              // 有新消息，添加新消息
              const existingIds = new Set(this.messages.map(m => m._id))
              const addedMessages = newMessages.filter(m => !existingIds.has(m._id))
              if (addedMessages.length > 0) {
                this.messages.push(...addedMessages)
                this.$nextTick(() => {
                  this.scrollToBottom()
                })
              }
            }
          }
        } catch (error) {
          // 静默失败
        }
      }
      
      // 刷新未读数
      this.loadUnreadCount()
    },
    
    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.messageList
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
    
    // 是否显示时间分隔
    shouldShowTime(index) {
      if (index === 0) return true
      const current = new Date(this.messages[index].createdAt)
      const prev = new Date(this.messages[index - 1].createdAt)
      return (current - prev) > 5 * 60 * 1000
    },
    
    // 格式化时间（简短）
    formatTime(dateStr) {
      const date = new Date(dateStr)
      const now = new Date()
      const isToday = date.toDateString() === now.toDateString()
      
      if (isToday) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      if (date.toDateString() === yesterday.toDateString()) {
        return '昨天'
      }
      
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    },
    
    // 格式化完整时间
    formatFullTime(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    // 格式化消息时间
    formatMsgTime(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    },
    
    // 获取头像URL
    getAvatarUrl(avatar) {
      if (!avatar) return ''
      if (avatar.startsWith('http')) return avatar
      return 'https://scbfxf.cn' + avatar
    },
    
    // 获取完整图片URL
    getFullImageUrl(url) {
      if (!url) return ''
      if (url.startsWith('http')) return url
      if (url.startsWith('/uploads')) return 'https://scbfxf.cn' + url
      return 'https://scbfxf.cn/uploads' + url
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-management {
  display: flex;
  height: calc(100vh - 84px);
  background-color: #f5f5f5;
}

/* 左侧会话列表 */
.conversation-list {
  width: 320px;
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
}

.unread-badge {
  ::v-deep .el-badge__content {
    background-color: #ff4500;
  }
}

.search-box {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.conversations {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f5f5f5;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &.active {
    background-color: #fff3ef;
  }
}

.avatar {
  position: relative;
  margin-right: 12px;
}

.unread-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 11px;
  color: #fff;
  background-color: #ff4500;
  border-radius: 9px;
  padding: 0 4px;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.conv-time {
  font-size: 12px;
  color: #999;
}

.last-message {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-tag {
  color: #ff4500;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  
  i {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  p {
    margin: 0;
  }
}

/* 右侧聊天窗口 */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
}

.chat-header {
  padding: 12px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-detail {
  margin-left: 12px;
  
  .name {
    display: block;
    font-size: 15px;
    font-weight: 500;
    color: #333;
  }
  
  .mobile {
    display: block;
    font-size: 12px;
    color: #999;
  }
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.load-more {
  text-align: center;
  padding: 12px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  
  &:hover {
    color: #ff4500;
  }
}

.time-divider {
  text-align: center;
  padding: 16px 0;
  font-size: 12px;
  color: #999;
}

.message-item {
  margin-bottom: 16px;
}

.message-row {
  display: flex;
  align-items: flex-start;
}

.message-item.other .message-row {
  flex-direction: row;
}

.message-item.self .message-row {
  flex-direction: row-reverse;
}

.msg-avatar {
  flex-shrink: 0;
  margin: 0 12px;
}

.admin-avatar {
  background-color: #ff4500;
}

.message-content {
  max-width: 60%;
}

.text-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
}

.message-item.other .text-bubble {
  background-color: #fff;
  border-top-left-radius: 4px;
}

.message-item.self .text-bubble {
  background: linear-gradient(135deg, #ff6b35 0%, #ff4500 100%);
  color: #fff;
  border-top-right-radius: 4px;
}

.image-bubble {
  padding: 4px;
  background-color: #fff;
  border-radius: 12px;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 11px;
  color: #999;
}

.message-item.self .message-meta {
  justify-content: flex-end;
}

.read-status {
  color: #67c23a;
}

/* 输入区域 */
.input-area {
  padding: 16px 20px;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.input-tools {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-area .el-textarea {
  flex: 1;
}

/* 未选择会话占位 */
.no-conversation {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  
  i {
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 14px;
  }
}
</style>
