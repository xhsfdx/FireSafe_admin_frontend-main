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
          <el-menu-item index="all">
            <i class="el-icon-picture" />
            <span>全部教程</span>
          </el-menu-item>
          <el-menu-item 
            v-for="(section, index) in sections" 
            :key="index"
            :index="section.key"
          >
            <i :class="section.icon" />
            <span>{{ section.title }}</span>
          </el-menu-item>
        </el-menu>
        <div class="sidebar-actions">
          <el-button 
            type="primary" 
            icon="el-icon-printer" 
            @click="printToPDF"
            class="print-button"
          >
            打印为 PDF
          </el-button>
        </div>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="manual-content">
      <div class="content-header">
        <h2 class="content-title">{{ currentSectionTitle }}</h2>
        <div class="content-actions">
          <el-button 
            type="primary" 
            icon="el-icon-printer" 
            @click="printToPDF"
            size="small"
          >
            打印为 PDF
          </el-button>
        </div>
      </div>

      <div class="content-body" id="tutorial-content">
        <div 
          v-for="(image, index) in displayedImages" 
          :key="index"
          class="tutorial-image-wrapper"
        >
          <div class="image-container">
            <div class="image-header">
              <h3 class="image-title">{{ getImageTitle(image.name) }}</h3>
              <span class="image-step">{{ getStepNumber(image.name) }}</span>
            </div>
            <img 
              :src="image.path" 
              :alt="image.name"
              class="tutorial-image"
              @load="onImageLoad"
              @error="onImageError"
            />
            <div class="image-description">
              <p class="description-text">{{ getImageDescription(image.name) }}</p>
              <div v-if="getImageTips(image.name)" class="description-tips">
                <div class="tips-title">操作要点</div>
                <div v-for="(tip, tipIndex) in getImageTips(image.name)" :key="tipIndex" class="tip-item">
                  • {{ tip }}
                </div>
              </div>
            </div>
          </div>
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
      activeSection: 'all',
      images: [],
      sections: [
        { key: 'contract', title: '一、合同与项目创建（1-6）', icon: 'el-icon-document' },
        { key: 'account', title: '二、账号与打卡配置（9-11）', icon: 'el-icon-user' },
        { key: 'mobile', title: '三、移动端执行（12-16）', icon: 'el-icon-mobile-phone' },
        { key: 'inspection', title: '四、检查/AI/转故障（17-24）', icon: 'el-icon-view' },
        { key: 'report', title: '五、报告与系统配置（25-32）', icon: 'el-icon-folder-opened' },
        { key: 'owner', title: '六、业主端查看与评价（33-36）', icon: 'el-icon-star-on' }
      ],
      // 图片顺序映射（按HTML中的步骤顺序）
      imageOrder: {
        'Screenshot_20260115_170253.png': 1,
        'Screenshot_20260115_170423.png': 2,
        'Screenshot_20260115_170600.png': 3,
        'Screenshot_20260115_170727.png': 4,
        'Screenshot_20260115_170800.png': 5,
        'Screenshot_20260115_170826.png': 6,
        'pasted file.png': 9,
        'createaccount.png': 10,
        'Screenshot_20260115_171857.png': 11,
        'Screenshot_20260115_171943.png': 12,
        'Screenshot_20260115_172133.png': 13,
        'Screenshot_20260115_172213.png': 14,
        'Screenshot_20260115_172244.png': 15,
        'Screenshot_20260115_172311.png': 16,
        'Screenshot_20260115_180116.png': 17,
        'Screenshot_20260115_180252.png': 18,
        'Screenshot_20260115_180342.png': 19,
        'Screenshot_20260115_180502.png': 20,
        'Screenshot_20260115_180559.png': 21,
        'Screenshot_20260115_180658.png': 22,
        'Screenshot_20260115_180809.png': 23,
        'Screenshot_20260115_180947.png': 24,
        '报告.png': 25,
        'Screenshot_20260115_181206.png': 26,
        'upload.png': 27,
        'Screenshot_20260115_181706.png': 28,
        'Screenshot_20260115_181857.png': 29,
        'Screenshot_20260115_182003.png': 30,
        'Screenshot_20260115_182228.png': 31,
        'Screenshot_20260115_182321.png': 32,
        'Screenshot_20260115_182400.png': 33,
        'Screenshot_20260115_182513.png': 34,
        'Screenshot_20260115_182548.png': 35,
        'Screenshot_20260115_183023.png': 36
      }
    }
  },
  computed: {
    currentSectionTitle() {
      if (this.activeSection === 'all') {
        return '消防维保系统使用教程（图文版）'
      }
      const section = this.sections.find(s => s.key === this.activeSection)
      return section ? section.title : '操作手册'
    },
    displayedImages() {
      let filtered = this.images
      
      if (this.activeSection !== 'all') {
        filtered = this.images.filter(img => {
          return this.matchSection(img.name, this.activeSection)
        })
      }
      
      // 按步骤顺序排序
      return filtered.sort((a, b) => {
        const orderA = this.imageOrder[a.name] || 999
        const orderB = this.imageOrder[b.name] || 999
        return orderA - orderB
      })
    }
  },
  mounted() {
    this.loadImages()
  },
  methods: {
    loadImages() {
      // 按HTML中的顺序加载图片
      const imageFiles = [
        'Screenshot_20260115_170253.png',
        'Screenshot_20260115_170423.png',
        'Screenshot_20260115_170600.png',
        'Screenshot_20260115_170727.png',
        'Screenshot_20260115_170800.png',
        'Screenshot_20260115_170826.png',
        'pasted file.png',
        'createaccount.png',
        'Screenshot_20260115_171857.png',
        'Screenshot_20260115_171943.png',
        'Screenshot_20260115_172133.png',
        'Screenshot_20260115_172213.png',
        'Screenshot_20260115_172244.png',
        'Screenshot_20260115_172311.png',
        'Screenshot_20260115_180116.png',
        'Screenshot_20260115_180252.png',
        'Screenshot_20260115_180342.png',
        'Screenshot_20260115_180502.png',
        'Screenshot_20260115_180559.png',
        'Screenshot_20260115_180658.png',
        'Screenshot_20260115_180809.png',
        'Screenshot_20260115_180947.png',
        '报告.png',
        'Screenshot_20260115_181206.png',
        'upload.png',
        'Screenshot_20260115_181706.png',
        'Screenshot_20260115_181857.png',
        'Screenshot_20260115_182003.png',
        'Screenshot_20260115_182228.png',
        'Screenshot_20260115_182321.png',
        'Screenshot_20260115_182400.png',
        'Screenshot_20260115_182513.png',
        'Screenshot_20260115_182548.png',
        'Screenshot_20260115_183023.png'
      ]

      this.images = imageFiles.map(file => ({
        name: file,
        path: `/tutorial_pics/${encodeURIComponent(file)}`
      }))
    },
    matchSection(imageName, sectionKey) {
      const step = this.imageOrder[imageName] || 0
      
      const sectionRanges = {
        contract: [1, 2, 3, 4, 5, 6],
        account: [9, 10, 11],
        mobile: [12, 13, 14, 15, 16],
        inspection: [17, 18, 19, 20, 21, 22, 23, 24],
        report: [25, 26, 27, 28, 29, 30, 31, 32],
        owner: [33, 34, 35, 36]
      }
      
      return sectionRanges[sectionKey]?.includes(step) || false
    },
    getStepNumber(imageName) {
      const step = this.imageOrder[imageName]
      return step ? `Step ${step}` : ''
    },
    getImageTitle(imageName) {
      const titles = {
        'Screenshot_20260115_170253.png': 'Step 1｜新增合同信息',
        'Screenshot_20260115_170423.png': 'Step 2｜建筑信息 + 合同维保内容',
        'Screenshot_20260115_170600.png': 'Step 3｜新增项目（合同落地）',
        'Screenshot_20260115_170727.png': 'Step 4｜配置维保人员（责任链）',
        'Screenshot_20260115_170800.png': 'Step 5｜人员配置确认（复核）',
        'Screenshot_20260115_170826.png': 'Step 6｜维保计划列表（生成计划）',
        'pasted file.png': 'Step 9｜人员卡片：创建账号入口',
        'createaccount.png': 'Step 10｜创建账号（密码规则）',
        'Screenshot_20260115_171857.png': 'Step 11｜打卡区域设置（地理围栏）',
        'Screenshot_20260115_171943.png': 'Step 12｜登录系统（移动端）',
        'Screenshot_20260115_172133.png': 'Step 13｜移动端首页',
        'Screenshot_20260115_172213.png': 'Step 14｜维保服务（工作台）',
        'Screenshot_20260115_172244.png': 'Step 15｜打卡签到（到场证明）',
        'Screenshot_20260115_172311.png': 'Step 16｜例行维保执行页（清单 + 描述）',
        'Screenshot_20260115_180116.png': 'Step 17｜维保检查 + AI 聊天入口',
        'Screenshot_20260115_180252.png': 'Step 18｜异常上报',
        'Screenshot_20260115_180342.png': 'Step 19｜不合格自动转工单',
        'Screenshot_20260115_180502.png': 'Step 20｜待审批列表',
        'Screenshot_20260115_180559.png': 'Step 21｜审批详情',
        'Screenshot_20260115_180658.png': 'Step 22｜故障工单',
        'Screenshot_20260115_180809.png': 'Step 23｜故障处理',
        'Screenshot_20260115_180947.png': 'Step 24｜任务完成总览',
        '报告.png': 'Step 25｜生成《消防维保服务报告》（例行）',
        'Screenshot_20260115_181206.png': 'Step 26｜生成《故障维修记录报告》（故障工单）',
        'upload.png': 'Step 27｜上传文件管理（服务器存储）',
        'Screenshot_20260115_181706.png': 'Step 28｜AI 配置（DeepSeek API Key）',
        'Screenshot_20260115_181857.png': 'Step 29｜新增业主单位账号（业主可查看/评价）',
        'Screenshot_20260115_182003.png': 'Step 30｜工作上报入口（合同外事项）',
        'Screenshot_20260115_182228.png': 'Step 31｜工作上报填写（含签字）',
        'Screenshot_20260115_182321.png': 'Step 32｜后台工作上报管理（下载/审核）',
        'Screenshot_20260115_182400.png': 'Step 33｜生成《工作上报报告》',
        'Screenshot_20260115_182513.png': 'Step 34｜业主单位入口（业主端）',
        'Screenshot_20260115_182548.png': 'Step 35｜业主单位详情（透明责任人）',
        'Screenshot_20260115_183023.png': 'Step 36｜项目详情与评价状态'
      }
      return titles[imageName] || imageName
    },
    getImageDescription(imageName) {
      const descriptions = {
        'Screenshot_20260115_170253.png': '在后台创建维保合同的商务与法律基础信息（委托单位、合同时间、维保方式、金额、附件等）。这是后续"项目、任务、计划"的根基。',
        'Screenshot_20260115_170423.png': '填写建筑物参数（面积、层数、高度等）并选择维保系统清单与检查项。系统后续会按"维保周期（月检等）"自动生成计划与任务。',
        'Screenshot_20260115_170600.png': '将合同绑定到一个真实项目：填写地址、联系人与电话，并在地图上选点定位。定位将用于移动端签到打卡。',
        'Screenshot_20260115_170727.png': '为项目绑定技术负责人、项目负责人、现场维护人员。该责任链将贯穿"派发、审批、审计"全过程。',
        'Screenshot_20260115_170800.png': '汇总展示"业主单位/项目/负责人/现场人员"，用于创建前最终校验，避免责任配置遗漏。',
        'Screenshot_20260115_170826.png': '合同 + 周期 = 自动生成计划。管理员可点击"制定本月任务"，正式生成当月例行维保任务。',
        'pasted file.png': '人员档案与系统账号分离：先有人，再为人创建登录账号。点击"创建账号"进入账号创建页。',
        'createaccount.png': '为人员创建系统登录凭证：用户名/手机号默认一致，密码必须包含"字母 + 数字"，支持后续重复修改密码。',
        'Screenshot_20260115_171857.png': '为每个项目设置签到范围（公里）。移动端到场签到会根据此范围判断"是否到达指定签到范围"。',
        'Screenshot_20260115_171943.png': '使用账号密码登录。支持"用户名登录 / 手机号登录"，并需要勾选用户协议与隐私政策。',
        'Screenshot_20260115_172133.png': '现场人员主入口。进入"维保服务"可执行例行维保、处理故障工单、附加维保与工作上报。',
        'Screenshot_20260115_172213.png': '展示当前待处理/处理中/待审批/已完成等统计，并提供业务入口：例行维保、故障工单、附加维保、工作上报。',
        'Screenshot_20260115_172244.png': '到达项目地理围栏范围后进行签到。系统记录签到时间与位置，作为任务开始的关键证据。',
        'Screenshot_20260115_172311.png': '按检查清单逐项执行；填写"维护保养情况描述"，完成后提交进入审批与评价流程。',
        'Screenshot_20260115_180116.png': '在检查过程中可以使用AI聊天助手获取帮助。选择"不合格/异常"会触发故障工单创建。',
        'Screenshot_20260115_180252.png': '发现异常情况时进行上报，填写异常描述并上传相关照片，系统会自动创建故障工单。',
        'Screenshot_20260115_180342.png': '选择"不合格/异常"会触发故障工单：请务必填写描述并上传照片，形成可审计证据链。',
        'Screenshot_20260115_180502.png': '查看待审批的任务列表，包括例行维保任务和故障工单，等待负责人审批通过。',
        'Screenshot_20260115_180559.png': '查看审批详情，包括任务信息、维保内容、检测结果、现场照片等，进行审批操作。',
        'Screenshot_20260115_180658.png': '查看故障工单列表，包括待处理、处理中、已完成等状态的故障工单。',
        'Screenshot_20260115_180809.png': '处理故障工单：填写处理描述、上传处理照片，故障处理同样要"签到/拍照/描述/提交"，才能形成可审计证据链。',
        'Screenshot_20260115_180947.png': '查看任务完成总览，包括已完成的任务统计、评价情况等。最终由负责人/技术负责人或后台审批通过后闭环。',
        '报告.png': '例行维保完成后可生成正式报告，包含：基本信息、维保人员、检测统计、检测详情、故障记录、现场照片、任务进度等。',
        'Screenshot_20260115_181206.png': '故障工单完成后可生成独立维修报告，记录上报信息、故障照片、处理情况、处理照片与处理进度，便于单点归档与追溯。',
        'upload.png': '系统照片/附件统一存储在服务器，可按选中删除、按时间清理（例如删除一周前/一月前文件），避免空间不足影响上传。',
        'Screenshot_20260115_181706.png': '配置 AI Key 后，"AI 聊天 / AI 维保助手"才能可用。未配置或不可用时，会提示稍后重试。',
        'Screenshot_20260115_181857.png': '为业主创建独立账号，用于查看自身项目、查看报告、提交评价。权限与维保人员隔离，符合最小权限原则。',
        'Screenshot_20260115_182003.png': '适用于维保合同以外的事务：故障处理、维保抽查、培训演练、其他事项。上报后后台可记录并生成报告。',
        'Screenshot_20260115_182228.png': '填写处理描述、上传处理照片，并由"项目单位人员 + 维保人员"双方签字确认。可选：同步创建附加维保。',
        'Screenshot_20260115_182321.png': '后台可按项目/业主/时间筛选，查看详情、审核、删除，并支持下载报告或一键下载所选报告。',
        'Screenshot_20260115_182400.png': '工作上报也会生成正式报告（包含上报信息、工作内容、照片、签名），用于对甲方透明交付与后续审计。',
        'Screenshot_20260115_182513.png': '业主可进入自己的单位主页，查看服务状态，并查看自己拥有多少项目与项目详情。',
        'Screenshot_20260115_182548.png': '展示项目名称、地址、联系人电话，并向业主公开：技术负责人、项目负责人、现场维保人员，增强服务透明度与信任。',
        'Screenshot_20260115_183023.png': '业主可查看项目在某个月份的维保情况与评分（已评价 / 未评价）。评价是服务质量闭环的重要指标。'
      }
      return descriptions[imageName] || '此图片展示了系统某个功能的操作界面，请参考图片内容进行操作。'
    },
    getImageTips(imageName) {
      const tips = {
        'Screenshot_20260115_170253.png': [
          '合同信息建议一次填写完整，后续减少变更成本',
          '合同附件支持 DOCX/PDF/PNG/JPG，用于审计留痕'
        ],
        'Screenshot_20260115_170423.png': [
          '维保系统建议按现场真实系统勾选',
          '检查项将成为移动端执行清单，越清晰越好'
        ],
        'Screenshot_20260115_170600.png': [
          '联系方式用于现场联系与故障工单联络',
          '地图选点越准确，签到误判越少'
        ],
        'Screenshot_20260115_170727.png': [
          '技术负责人/项目负责人必选',
          '现场维护人员至少 1 人'
        ],
        'Screenshot_20260115_180342.png': [
          '选择"不合格/异常"会触发故障工单：请务必填写描述并上传照片',
          '故障处理同样要"签到/拍照/描述/提交"，才能形成可审计证据链',
          '最终由负责人/技术负责人或后台审批通过后闭环'
        ],
        'Screenshot_20260115_182228.png': [
          '处理描述',
          '处理照片',
          '项目单位人员签字',
          '维保人员签字'
        ]
      }
      return tips[imageName] || null
    },
    handleMenuSelect(index) {
      this.activeSection = index
      // 滚动到顶部
      const contentBody = document.querySelector('.content-body')
      if (contentBody) {
        contentBody.scrollTop = 0
      }
    },
    onImageLoad(event) {
      // 图片加载成功
    },
    onImageError(event) {
      // 图片加载失败
      console.error('图片加载失败:', event.target.src)
      this.$message.error('部分图片加载失败')
    },
    printToPDF() {
      // 只打印内容区域：克隆 content-body 到新窗口再打印
      const contentEl = this.$el.querySelector('.content-body')
      if (!contentEl) {
        this.$message.error('无法找到打印内容')
        return
      }

      const printContents = contentEl.innerHTML
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        this.$message.error('无法打开打印窗口，请检查浏览器弹窗设置')
        return
      }

      // 基础样式，保证打印效果
      const style = `
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 20px 30px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
            Arial, 'Noto Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif;
          color: #333;
          background: #fff;
        }
        .tutorial-image-wrapper {
          margin-bottom: 30px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e4e7ed;
          padding: 20px;
          page-break-inside: avoid;
        }
        .image-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e4e7ed;
        }
        .image-title {
          margin: 0;
          color: #303133;
          font-size: 18px;
          font-weight: 600;
        }
        .image-step {
          color: #909399;
          font-size: 14px;
          background: #f0f2f5;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 600;
        }
        .tutorial-image {
          width: 100%;
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 4px;
          margin: 15px 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          object-fit: contain;
        }
        /* 移动端竖屏截图打印样式 */
        .tutorial-image[src*="Screenshot_20260115_171943"],
        .tutorial-image[src*="Screenshot_20260115_172133"],
        .tutorial-image[src*="Screenshot_20260115_172213"],
        .tutorial-image[src*="Screenshot_20260115_172244"],
        .tutorial-image[src*="Screenshot_20260115_172311"],
        .tutorial-image[src*="Screenshot_20260115_180116"],
        .tutorial-image[src*="Screenshot_20260115_180252"],
        .tutorial-image[src*="Screenshot_20260115_180342"],
        .tutorial-image[src*="Screenshot_20260115_180502"],
        .tutorial-image[src*="Screenshot_20260115_180559"],
        .tutorial-image[src*="Screenshot_20260115_180658"],
        .tutorial-image[src*="Screenshot_20260115_180809"],
        .tutorial-image[src*="Screenshot_20260115_182003"],
        .tutorial-image[src*="Screenshot_20260115_182228"],
        .tutorial-image[src*="Screenshot_20260115_182513"],
        .tutorial-image[src*="Screenshot_20260115_182548"] {
          max-width: 350px;
          width: auto;
        }
        /* 横向长条截图打印样式 */
        .tutorial-image[src*="Screenshot_20260115_170800"],
        .tutorial-image[src*="Screenshot_20260115_170826"],
        .tutorial-image[src*="Screenshot_20260115_181706"],
        .tutorial-image[src*="Screenshot_20260115_182321"] {
          max-height: 250px;
          width: 100%;
        }
        .tutorial-image[src*="Screenshot_20260115_183023"] {
          max-width: 400px;
          width: auto;
        }
        .image-description {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #409eff;
        }
        .description-text {
          margin: 0 0 10px 0;
          color: #606266;
          font-size: 16px;
          line-height: 2;
          text-align: left;
        }
        .description-tips {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e4e7ed;
        }
        .tips-title {
          font-weight: 800;
          color: #303133;
          font-size: 15px;
          margin-bottom: 8px;
        }
        .tip-item {
          color: #606266;
          font-size: 15px;
          line-height: 2;
          margin-bottom: 6px;
        }
        @media print {
          .tutorial-image-wrapper {
            page-break-inside: avoid;
            margin-bottom: 20px;
            box-shadow: none;
          }
        }
      `

      printWindow.document.open()
      printWindow.document.write(`
        <html>
          <head>
            <title>消防维保系统使用教程</title>
            <meta charset="utf-8" />
            <style>${style}</style>
          </head>
          <body>
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 26px; font-weight: 900; margin: 6px 0;">消防维保系统使用教程（图文版）</h1>
              <div style="font-size: 14px; color: #555; margin-top: 10px;">
                生成时间：${new Date().toLocaleString('zh-CN')}
              </div>
            </div>
            ${printContents}
          </body>
        </html>
      `)
      printWindow.document.close()

      // 等待渲染完成再打印
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
        // 打印后可以选择关闭窗口，或者保留让用户查看
        // printWindow.close()
      }
    }
  }
}
</script>

