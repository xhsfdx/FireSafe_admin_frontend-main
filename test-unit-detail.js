// 测试UnitDetail页面的API调用
const axios = require('axios');

async function testUnitDetailAPI() {
  console.log('=== 测试UnitDetail页面API调用 ===');
  
  // 模拟前端API调用
  const baseURL = 'http://localhost:3000'; // 后端服务器地址
  const token = 'your-token-here'; // 需要有效的token
  
  try {
    // 测试获取合同列表
    console.log('\n1. 测试获取合同列表...');
    const contractsResponse = await axios.get(`${baseURL}/contracts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('合同列表响应:', contractsResponse.data);
    
    if (contractsResponse.data.success && contractsResponse.data.data.length > 0) {
      const firstContract = contractsResponse.data.data[0];
      console.log('第一个合同ID:', firstContract._id);
      console.log('第一个合同名称:', firstContract.name);
      console.log('第一个合同编号:', firstContract.code);
      
      // 测试获取单个合同详情
      console.log('\n2. 测试获取单个合同详情...');
      const detailResponse = await axios.get(`${baseURL}/contracts/${firstContract._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('合同详情响应:', detailResponse.data);
      
      if (detailResponse.data.success) {
        const contract = detailResponse.data.data;
        console.log('合同详情数据:');
        console.log('- 合同名称:', contract.name);
        console.log('- 合同编号:', contract.code);
        console.log('- 业主单位:', contract.project?.ownerCompany);
        console.log('- 委托单位:', contract.clientCompany);
        console.log('- 合同金额:', contract.amount);
        console.log('- 合同类型:', contract.contractType);
        console.log('- 项目信息:', contract.project);
      }
    }
    
  } catch (error) {
    console.error('API调用失败:', error.response?.data || error.message);
  }
}

// 运行测试
testUnitDetailAPI(); 