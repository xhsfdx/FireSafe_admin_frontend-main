<template>
  <div class="person-page">
    <!-- 筛选栏 -->
    <el-form :inline="true" :model="queryForm" class="filter-form">
      <el-form-item>
        <el-select v-model="queryForm.qualificationLevel" placeholder="请选择资质级别" clearable>
          <el-option label="一级注册消防工程师" value="1" />
          <el-option label="消防设施操作员" value="2" />
          <el-option label="建筑物资质四级" value="3" />
          <el-option label="其他" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryForm.name" placeholder="姓名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryForm.phone" placeholder="电话" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 卡片列表 -->
    <div class="card-list">
      <PersonCard
        v-for="item in staffList"
        :key="item._id"
        :person="item"
        @delete="handleDelete"
        @edit="goEdit"
      />
    </div>

    <!-- 分页 -->
    <!-- <div class="pagination">
      共查询到{{ total }}条
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="5"
        :current-page.sync="page"
      /> -->
  <!-- </div> -->
  </div>
</template>

<script>
import PersonCard from './PersonCard.vue'
import axios from 'axios'
import { getAllStaff } from '@/api/staff'

export default {
  components: {
    PersonCard
  },
  data() {
    return {
      queryForm: {
        qualificationLevel: '',
        name: '',
        phone: ''
      },
      staffList: [],
      total: 0,
      page: 1,
      pageSize: 5
    }
  },
  // watch: {
  //   page() {
  //     this.fetchStaff()
  //   }
  // },
  // mounted() {
  //   this.fetchStaff()
  // },
  created() {
    this.fetchStaff()
  },
  methods: {
    async fetchStaff() {
      try {
        const res = await getAllStaff()
        if (res.success) {
          this.staffList = res.data
          this.total = res.data.length
          console.log('接口返回内容:', res)
        } else {
          this.$message.error('获取人员列表失败')
        }
      } catch (err) {
        console.error(err)
        this.$message.error('网络错误')
      }
    },

    handleQuery() {
      this.page = 1
      this.fetchStaff()
    },

    resetForm() {
      this.queryForm = {
        level: '',
        name: '',
        phone: ''
      }
      this.page = 1
      this.fetchStaff()
    },

    handleAdd() {
      // 跳转到创建账号页面（新增人员时没有电话号码，所以不传递phone参数）
      // 使用 replace 清除历史记录
      this.$router.replace({ 
        name: 'CreateAccount',
        query: {} // 明确清除查询参数
      })
    },

    handleDelete(id) {
      this.$confirm('确认删除该人员信息吗？', '提示', {
        type: 'warning'
      }).then(async() => {
        const res = await axios.delete(`/api/staff/${id}`)
        if (res.data.success) {
          this.$message.success('删除成功')
          this.fetchStaff()
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    goEdit(person) {
      this.$router.push({ name: 'EditPerson', params: { id: person._id }})
    }
  }
}
</script>

<style scoped>
.person-page {
  padding: 30px;
}

.filter-form {
  margin-bottom: 20px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
  font-size: 14px;
  color: #666;
}
</style>
