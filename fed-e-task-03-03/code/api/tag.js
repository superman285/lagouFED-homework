import { request } from "../plugins/request"

// 获取文章标签列表
 const getTags = () => {
  return request({
    method: 'GET',
    url: '/api/tags'
  })
 }

 export {
  getTags
 }
