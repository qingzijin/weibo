import {commonParams} from './config'
import Axios from '../../node_modules/axios'
const debug = process.env.NODE_ENV !== 'production'

export function getBloggerDetail(uid) {
  const url = debug ? '/api/getBloggerDetail' : 'http://120.26.173.35/weibo/api/getBloggerDetail'
  const data = Object.assign({}, commonParams, {
    uid
  })

  return Axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}