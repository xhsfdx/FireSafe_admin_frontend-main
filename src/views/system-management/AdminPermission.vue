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
            </div>
            <el-table
              :data="adminList"
              height="400"
              border
              @row-click="handleSelectAdmin"
              v-loading="loading"
            >
              <el-table-column prop="name" label="姓名" width="120" />
              <el-table-column prop="mobile" label="手机号" width="150" />
              <el-table-column prop="role" label="角色" width="100" />
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
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="createForm.mobile" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" type="password" />
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
import { fetchAdminUsers, updateAdminUser, createAdminUser } from '@/api/admin'

// 这里维护一个前端的“页面权限 key 字典”
// key 要和各个路由 meta.permissionKey 保持一致
const permissionTree = [
  {
    key: 'owner',
    title: '项目管理',
    children: [
      { key: 'owner.project', title: '单位项目管理' },
      { key: 'owner.payment', title: '结款管理' }
    ]
  },
  {
    key: 'system',
    title: '系统管理',
    children: [
      { key: 'system.checkin', title: '打卡区域设置' },
      { key: 'system.self-project', title: '自建维保项目' }
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
      // 新建管理员弹窗相关
      createDialogVisible: false,
      createForm: {
        name: '',
        mobile: '',
        password: ''
      },
      createLoading: false,
      createRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
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
        // 只取后台用户，这里通过后端已有接口获取
        const res = await fetchAdminUsers({ limit: 100 })
        console.log('获取管理员列表响应:', res)
        
        // 后端返回结构: { success: true, data: users[], pagination: {...} }
        // request 拦截器已经返回了 response.data，所以这里直接访问 res.data
        if (res && res.success && res.data && Array.isArray(res.data)) {
          // 只展示 role 为 admin 的账号（超级管理员不在列表中）
          this.adminList = res.data.filter(u => u.role === 'admin')
          console.log('过滤后的管理员列表:', this.adminList)
        } else {
          console.warn('响应数据格式异常:', res)
          this.adminList = []
        }
      } catch (e) {
        console.error('获取管理员列表失败:', e)
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
      // 过滤掉分组节点的 key（如 'owner', 'system'）
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
        // 同步当前行数据
        this.currentAdmin.pagePermissions = this.checkedKeys.slice()
      } catch (e) {
        this.$message.error('保存失败')
      } finally {
        this.saving = false
      }
    },
    openCreateDialog() {
      this.createForm = {
        name: '',
        mobile: '',
        password: ''
      }
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
          // 默认创建 role 为 admin 的账号
          await createAdminUser({
            ...this.createForm,
            role: 'admin'
          })
          this.$message.success('创建成功')
          this.createDialogVisible = false
          // 重新加载管理员列表
          await this.loadAdmins()
        } catch (e) {
          this.$message.error('创建失败')
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

