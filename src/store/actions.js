import * as types from './mutation-types'
import {saveSearch, clearSearch, deleteSearch, savefollow, deletefollow, clearfollow} from 'common/js/cache'

export const selectAlbums = function({commit}, {album, index, size}) {
  commit(types.SET_ALBUM, album)
  commit(types.SET_IMGINDEX, index)
  commit(types.SET_SIZE, size)
  commit(types.SET_STATEINDEX, index)
}

export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const saveFollow = function({commit}, query) {
  commit(types.SET_FOLLOW, savefollow(query))
}

export const deleteFollow = function({commit}, query) {
  commit(types.SET_FOLLOW, deletefollow(query))
}

export const clearFollow = function({commit}) {
  commit(types.SET_FOLLOW, clearfollow())
}