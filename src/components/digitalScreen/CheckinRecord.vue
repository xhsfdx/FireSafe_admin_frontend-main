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
import { getDigitalScreenData } from '@/api/digitalScreen'
export default {
  name: 'CheckinRecord',
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.fetchCheckins()
  },
  methods: {
    async fetchCheckins() {
      try {
        const res = await getDigitalScreenData()
        if (res) {
          this.list = res.data.maintainerCheckins.map((item, index) => ({
            id: index + 1,
            name: item.staffName || '未知人员',
            project: item.projectName || '未知项目',
            time: this.formatTime(item.checkinTime)
          }))
        }
      } catch (e) {
        console.error('打卡记录获取失败', e)
      }
    },
    formatTime(dateStr) {
      const d = new Date(dateStr)
      return d.toTimeString().substring(0, 8) // 只取 HH:MM:SS
    }
  }
}
</script>

<style scoped>
/* 背景+荧光边框 */
.punch-wrapper {
  width: auto;
  padding: 20px;
  background: rgba(0, 20, 40, 0.3);
  border-radius: 16px;
  color: #00ffff;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Orbitron', sans-serif;
  box-shadow: 0 0 30px rgba(0,255,255,0.6);
  border: 1px solid rgba(0,255,255,0.3);
}

/* 标题发光 */
.punch-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #00ffff;
  text-shadow: 0 0 6px #00ffff;
  text-align: center;
}

/* 表格基础 */
.punch-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  color: #00ffff;
}

/* 表头荧光背景 */
.punch-table th {
  background: rgba(0,255,255,0.1);
  padding: 10px;
  font-weight: bold;
  color: #00ffff;
  border-bottom: 1px solid rgba(0,255,255,0.3);
  text-shadow: 0 0 4px #00ffff;
}

/* 表格内容 */
.punch-table td {
  padding: 10px;
  border-bottom: 1px solid rgba(0,255,255,0.1);
  text-align: center;
  background: rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

/* 鼠标悬浮行 */
.punch-table tbody tr:hover {
  background: rgba(0,255,255,0.1);
  box-shadow: inset 0 0 10px rgba(0,255,255,0.3);
  transform: scale(1.02);
}

/* 表格边框细线 */
.punch-table th,
.punch-table td {
  border-right: 1px solid rgba(0,255,255,0.1);
}
.punch-table th:last-child,
.punch-table td:last-child {
  border-right: none;
}
</style>
