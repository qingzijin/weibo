<template>
  <div class="recommend">
    <scroll class="mblog"
            :hotList="hotList"
            :pullup="pullup"
            :listenScroll="listenScroll"
            @scrollToEnd="moreHotList"
            @pullingDown="_getHotList"
            :data="hotList"
    >
      <div class="blog-wrapper">
        <hot-list :hotList="hotList" @select ="saveAlbum" @selectBlogger="selectBlogger"></hot-list>
        <div class="loading-bottom" v-show="hotList.length">
          <loading></loading>
        </div>
      </div>
      <div class="loading-wrapper" v-show="!hotList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript">
import HotList from 'components/hot-list/hot-list'
import {getHotList} from 'api/hot-list'
import {ERR_OK} from 'api/config'
import {createBlog} from 'common/js/hot-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  data() {
    return {
      hotList: [],
      pullup: true,
      listenScroll: true,
      page: 1
    }
  },
  computed: {
    ...mapGetters([
      'album',
      'imgIndex',
      'size',
      'stateIndex'
    ])
  },
  components: {
    HotList,
    Scroll,
    Loading
  },
  created() {
    this._getHotList()
  },
  methods: {
    moreHotList() {
      this.page++
      getHotList(this.page).then((res) => {
        if (res.ok === ERR_OK) {
          this.hotList = this.hotList.concat(this._normalizeBlogs(res.data.cards))
        }
      })
    },
    saveAlbum(album, index, size) {
      this.selectAlbums({album, index, size})
    },
    selectBlogger(uid, user) {
      this.$router.push({
        path: `/recommend/${uid}`
      })
      this.setBlogger(uid)
      this.setBloggerDetail(user)
    },
    _getHotList() {
      getHotList().then((res) => {
        if (res.ok === ERR_OK) {
          this.hotList = this._normalizeBlogs(res.data.cards)
        }
      })
    },
    _normalizeBlogs(mblogs) {
      let ret = []
      let blogs = mblogs.slice(1)
      blogs.forEach((item) => {
        let blogData = item.mblog
        ret.push(createBlog(blogData))
      })
      return ret
    },
    ...mapMutations({
      setAlbum: 'SET_ALBUM',
      setBlogger: 'SET_BLOGGER',
      setBloggerDetail: 'SET_BLOGGER_DETAIL'
    }),
    ...mapActions([
      'selectAlbums'
    ])
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.recommend
  position fixed
  top 40px
  bottom 0
  width 100%
  .mblog
      height 100%
      background #fff
      overflow hidden
      .loading-wrapper
        position absolute
        top 50%
        transform translateY(-50%)
        width 100%
</style>