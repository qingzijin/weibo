import Vue from 'vue'
import Router from 'vue-router'

const BloggerDetail = () => import('components/blogger-detail/blogger-detail')
const Recommend = () => import('components/recommend/recommend')
const Search = () => import('components/search/search')
const Mine = () => import('components/mine/mine')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: BloggerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: BloggerDetail
        }
      ]
    },
    {
      path: '/mine',
      component: Mine,
      children: [
        {
          path: ':id',
          component: BloggerDetail
        }
      ]
    }
  ]
})
