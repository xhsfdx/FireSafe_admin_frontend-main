<template>
  <div class="admin-permission">
    <el-card>
      <div slot="header" class="clearfix">
        <span>管理员页面权限配置</span>
        <el-button
          style="float: right"
          type="primary"
          size="small"
          @click="openCreateDialog"
        >
          新增管理员
        </el-button>
      </div>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-card shadow="never" class="admin-list-card">
            <div slot="header">
              <span>管理员列表</span>
              <span class="admin-count">共 {{ adminList.length }} 人</span>
            </div>
            <el-table
              :data="adminList"
              height="500"
              border
              highlight-current-row
              @row-click="handleSelectAdmin"
              v-loading="loading"
            >
              <el-table-column prop="name" label="姓名" width="100" />
              <el-table-column prop="mobile" label="手机号" width="130" />
              <el-table-column prop="role" label="角色" width="80">
                <template slot-scope="{ row }">
                  <el-tag size="mini" :type="row.role === 'superadmin' ? 'danger' : ''">
                    {{ row.role === 'superadmin' ? '超管' : '管理员' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70" align="center">
                <template slot-scope="{ row }">
                  <el-popconfirm
                    v-if="row.role !== 'superadmin'"
                    title="确定删除该管理员账号？此操作不可恢复！"
                    confirm-button-text="删除"
                    cancel-button-text="取消"
                    confirm-button-type="danger"
                    @confirm="handleDeleteAdmin(row)"
                  >
                    <el-button
                      slot="reference"
                      type="text"
                      size="small"
                      style="color: #F56C6C"
                    >删除</el-button>
                  </el-popconfirm>
                  <span v-else style="color: #C0C4CC; font-size: 12px">—</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="14">
          <el-card shadow="never" class="permission-card">
            <div slot="header" class="clearfix">
              <span>页面权限</span>
              <span v-if="currentAdmin" class="current-admin">
                当前：{{ currentAdmin.name }} ({{ currentAdmin.mobile }})
              </span>
            </div>

            <div v-if="!currentAdmin" class="empty-tip">
              请先在左侧选择一个管理员
            </div>

            <div v-else>
              <el-alert
                v-if="currentAdmin.role === 'superadmin'"
                type="info"
                :closable="false"
                show-icon
                style="margin-bottom: 12px"
              >
                超级管理员默认拥有所有权限，无需单独配置。
              </el-alert>

              <div v-else>
                <el-tree
                  ref="tree"
                  :data="permissionTree"
                  node-key="key"
                  show-checkbox
                  default-expand-all
                  :props="{ label: 'title', children: 'children' }"
                  :default-checked-keys="checkedKeys"
                  @check-change="handleCheckChange"
                />

                <div class="actions">
                  <el-button type="primary" size="small" @click="handleSave" :loading="saving">
                    保存
                  </el-button>
                  <el-button size="small" @click="resetSelection">
                    重置
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 新建管理员弹窗 -->
    <el-dialog
      title="新增管理员"
      :visible.sync="createDialogVisible"
      width="400px"
      @close="handleCreateCancel"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        :rules="createRules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="createForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" type="password" show-password placeholder="请输入密码（至少6位）" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCreateCancel">取 消</el-button>
        <el-button type="primary" :loading="createLoading" @click="handleCreateConfirm">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchAdminUsers, updateAdminUser, createAdminUser, deleteAdminUser } from '@/api/admin'

const permissionTree = [
  {
    key: 'owner',
    title: '项目管理',
    children: [
      { key: 'owner.project', title: '单位项目管理' },
      { key: 'owner.point', title: '维保点位管理' },
      { key: 'owner.payment', title: '结款管理' },
      { key: 'owner.plan', title: '维保计划管理' }
    ]
  },
  {
    key: 'maintenance',
    title: '维护业务管理',
    children: [
      { key: 'maintenance.routine', title: '例行维护' },
      { key: 'maintenance.fault', title: '故障工单' },
      { key: 'maintenance.support', title: '附加维护' },
      { key: 'maintenance.report', title: '工作上报' }
    ]
  },
  {
    key: 'chat',
    title: '消息管理',
    children: [
      { key: 'chat.management', title: '在线客服' },
      { key: 'chat.message-push', title: '微信消息推送' }
    ]
  },
  {
    key: 'system',
    title: '系统管理',
    children: [
      { key: 'system.checkin', title: '打卡区域设置' },
      { key: 'system.self-project', title: '自建维保项目' },
      { key: 'system.manual', title: '操作手册' },
      { key: 'system.owner-account', title: '业主单位账号' },
      { key: 'system.admin-permission', title: '管理员权限配置' },
      { key: 'system.upload-manager', title: '上传文件管理' },
      { key: 'system.ai-config', title: 'AI 配置' },
      { key: 'system.wechat-push-config', title: '微信推送配置' }
    ]
  }
]

export default {
  name: 'AdminPermission',
  data() {
    return {
      adminList: [],
      loading: false,
      saving: false,
      currentAdmin: null,
      permissionTree,
      checkedKeys: [],
      createDialogVisible: false,
      createForm: {
        name: '',
        mobile: '',
        password: ''
      },
      createLoading: false,
      createRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadAdmins()
  },
  methods: {
    async loadAdmins() {
      this.loading = true
      try {
        const res = await fetchAdminUsers({ limit: 100 })
        if (res && res.success && res.data && Array.isArray(res.data)) {
          this.adminList = res.data.filter(u => u.role === 'admin' || u.role === 'superadmin')
        } else {
          this.adminList = []
        }
      } catch (e) {
        this.$message.error('获取管理员列表失败: ' + (e.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },

    handleSelectAdmin(row) {
      this.currentAdmin = row
      this.checkedKeys = (row.pagePermissions || []).slice()
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.checkedKeys)
        }
      })
    },

    handleCheckChange() {
      if (!this.$refs.tree) return
      const keys = this.$refs.tree.getCheckedKeys()
      const leafKeys = []
      const collectLeafKeys = nodes => {
        nodes.forEach(n => {
          if (n.children && n.children.length) {
            collectLeafKeys(n.children)
          } else {
            if (keys.includes(n.key)) {
              leafKeys.push(n.key)
            }
          }
        })
      }
      collectLeafKeys(this.permissionTree)
      this.checkedKeys = leafKeys
    },

    resetSelection() {
      if (!this.currentAdmin) return
      this.checkedKeys = (this.currentAdmin.pagePermissions || []).slice()
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(this.checkedKeys)
      }
    },

    async handleSave() {
      if (!this.currentAdmin) {
        this.$message.warning('请先选择管理员')
        return
      }
      this.saving = true
      try {
        await updateAdminUser(this.currentAdmin._id, {
          pagePermissions: this.checkedKeys
        })
        this.$message.success('保存成功')
        this.currentAdmin.pagePermissions = this.checkedKeys.slice()
      } catch (e) {
        this.$message.error('保存失败')
      } finally {
        this.saving = false
      }
    },

    async handleDeleteAdmin(row) {
      try {
        await deleteAdminUser(row._id)
        this.$message.success(`已删除管理员：${row.name}`)
        if (this.currentAdmin && this.currentAdmin._id === row._id) {
          this.currentAdmin = null
          this.checkedKeys = []
        }
        await this.loadAdmins()
      } catch (e) {
        this.$message.error('删除失败: ' + (e.message || '未知错误'))
      }
    },

    openCreateDialog() {
      this.createForm = { name: '', mobile: '', password: '' }
      this.createDialogVisible = true
    },

    handleCreateCancel() {
      this.createDialogVisible = false
    },

    handleCreateConfirm() {
      this.$refs.createForm.validate(async valid => {
        if (!valid) return
        this.createLoading = true
        try {
          await createAdminUser({
            ...this.createForm,
            role: 'admin'
          })
          this.$message.success('创建成功')
          this.createDialogVisible = false
          await this.loadAdmins()
        } catch (e) {
          this.$message.error('创建失败: ' + (e.message || '未知错误'))
        } finally {
          this.createLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-permission {
  padding: 20px;
}

.admin-list-card,
.permission-card {
  height: 100%;
}

.admin-count {
  float: right;
  font-size: 12px;
  color: #909399;
  line-height: 24px;
}

.empty-tip {
  padding: 40px 0;
  text-align: center;
  color: #999;
}

.actions {
  margin-top: 16px;
  text-align: right;
}

.current-admin {
  float: right;
  font-size: 13px;
  color: #666;
}
</style>
