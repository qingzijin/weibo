import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const FOLLOW_KEY = '__follow__'

function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  const searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savefollow(query) {
  const followes = storage.get(FOLLOW_KEY, [])
  insertArray(followes, query, (item) => {
    return item.uid === query.uid
  })
  storage.set(FOLLOW_KEY, followes)
  return followes
}

export function deletefollow(query) {
  let followes = storage.get(FOLLOW_KEY, [])
  deleteFromArray(followes, (item) => {
    return item.uid === query.id
  })
  storage.set(FOLLOW_KEY, followes)
  return followes
}

export function clearfollow() {
  storage.remove(FOLLOW_KEY)
  return []
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function loadFollow() {
  return storage.get(FOLLOW_KEY, [])
}