<style scoped>
.manual-container {
  display: flex;
  height: calc(100vh - 84px);
  background: #f7fafd;
}

.manual-sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: relative;
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.manual-menu {
  flex: 1;
  border: none;
  background: transparent;
  overflow-y: auto;
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

.sidebar-actions {
  padding: 15px;
  border-top: 1px solid #e4e7ed;
  background: #f8f9fa;
}

.print-button {
  width: 100%;
}

.manual-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

.content-header {
  padding: 20px 30px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.content-title {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.content-actions {
  display: flex;
  gap: 10px;
}

.content-body {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  background: #f5f5f5;
}

.tutorial-image-wrapper {
  margin-bottom: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  page-break-inside: avoid;
}

.image-container {
  padding: 20px;
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e4e7ed;
}

.image-title {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.image-step {
  color: #909399;
  font-size: 14px;
  background: #f0f2f5;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
}

.tutorial-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  object-fit: contain;
  margin: 0 auto;
}

/* 针对不同尺寸的图片进行优化 */
.tutorial-image[src*="Screenshot_20260115_171943"],
.tutorial-image[src*="Screenshot_20260115_172133"],
.tutorial-image[src*="Screenshot_20260115_172213"],
.tutorial-image[src*="Screenshot_20260115_172244"],
.tutorial-image[src*="Screenshot_20260115_172311"],
.tutorial-image[src*="Screenshot_20260115_180116"],
.tutorial-image[src*="Screenshot_20260115_180252"],
.tutorial-image[src*="Screenshot_20260115_180342"],
.tutorial-image[src*="Screenshot_20260115_180502"],
.tutorial-image[src*="Screenshot_20260115_180559"],
.tutorial-image[src*="Screenshot_20260115_180658"],
.tutorial-image[src*="Screenshot_20260115_180809"],
.tutorial-image[src*="Screenshot_20260115_182003"],
.tutorial-image[src*="Screenshot_20260115_182228"],
.tutorial-image[src*="Screenshot_20260115_182513"],
.tutorial-image[src*="Screenshot_20260115_182548"] {
  /* 移动端竖屏截图：限制最大宽度 */
  max-width: 400px;
  width: auto;
}

.tutorial-image[src*="Screenshot_20260115_170800"],
.tutorial-image[src*="Screenshot_20260115_170826"],
.tutorial-image[src*="Screenshot_20260115_181706"],
.tutorial-image[src*="Screenshot_20260115_182321"] {
  /* 横向长条截图：限制最大高度 */
  max-height: 300px;
  width: 100%;
}

.tutorial-image[src*="Screenshot_20260115_183023"] {
  /* 小尺寸截图：限制最大宽度 */
  max-width: 500px;
  width: auto;
}

.image-description {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.description-text {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 16px;
  line-height: 2;
  text-align: left;
}

.description-tips {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
}

.tips-title {
  font-weight: 800;
  color: #303133;
  font-size: 14px;
  margin-bottom: 8px;
}

.tip-item {
  color: #606266;
  font-size: 15px;
  line-height: 2;
  margin-bottom: 6px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .manual-sidebar {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .manual-container {
    flex-direction: column;
    height: auto;
  }

  .manual-sidebar {
    width: 100%;
    height: auto;
    max-height: 300px;
  }

  .content-body {
    padding: 20px;
  }
}

/* 打印样式 */
@media print {
  .manual-sidebar {
    display: none !important;
  }

  .content-header {
    display: none !important;
  }

  .manual-content {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .content-body {
    padding: 20px !important;
    background: #fff !important;
  }

  .tutorial-image-wrapper {
    page-break-inside: avoid;
    margin-bottom: 20px;
    box-shadow: none;
    border: 1px solid #ddd;
  }

  .tutorial-image {
    max-width: 100% !important;
    height: auto !important;
    object-fit: contain !important;
  }
  /* 移动端竖屏截图打印时适当缩小 */
  .tutorial-image[src*="Screenshot_20260115_171943"],
  .tutorial-image[src*="Screenshot_20260115_172133"],
  .tutorial-image[src*="Screenshot_20260115_172213"],
  .tutorial-image[src*="Screenshot_20260115_172244"],
  .tutorial-image[src*="Screenshot_20260115_172311"],
  .tutorial-image[src*="Screenshot_20260115_180116"],
  .tutorial-image[src*="Screenshot_20260115_180252"],
  .tutorial-image[src*="Screenshot_20260115_180342"],
  .tutorial-image[src*="Screenshot_20260115_180502"],
  .tutorial-image[src*="Screenshot_20260115_180559"],
  .tutorial-image[src*="Screenshot_20260115_180658"],
  .tutorial-image[src*="Screenshot_20260115_180809"],
  .tutorial-image[src*="Screenshot_20260115_182003"],
  .tutorial-image[src*="Screenshot_20260115_182228"],
  .tutorial-image[src*="Screenshot_20260115_182513"],
  .tutorial-image[src*="Screenshot_20260115_182548"] {
    max-width: 350px !important;
    width: auto !important;
  }
  /* 横向长条截图打印时限制高度 */
  .tutorial-image[src*="Screenshot_20260115_170800"],
  .tutorial-image[src*="Screenshot_20260115_170826"],
  .tutorial-image[src*="Screenshot_20260115_181706"],
  .tutorial-image[src*="Screenshot_20260115_182321"] {
    max-height: 200px !important;
    width: 100% !important;
  }
}
</style>
