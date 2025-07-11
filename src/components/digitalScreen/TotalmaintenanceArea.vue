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
  font-family: 'Orbitron', sans-serif;
  color: #00f0ff;
  padding: 10px 20px;
  background: rgba(0, 20, 40, 0.4);
  border: 1px solid #00f0ff55;
  border-radius: 30px;
  box-shadow: 0 0 20px #00f0ff88, inset 0 0 20px #00f0ff33;
  backdrop-filter: blur(6px);
  margin-top: 30px;
}

.total-area .label {
  margin-right: 20px;
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}

.number-wrapper {
  display: flex;
  align-items: center;
}

.number-wrapper .digit {
  width: 30px;
  height: 40px;
  background: rgba(0,0,0,0.6);
  color: #00f0ff;
  font-weight: bold;
  font-size: 24px;
  margin: 0 2px;
  text-align: center;
  line-height: 40px;
  border-radius: 6px;
  box-shadow: 0 0 10px #00f0ff, inset 0 0 10px #00f0ff;
  transition: transform 0.3s ease;
}
@keyframes flicker {
  0% {
    text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
  }
  100% {
    text-shadow: 0 0 15px #00f0ff, 0 0 30px #00f0ff;
  }
}

.number-wrapper .digit {
  animation: flicker 2s infinite alternate;
}

.number-wrapper .digit:hover {
  transform: scale(1.2);
  box-shadow: 0 0 20px #00f0ff, inset 0 0 20px #00f0ff;
}

.number-wrapper .unit {
  margin-left: 10px;
  color: #00f0ff;
  font-size: 18px;
}

</style>
