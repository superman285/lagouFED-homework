import { request } from '@/plugins/request'

// 获取公共文章列表 params为查询参数 e.g. ?tag=AngularJS
const getArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}

// 获取关注用户文章列表 需要查询参数 params
const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    params
    // Authorization: Token jwt.token.here
    /* headers: {
      Authorization: `Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTE5MjIwLCJ1c2VybmFtZSI6InN1cGVybWFuMjg1IiwiZXhwIjoxNjA4NzA5NzEwfQ.647nVefWz5KP_-qoObb88-tMqU7jXtYMuTvk87Yf_uE`
    } */
  })
}

// 获取某文章
const getArticle = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}`
  })
}

const addArticle = ({ title, description, body, tagList }) => {
  return request({
    method: 'POST',
    url: `/api/articles`,
    data: {
      article: {
        title,
        description,
        body,
        tagList
      }
    }
  })
}

const updateArticle = ({ slug, article: { title, description, body, tagList } }) => {
  return request({
    method: 'PUT',
    url: `/api/articles/${slug}`,
    data: {
      article: {
        title,
        description,
        body,
        tagList
      }
    }
  })
}

const deleteArticle = (slug) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}`
  })
}


// 文章点赞
const addFavorite = (slug) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`
  })
}

// 文章取消赞
const deleteFavorite = (slug) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`
  })
}

// 获取文章评论
const getComments = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`
  })
}

export {
  getArticles,
  getArticle,
  addArticle,
  updateArticle,
  deleteArticle,
  getFeedArticles,
  addFavorite,
  deleteFavorite,
  getComments
}
