import Vue from 'vue'
import dayjs from 'dayjs'

// 使用 {{ 表达式 | 过滤器 }}

Vue.filter('formatDate', (value, format = 'YYYY-MM-DD') => {
  return dayjs(value).format(format)
})
