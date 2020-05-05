import {commonParams} from './config'
import Axios from '../../node_modules/axios'
const debug = process.env.NODE_ENV !== 'production'

export function getHotWords() {
  const url = debug ? '/api/getHotWords' : 'http://120.26.173.35/weibo/api/getHotWords'
  const data = Object.assign({}, commonParams, {
    containerid: 231583,
    page_type: 'searchall'
  })

  return Axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSuggest(query, page) {
  const url = debug ? '/api/getSuggest' : 'http://120.26.173.35/weibo/api/getSuggest'
  const data = Object.assign({}, commonParams, {
    containerid: `100103type=1&q=${query}`,
    page_type: 'searchall',
    page
  })

  return Axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}