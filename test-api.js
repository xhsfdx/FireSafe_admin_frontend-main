const axios = require('axios');

// 测试API连接
async function testAPI() {
  try {
    console.log('测试员工API...');
    
    // 测试后端员工API
    const response = await axios.get('http://localhost:5000/api/staff/all');
    console.log('后端员工API响应:', response.data);
    
    if (response.data.success && response.data.data) {
      console.log(`成功获取 ${response.data.data.length} 名员工`);
      response.data.data.slice(0, 3).forEach(staff => {
        console.log(`- ${staff.name} (${staff.qualificationLevel}) - ID: ${staff._id}`);
      });
    }
    
  } catch (error) {
    console.error('API测试失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

// 运行测试
testAPI(); 