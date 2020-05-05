import {loadFollow, loadSearch} from 'common/js/cache'
const state = {
  album: [],
  imgIndex: -1,
  stateIndex: -1,
  size: {},
  blogger: null,
  bloggerDetail: {},
  detailBlog: {},
  media: '',
  searchHistory: loadSearch(),
  follow: loadFollow()
}

export default state