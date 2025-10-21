import request from '@/utils/request'

export function getcustomers() {
    return request({
        url: '/customer/list',
        method: 'get'
    })
}

export function getcustomerDetail(id) {
    return request({
        url: `/customer/${id}`,
        method: 'get'
    })
}

export function Deletecustomer(id) {
    return request({
        url: `/customer/${id}`,
        method: 'delete'
    })
}

export function Updatecustomer(id, data) {
    return request({
        url: `/customer/${id}`,
        method: 'put',
        data
    })
}
export function Createcustomer(data) {
    return request({
        url: `/customer/create`,
        method: 'post',
        data
    })
}