// 模拟前端数据传递过程
console.log('=== 模拟前端数据传递过程 ===');

// 1. DispatchStaff.vue 中的 onSave 方法
console.log('\n1. DispatchStaff.vue onSave 方法');
const selected = {
  tech: { id: '68560d0505aaf62343533cb1', name: '张三' },
  manager: { id: '68560d0505aaf62343533cb1', name: '张三' },
  workers: [
    { id: '68560d0505aaf62343533cb1', name: '张三' },
    { id: '68560d6005aaf62343533cbf', name: '李四' }
  ],
  workerIds: ['68560d0505aaf62343533cb1', '68560d6005aaf62343533cbf']
};

const maintainPersons = {
  technical: selected.tech.id,
  leader: selected.manager.id,
  maintainers: selected.workerIds
};

console.log('DispatchStaff 发送的数据:', JSON.stringify(maintainPersons, null, 2));
console.log('maintainers长度:', maintainPersons.maintainers.length);

// 2. addnewdispatchStaff.vue 中的 onDialogConfirm 方法
console.log('\n2. addnewdispatchStaff.vue onDialogConfirm 方法');
const newData = {
  maintainPersons: maintainPersons,
  selectedStaff: {
    tech: selected.tech,
    manager: selected.manager,
    workers: selected.workers
  }
};

console.log('接收到的数据:', JSON.stringify(newData, null, 2));

// 模拟数据处理
const sanitizedMaintainPersons = {
  technical: newData.maintainPersons.technical || null,
  leader: newData.maintainPersons.leader || null,
  maintainers: Array.isArray(newData.maintainPersons.maintainers) 
    ? newData.maintainPersons.maintainers.filter(id => id && typeof id === 'string')
    : []
};

console.log('处理后的数据:', JSON.stringify(sanitizedMaintainPersons, null, 2));
console.log('maintainers长度:', sanitizedMaintainPersons.maintainers.length);

// 3. add.vue 中的数据查找逻辑
console.log('\n3. add.vue 中的数据查找逻辑');
const dispatchStaffList = [
  {
    projectName: '测试项目',
    maintainPersons: sanitizedMaintainPersons
  }
];

console.log('dispatchStaffList:', JSON.stringify(dispatchStaffList, null, 2));

// 查找有维保人员数据的项目
const staffItem = dispatchStaffList.find(item => 
  item.maintainPersons && 
  item.maintainPersons.technical && 
  item.maintainPersons.leader
);

if (staffItem && staffItem.maintainPersons) {
  console.log('找到维保人员数据:', JSON.stringify(staffItem.maintainPersons, null, 2));
  console.log('maintainers长度:', staffItem.maintainPersons.maintainers.length);
} else {
  console.log('未找到维保人员数据');
}

// 4. 最终发送到后端的数据
console.log('\n4. 最终发送到后端的数据');
const finalMaintainPersons = staffItem ? staffItem.maintainPersons : null;
console.log('最终数据:', JSON.stringify(finalMaintainPersons, null, 2));

if (finalMaintainPersons) {
  console.log('maintainers长度:', finalMaintainPersons.maintainers.length);
  console.log('✅ 数据传递成功');
} else {
  console.log('❌ 数据传递失败');
} 