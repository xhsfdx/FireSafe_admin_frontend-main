<template>
  <div class="top10-table">
    <div class="header">
      <span>排名</span>
      <span>姓名</span>
      <span>完成量(单)</span>
      <span>维保面积(㎡)</span>
      <span>综合得分</span>
    </div>
    <ul>
      <li v-for="(item, index) in list" :key="item.name">
        <span>{{ index + 1 }}</span>
        <span>{{ item.name }}</span>
        <span>{{ item.completed }}</span>
        <span>{{ item.area }}</span>
        <span>{{ item.score }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ComprehensiveRanking',
  data() {
    return {
      list: [
        { name: '盛长枫', completed: 0, area: 0, score: 57 },
        { name: '张晓意', completed: 2, area: 50500, score: 53 },
        { name: '盛长柏', completed: 0, area: 0, score: 28 }
      ]
    }
  }
}

</script>

<style scoped>
.top10-table {
  width: 400px;
  background: #edf6ff;
  padding: 20px;
  border-radius: 10px;
  font-size: 14px;
}
.top10-table .header,
.top10-table ul li {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 2fr 2fr;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.top10-table .header {
  font-weight: bold;
  color: #666;
  background: #dff0ff;
}
.top10-table ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.top10-table ul li {
  color: #333;
}
.top10-table ul li:nth-child(1) {
  background: #fff9cc;
}
.top10-table ul li:nth-child(2) {
  background: #edf6ff;
}
.top10-table ul li:nth-child(3) {
  background: #f5f5f5;
}
</style>
