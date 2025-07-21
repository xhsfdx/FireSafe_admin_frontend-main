<template>
  <div class="test-page">
    <h1>DispatchStaff 组件测试</h1>
    
    <el-card class="test-card">
      <div slot="header">
        <span>测试DispatchStaff组件</span>
      </div>
      <div>
        <DispatchStaff 
          ref="dispatchStaff" 
          :data="testData" 
          @submit="onStaffSubmit"
        />
        <div v-if="selectedStaff" class="data-display">
          <h5>选中的维保人员:</h5>
          <pre>{{ JSON.stringify(selectedStaff, null, 2) }}</pre>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import DispatchStaff from '@/views/Maintenance and Service Management/DispatchStaff.vue'

export default {
  name: 'TestDispatchStaff',
  components: {
    DispatchStaff
  },
  data() {
    return {
      selectedStaff: null,
      testData: {}
    }
  },
  methods: {
    onStaffSubmit(data) {
      console.log('维保人员配置提交:', data)
      this.selectedStaff = data.maintainPersons
    }
  }
}
</script>

<style scoped>
.test-page {
  padding: 20px;
}
.test-card {
  margin-bottom: 20px;
}
.data-display {
  margin-top: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}
.data-display pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}
</style> 