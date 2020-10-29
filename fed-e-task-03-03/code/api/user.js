import { request } from '@/plugins/request'

// 用户登录
const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 用户注册
const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// authentication required => setting page
const getUser = () => {
  return request({
    method: 'GET',
    url: '/api/user'
  })
}

// authentication required => setting page
const updateUser = ({ email, username, password, image, bio }) => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data: {
      user: {
        email,
        username,
        password,
        image,
        bio
      }
    }
  })
}

const getProfile = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`
  })
}

// 关注用户
const follow = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`
  })
}

// 取关用户
const unfollow = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`
  })
}

export {
  login,
  register,
  getUser,
  updateUser,
  getProfile,
  follow,
  unfollow
}
