<template>
  <div class="total-area">
    <span class="label">维护总面积</span>
    <div class="number-wrapper">
      <span v-for="(digit, index) in paddedDigits" :key="index" class="digit">
        {{ digit }}
      </span>
      <span class="unit">m²</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TotalmaintenceArea',
  data() {
    return {
      total: 102500 // 你的总数可以从API中获取
    }
  },
  computed: {
    paddedDigits() {
      // 一共有9位数，若不够则用0填充
      return this.total.toString().padStart(9, '0').split('')
    }
  }
}

</script>

<style scoped>
.total-area {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #ffffff;
  padding: 10px 20px;
  background: linear-gradient(90deg, #04a5e3, #0195cc);
  border-radius: 30px;
}

.total-area .label {
  margin-right: 20px;
  font-weight: bold;
}

.number-wrapper {
  display: flex;
  align-items: center;
}

.number-wrapper .digit {
  width: 30px;
  height: 40px;
  background: #ffffff;
  color: #04a5e3;
  font-weight: bold;
  font-size: 24px;
  margin: 0 2px;
  text-align: center;
  line-height: 40px;
  border-radius: 6px;
}

.number-wrapper .unit {
  margin-left: 10px;
  color: #ffffff;
  font-size: 18px;
}
</style>
