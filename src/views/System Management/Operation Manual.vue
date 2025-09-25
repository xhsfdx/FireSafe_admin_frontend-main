<template>
  <div class="manual-container">
    <!-- 左侧目录导航 -->
    <div class="manual-sidebar">
      <div class="sidebar-header">
        <h3>操作手册目录</h3>
      </div>
      <div class="sidebar-content">
        <el-menu
          :default-active="activeSection"
          class="manual-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="register">
            <i class="el-icon-user"></i>
            <span>注册、登录</span>
          </el-menu-item>
          <el-menu-item index="dashboard">
            <i class="el-icon-s-home"></i>
            <span>系统概览</span>
          </el-menu-item>
          <el-menu-item index="agency">
            <i class="el-icon-office-building"></i>
            <span>服务机构管理</span>
          </el-menu-item>
          <el-menu-item index="project">
            <i class="el-icon-folder"></i>
            <span>项目管理</span>
          </el-menu-item>
          <el-menu-item index="maintenance">
            <i class="el-icon-s-tools"></i>
            <span>维护业务管理</span>
          </el-menu-item>
          <el-menu-item index="system">
            <i class="el-icon-setting"></i>
            <span>系统管理</span>
          </el-menu-item>
          <el-menu-item index="troubleshooting">
            <i class="el-icon-warning"></i>
            <span>常见问题</span>
          </el-menu-item>
          <el-menu-item index="contact">
            <i class="el-icon-phone"></i>
            <span>联系我们</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="manual-content">
      
      <div class="content-body">
        <div class="pdf-container">
          <iframe
            ref="pdfViewer"
            :src="pdfUrl"
            frameborder="0"
            class="pdf-iframe"
            title="操作手册"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationManual',
  data() {
    return {
      activeSection: 'register',
      zoomLevel: 'auto',
      pdfUrl: '/web/viewer.html?file=/pdf/3.pdf&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&nav=0&zoom=auto&pagemode=none&disableworker=true'
    }
  },
  methods: {
    handleMenuSelect(index) {
      this.activeSection = index
      // 这里可以根据选择的章节跳转到PDF的对应页面
      this.jumpToSection(index)
    },
    
    jumpToSection(section) {
      // 根据章节跳转到PDF的对应页面
      const pageMap = {
        'register': 1,
        'dashboard': 5,
        'agency': 10,
        'project': 15,
        'maintenance': 20,
        'system': 25,
        'troubleshooting': 40,
        'contact': 50
      }
      
      const page = pageMap[section] || 1
      const newUrl = `/web/viewer.html?file=/pdf/3.pdf&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&nav=0&zoom=auto&pagemode=none&disableworker=true#page=${page}`
      this.pdfUrl = newUrl
    },
    
    zoomIn() {
      // 放大功能
      this.$message.info('放大功能')
    },
    
    zoomOut() {
      // 缩小功能
      this.$message.info('缩小功能')
    }
  }
}
</script>

<style scoped>
.manual-container {
  display: flex;
  height: 100vh;
  background: #f7fafd;
}

.manual-sidebar {
  width: 350px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  position: relative;
  transform: translateX(-20px);
}

.manual-sidebar::after {
  content: '';
  position: absolute;
  top: 0;
  right: -80px;
  width: 80px;
  height: 100%;
  background: #fff;
  z-index: 11;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #f8f9fa;
}

.sidebar-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.manual-menu {
  border: none;
  background: transparent;
}

.manual-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  border-bottom: 1px solid #f5f5f5;
}

.manual-menu .el-menu-item:hover {
  background-color: #f0f9ff;
  color: #409eff;
}

.manual-menu .el-menu-item.is-active {
  background-color: #e6f7ff;
  color: #409eff;
  border-right: 3px solid #409eff;
}

.manual-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}


.content-body {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #f5f5f5;
}

.pdf-container {
  width: calc(100% - 10px);
  height: 100%;
  position: absolute;
  top: 0;
  left: -90px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #fff;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transform: scale(1.35) translateX(-140px);
  transform-origin: top left;
}

/* 确保PDF查看器内部样式 */
.pdf-iframe::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .manual-sidebar {
    width: 320px;
    transform: translateX(-15px);
  }
  
  .pdf-container {
    left: -80px;
    width: calc(100% - 5px);
    top: 0;
  }
  
  .pdf-iframe {
    transform: scale(1.3) translateX(-120px);
  }
  
  .manual-sidebar::after {
    right: -70px;
    width: 70px;
  }
}

@media (max-width: 768px) {
  .manual-sidebar {
    width: 280px;
    transform: translateX(-10px);
  }
  
  .sidebar-header h3 {
    font-size: 14px;
  }
  
  .manual-menu .el-menu-item {
    height: 45px;
    line-height: 45px;
    padding-left: 15px;
    font-size: 13px;
  }
  
  .pdf-container {
    left: -60px;
    width: calc(100% - 5px);
    top: 0;
  }
  
  .pdf-iframe {
    transform: scale(1.25) translateX(-90px);
  }
  
  .manual-sidebar::after {
    right: -60px;
    width: 60px;
  }
}

@media (max-width: 480px) {
  .manual-container {
    flex-direction: column;
  }
  
  .manual-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .manual-content {
    height: calc(100vh - 200px);
  }
}
</style>
