import request from '@/utils/request'

// 获取工作上报列表 - 使用维护任务接口
export function getWorkReports(params) {
  return request({
    url: '/maintainTask',
    method: 'get',
    params
  })
}

// 获取工作上报详情 - 使用维护任务接口
export function getWorkReport(id) {
  return request({
    url: `/maintainTask/${id}`,
    method: 'get'
  })
}

// 创建工作上报 - 使用维护任务接口
export function createWorkReport(data) {
  return request({
    url: '/maintainTask',
    method: 'post',
    data
  })
}

// 更新工作上报 - 使用维护任务接口
export function updateWorkReport(id, data) {
  return request({
    url: `/maintainTask/${id}`,
    method: 'put',
    data
  })
}

// 删除工作上报 - 使用维护任务接口
export function deleteWorkReport(id) {
  return request({
    url: `/maintainTask/${id}`,
    method: 'delete'
  })
}

// 下载工作上报 - 暂时使用模拟下载
export function downloadWorkReport(id) {
  return new Promise((resolve) => {
    // 模拟下载，返回一个空的blob
    const blob = new Blob(['模拟下载内容'], { type: 'application/pdf' })
    resolve(blob)
  })
}

// 批量下载工作上报 - 暂时使用模拟下载
export function batchDownloadWorkReports(ids) {
  return new Promise((resolve) => {
    // 模拟批量下载，返回一个空的zip文件
    const blob = new Blob(['模拟批量下载内容'], { type: 'application/zip' })
    resolve(blob)
  })
}
