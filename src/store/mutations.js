import * as types from './mutation-types'

const mutations = {
  [types.SET_ALBUM](state, album) {
    state.album = album
  },
  [types.SET_IMGINDEX](state, index) {
    state.imgIndex = index
  },
  [types.SET_SIZE](state, size) {
    state.size = size
  },
  [types.SET_STATEINDEX](state, index) {
    state.stateIndex = index
  },
  [types.SET_BLOGGER](state, uid) {
    state.blogger = uid
  },
  [types.SET_DETAIL_BLOG](state, detail) {
    state.detailBlog = detail
  },
  [types.SET_MEDIA](state, media) {
    state.media = media
  },
  [types.SET_SEARCH_HISTORY](state, list) {
    state.searchHistory = list
  },
  [types.SET_FOLLOW](state, list) {
    state.follow = list
  },
  [types.SET_BLOGGER_DETAIL](state, bloggerDetail) {
    state.bloggerDetail = bloggerDetail
  }
}
export default mutations