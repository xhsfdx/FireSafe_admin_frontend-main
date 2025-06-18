<template>
  <div class="big-screen">
    <TopBar />

    <div class="main-content">
      <LeftPanel />
      <MapChart />
      <RightPanel />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/digitalScreen/TopBar.vue'
import MapChart from '@/components/digitalScreen/MapChart.vue'
import LeftPanel from '@/components/digitalScreen/LeftPanel.vue'
import RightPanel from '@/components/digitalScreen/RightPanel.vue'

export default {
  name: 'DigitalScreen',
  components: {
    TopBar,
    MapChart,
    LeftPanel,
    RightPanel
  }
}
</script>

<style scoped>
.big-screen {
  background: #001f3f;
  color: #fff;
  width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 10px 20px;
}
</style>
