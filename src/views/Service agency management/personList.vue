<template>
  <div class="person-page">
    <!-- 筛选栏 -->
    <el-form :inline="true" :model="queryForm" class="filter-form">
      <el-form-item>
        <el-select v-model="queryForm.level" placeholder="请选择资质级别" clearable>
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
      <person-card
        v-for="item in filteredList"
        :key="item.id"
        :person="item"
        @delete="handleDelete"
        @edit="goEdit"
      />
    </div>

    <!-- 分页 -->
    <div class="pagination">
      共查询到{{ total }}条
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="5"
        :current-page.sync="page"
      />
    </div>
  </div>
</template>

<script>
import PersonCard from './personCard.vue'

export default {
  components: { PersonCard },
  data() {
    return {
      people: [],
      queryForm: {
        level: '',
        name: '',
        phone: ''
      },
      personList: [
        { id: 1, name: '林根', phone: '13508270870', title: '消防设施操作员' },
        { id: 2, name: '王蕾', phone: '17760052365', title: '一级注册消防工程师' },
        { id: 3, name: '何珍', phone: '13350252055', title: '一级注册消防工程师' },
        { id: 4, name: '黎建军', phone: '15378390343', title: '消防设施操作员' },
        { id: 5, name: '邱峥峰', phone: '15228141726', title: '一级注册消防工程师' }
      ],
      page: 1
    }
  },
  computed: {
    total() {
      return this.filteredList.length
    },
    filteredList() {
      let result = this.personList
      const { level, name, phone } = this.queryForm
      if (level) result = result.filter(p => p.title.includes(level === '1' ? '一级' : '设施'))
      if (name) result = result.filter(p => p.name.includes(name))
      if (phone) result = result.filter(p => p.phone.includes(phone))
      return result
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const localData = JSON.parse(localStorage.getItem('people')) || []
      this.people = localData
    },
    goEdit(person) {
      this.$router.push({ name: 'PersonInfo', params: { id: person.id }})
    },
    handleQuery() {},
    resetForm() {
      this.queryForm = { level: '', name: '', phone: '' }
    },
    handleAdd() {
      this.$message.info('点击新增')
      this.$router.push({ name: 'PersonInfo' })
    },
    handleDelete(person) {
      this.personList = this.personList.filter(p => p.id !== person.id)
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
