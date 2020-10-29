import { request } from "../plugins/request"

// 获取文章评论
const getComments = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`
  })
}

const addComment = ({ slug, comment: { body } }) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/comments`,
    data: {
      comment: {
        body
      }
    }
  })
}

// authentication required
const deleteComment = (slug, id) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/comments/${id}`
  })
}

export {
  getComments,
  addComment,
  deleteComment
}
