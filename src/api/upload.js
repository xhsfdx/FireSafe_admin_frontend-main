import request from '@/utils/request' // Axios instance

// 列出 uploads 目录下的所有文件 + 磁盘空间信息
export function fetchUploadFiles() {
  return request({
    url: '/upload_img/files',
    method: 'get'
  })
}

// 删除选中的文件
export function deleteUploadFiles(files) {
  return request({
    url: '/upload_img/files',
    method: 'delete',
    data: { files }
  })
}

// 按天数清理旧文件，例如 days=7（一周前）、30（一月前）
export function cleanupUploadFiles(days) {
  return request({
    url: '/upload_img/cleanup',
    method: 'delete',
    params: { days }
  })
}

// Function to upload an image
export function uploadImage(file) {
  const formData = new FormData()
  formData.append('img', file)

  return request({
    url: '/upload_img/upload_img', // The endpoint for uploading the file
    method: 'post', // HTTP method (POST)
    data: formData, // Sending FormData containing the file
    headers: {
      'Content-Type': 'multipart/form-data' // Ensures the request is formatted for file uploads
    }
  })
}


export function uploadDoc(file) {
  const formData = new FormData()
  formData.append('doc', file)

  return request({
    url: '/upload_img/upload_doc', // The endpoint for uploading the file
    method: 'post', // HTTP method (POST)
    data: formData, // Sending FormData containing the file
    headers: {
      'Content-Type': 'multipart/form-data' // Ensures the request is formatted for file uploads
    }
  })
}