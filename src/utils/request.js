import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// src/utils/request.js 或者 api 配置文件
export const BASE_URL = process.env.VUE_APP_BASE_API;

// export const BASE_URL = "https://scbfxf.cn"; 
// export const BASE_URL = "http://192.168.1.24:5000"; 
// create an axios instance
const service = axios.create({
  baseURL: BASE_URL + '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * Handle successful responses
   * Backend format: { success: true, data: {...}, message: '...' }
   */
  response => {
    const res = response.data
    const statusCode = response.status

    // Handle HTTP success status codes (200, 201, etc.)
    if (statusCode >= 200 && statusCode < 300) {
      // If backend returns success: false, treat it as an error
      if (res.success === false) {
        const errorMessage = res.message || '请求失败'
        Message({
          message: errorMessage,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(errorMessage))
      }
      
      // Return the response data (which includes success, data, message)
      return res
    }

    // Handle unexpected success status codes
    return res
  },
  error => {
    console.log('err', error) // for debug
    
    // Handle HTTP error responses
    if (error.response) {
      const { status, data } = error.response
      const errorMessage = data?.message || data?.error || error.message || '请求失败'

      // Handle authentication errors (401)
      if (status === 401) {
        MessageBox.confirm('登录已过期，请重新登录', '确认登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }).catch(() => {
          // User cancelled, do nothing
        })
      }

      // Handle other HTTP errors
      Message({
        message: errorMessage,
        type: 'error',
        duration: 5 * 1000
      })

      // Return error with backend message if available
      return Promise.reject(new Error(errorMessage))
    }

    // Handle network errors or other errors
    const errorMessage = error.message || '网络错误，请检查网络连接'
    Message({
      message: errorMessage,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
