import {commonParams} from './config'
import Axios from '../../node_modules/axios'

const debug = process.env.NODE_ENV !== 'production'

export function getHotList(sinceId) {
  const url = debug ? '/api/getHotList' : 'http://120.26.173.35/weibo/api/getHotList'
  const data = Object.assign({}, commonParams, {
    containerid: 102803,
    openApp: 0,
    'since_id': sinceId
  })

  return Axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}