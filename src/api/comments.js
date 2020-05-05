import {commonParams} from 'api/config'
import Axios from 'axios'
const debug = process.env.NODE_ENV !== 'production'

export function getComments(id, mid, maxId) {
  const url = debug ? 'api/getComments' : 'http://120.26.173.35/weibo/api/getComments'
  const data = Object.assign({}, commonParams, {
    id,
    mid,
    max_id: maxId,
    max_id_type: 0
  })

  return Axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getLongText(id) {
  const url = debug ? 'api/getLongText' : 'http://120.26.173.35/weibo/api/getLongText'
  const data = Object.assign({}, commonParams, {
    id
  })

  return Axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}