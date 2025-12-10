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
import { getDigitalScreenData } from '@/api/digitalScreen'
export default {
  name: 'TotalmaintenceArea',
  data() {
    return {
      total: 0 // 你的总数可以从API中获取
    }
  },
  computed: {
    paddedDigits() {
      // 一共有9位数，若不够则用0填充
      return this.total.toString().padStart(9, '0').split('')
    }
  },
  mounted() {
    this.fetchTotalArea()
  },
  methods: {
    async fetchTotalArea() {
      try {
        const res = await getDigitalScreenData()
        if (res) {
          this.total = Math.round(res.data.warrantyAreaTotal || 0)
        }
      } catch (err) {
        console.error('获取维保面积失败', err)
      }
    }
  }
}

</script>

<style scoped>
.total-area {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(14px, 1.5vw, 20px);
  font-family: 'Orbitron', sans-serif;
  color: #00f0ff;
  padding: 15px 25px;
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.7) 0%, rgba(0, 40, 80, 0.5) 100%);
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, rgba(0, 240, 255, 0.6), rgba(0, 136, 204, 0.6)) 1;
  border-radius: 35px;
  box-shadow: 
    0 0 30px rgba(0, 240, 255, 0.6),
    inset 0 0 25px rgba(0, 240, 255, 0.2);
  backdrop-filter: blur(10px);
  margin-top: 20px;
  transition: all 0.3s ease;
  width: 100%;
}

.total-area:hover {
  box-shadow: 
    0 0 40px rgba(0, 240, 255, 0.8),
    inset 0 0 30px rgba(0, 240, 255, 0.3);
  transform: translateY(-2px);
}

.total-area .label {
  margin-right: 20px;
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 30px rgba(0, 240, 255, 0.5);
  letter-spacing: 2px;
  white-space: nowrap;
}

.number-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.number-wrapper .digit {
  width: clamp(25px, 3vw, 35px);
  height: clamp(35px, 4vw, 45px);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 20, 40, 0.6) 100%);
  color: #00f0ff;
  font-weight: bold;
  font-size: clamp(18px, 2vw, 26px);
  margin: 0 3px;
  text-align: center;
  line-height: clamp(35px, 4vw, 45px);
  border-radius: 8px;
  border: 1px solid rgba(0, 240, 255, 0.4);
  box-shadow: 
    0 0 15px rgba(0, 240, 255, 0.5),
    inset 0 0 15px rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
  animation: flicker 2s infinite alternate;
  position: relative;
}

.number-wrapper .digit::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, transparent 0%, rgba(0, 240, 255, 0.1) 50%, transparent 100%);
  animation: digitShine 3s infinite;
}

@keyframes flicker {
  0% {
    text-shadow: 
      0 0 5px #00f0ff,
      0 0 10px #00f0ff,
      0 0 15px rgba(0, 240, 255, 0.5);
    box-shadow: 
      0 0 15px rgba(0, 240, 255, 0.5),
      inset 0 0 15px rgba(0, 240, 255, 0.2);
  }
  100% {
    text-shadow: 
      0 0 10px #00f0ff,
      0 0 20px #00f0ff,
      0 0 30px rgba(0, 240, 255, 0.8);
    box-shadow: 
      0 0 25px rgba(0, 240, 255, 0.8),
      inset 0 0 20px rgba(0, 240, 255, 0.3);
  }
}

@keyframes digitShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.number-wrapper .digit:hover {
  transform: scale(1.15) translateY(-2px);
  box-shadow: 
    0 0 30px rgba(0, 240, 255, 1),
    inset 0 0 25px rgba(0, 240, 255, 0.4);
  border-color: rgba(0, 240, 255, 0.8);
}

.number-wrapper .unit {
  margin-left: 12px;
  color: #00f0ff;
  font-size: clamp(16px, 1.8vw, 22px);
  font-weight: bold;
  text-shadow: 
    0 0 10px #00f0ff,
    0 0 20px rgba(0, 240, 255, 0.5);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .total-area {
    padding: 12px 20px;
    margin-top: 15px;
  }
  
  .total-area .label {
    margin-right: 15px;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .total-area {
    flex-direction: column;
    padding: 10px 15px;
    gap: 10px;
  }
  
  .total-area .label {
    margin-right: 0;
    margin-bottom: 5px;
  }
  
  .number-wrapper {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .total-area {
    padding: 8px 12px;
  }
  
  .number-wrapper .digit {
    margin: 0 2px;
  }
}
</style>
