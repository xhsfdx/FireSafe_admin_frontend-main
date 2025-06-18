<template>
  <div class="punch-wrapper">
    <div class="punch-title">
      当日打卡
    </div>
    <table class="punch-table">
      <thead>
        <tr>
          <th>序号</th>
          <th>姓名</th>
          <th>项目名称</th>
          <th>打卡时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.project }}</td>
          <td>{{ item.time }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CheckinRecord',
  data() {
    return {
      list: [
        { id: 1, name: '任慧媛', project: '项目有限责任公司', time: '16:12:43' },
        { id: 2, name: '张晓蕾', project: '项目有限责任公司', time: '14:39:56' }
      ]
    }
  }
}

</script>

<style scoped>
.punch-wrapper {
  width: auto;
  /* margin: 20px; */
  padding: 20px;
  background: #edf7ff;
  border-radius: 20px;
  color: #003366;
  font-size: 14px;
  font-weight: 500;
  font-family: "Microsoft YaHei", sans-serif;
  box-shadow: 0px 4px 10px #a5c9ff;
}

.punch-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #003366;
  text-shadow: 1px 1px 2px #cce5ff;
}

.punch-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
  color: #003366;
}

.punch-table th {
  background: #cce5ff;
  padding: 10px;
  font-weight: bold;
  color: #003366;
  border-bottom: 1px solid #a5c9ff;
}

.punch-table td {
  padding: 10px;
  border-bottom: 1px solid #cce5ff;
  text-align: center;
  background: #edf7ff;
}

.punch-table tbody tr:hover {
  background: #cce5ff;
  transition: all 0.3s ease;
}
</style>
