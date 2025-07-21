// 测试维保人员配置数据流
console.log('=== 维保人员配置测试 ===');

// 模拟DispatchStaff组件发送的数据
const dispatchStaffData = {
  maintainPersons: {
    technical: '68560d0505aaf62343533cb1', // 张三的ID
    leader: '68560d0505aaf62343533cb1',    // 张三的ID
    maintainers: ['68560d0505aaf62343533cb1'] // 张三的ID
  },
  selectedStaff: {
    tech: {
      id: '68560d0505aaf62343533cb1',
      name: '张三',
      role: '一级注册消防工程师'
    },
    manager: {
      id: '68560d0505aaf62343533cb1',
      name: '张三',
      role: '一级注册消防工程师'
    },
    workers: [{
      id: '68560d0505aaf62343533cb1',
      name: '张三',
      role: '一级注册消防工程师'
    }]
  }
};

console.log('DispatchStaff发送的数据:', dispatchStaffData);

// 模拟addnewdispatchStaff.vue的onDialogConfirm处理
function onDialogConfirm(newData) {
  console.log('=== onDialogConfirm 处理 ===');
  console.log('接收到的数据:', newData);
  
  const maintainPersons = newData.maintainPersons;
  const selectedStaff = newData.selectedStaff;
  
  let techLeader = '';
  let projectLeader = '';
  let onSiteStaff = '';

  // 从selectedStaff获取人员姓名
  if (selectedStaff) {
    if (selectedStaff.tech) {
      techLeader = selectedStaff.tech.name;
    }
    if (selectedStaff.manager) {
      projectLeader = selectedStaff.manager.name;
    }
    if (selectedStaff.workers && selectedStaff.workers.length > 0) {
      onSiteStaff = selectedStaff.workers
        .map(worker => worker.name)
        .filter(Boolean)
        .join('、');
    }
  }

  const updatedRow = {
    projectName: '测试项目',
    ownerName: '测试业主单位',
    techLeader,
    projectLeader,
    onSiteStaff,
    maintainPersons
  };

  console.log('更新后的行数据:', updatedRow);
  return updatedRow;
}

// 测试处理
const result = onDialogConfirm(dispatchStaffData);
console.log('处理结果:', result);

// 模拟add.vue的数据提取
function extractMaintainPersons(dispatchStaffList) {
  console.log('=== add.vue 数据提取 ===');
  console.log('dispatchStaffList:', dispatchStaffList);
  
  const staffItem = dispatchStaffList.find(item => item.maintainPersons);
  if (staffItem && staffItem.maintainPersons) {
    const maintainPersons = {
      technical: staffItem.maintainPersons.technical || null,
      leader: staffItem.maintainPersons.leader || null,
      maintainers: Array.isArray(staffItem.maintainPersons.maintainers) ? staffItem.maintainPersons.maintainers : []
    };
    console.log('提取的维保人员数据:', maintainPersons);
    return maintainPersons;
  }
  return null;
}

const extractedData = extractMaintainPersons([result]);
console.log('最终提取的数据:', extractedData); 