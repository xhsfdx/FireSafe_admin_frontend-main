<template>
  <!-- <div style="font-size: 20px; text-align: left; margin-bottom: 10px;">业主单位概况</div> -->
  <div class="ower">
    <div class="total-unit">
      <div class="total-unit-icon">
        <i class="el-icon-user-solid" /><!-- 这可以换为你的 icon -->
      </div>
      <div class="total-unit-info">
        <span>{{ totalUnits }}</span>
        <div class="total-word">家业主单位
        </div>
      </div>
    </div>
    <!-- 统计区域 -->
    <div class="statistics">
      <div class="item" style="background: radial-gradient(circle, #9fd163, #c5e9a4); margin-left: -10px;">
        <div>{{ todayChecked }}</div>
        <div>当日打卡数</div>
      </div>
      <div class="item" style="background: radial-gradient(circle, #f3e5ff, #d9b3ff);">
        <div>{{ todayCompleted }}</div>
        <div>当日完成数</div>
      </div>
      <div class="item" style="background: radial-gradient(circle, #fff9cc, #ffeb99); margin-right: -10px;">
        <div>{{ todayReviews }}</div>
        <div>当日评价数</div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'TotalOwer',
  data() {
    return {
      totalUnits: 15,
      todayChecked: 2,
      todayCompleted: 3,
      todayReviews: 2
    }
  }
}
</script>

<style>
.ower {
  padding: 20px;
  background: #c8d8ee;
}

.total-unit {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.total-unit-icon {
  font-size: 30px;
  color: #5caaff;
  background-color: green;
  padding: 20px;
  border-radius: 50%;
  margin-left: 8px;
}

.total-unit-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: -10px;
}

.total-unit-info span {
  font-size: 30px;
  color: white;
  font-weight: bold;
  background-color: green;
  padding: 10px 20px;
  border-radius: 10px;
}
.total-unit-info .total-word {
  font-size: 15px;
  color: #fff;
  margin-top: 30px;
  white-space: nowrap;
}

.statistics {
  display: flex;
  /* grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); */
  justify-content: space-around;
  margin-bottom: -2px;
}

.statistics .item {
  min-width: 0;
  text-align: center;
  align-items: baseline;
  /* background-color: #4e0404; */
}

.statistics .item div:first-child {
  font-size: 30px;
  color: rgb(221, 11, 11);
  margin-bottom: 5px;
}

.statistics .item div:last-child {
  color:rgb(67, 60, 60);
  margin-bottom: 5px;
}
</style>
