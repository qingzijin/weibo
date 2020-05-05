<template>
  <transition name="normal">
      <blogger-list :blogList="blogList" :user ="user" :bgImg ="bgImg" @searchMore="_searchMore">
      </blogger-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import BloggerList from 'components/blogger-list/blogger-list'
import {mapGetters} from 'vuex'
import {ERR_OK} from 'api/config'
import {createBlog} from 'common/js/hot-list'
import {getBloggerDetail} from 'api/blogger'
import {createBlogger, formatTime} from 'common/js/blogger'

export default {
  data() {
    return {
      blogList: [],
      user: {},
      bgImg: ''
    }
  },
  computed: {
    ...mapGetters([
      'blogger',
      'bloggerDetail'
    ])
  },
  created() {
    this.bgImg = this.bloggerDetail.coverimagePhone
    this._getBloggerDetail()
  },
  methods: {
    _getBloggerDetail() {
      if (!this.blogger) {
        this.$router.back()
        return
      }
      getBloggerDetail(this.blogger).then((res) => {
        if (res.ok === ERR_OK) {
          let blogData = res.data.statuses
          this.user = this._normalizeBlogger(res.data.user)
          this.blogList = this._normalizeBlogs(blogData)
        }
      })
    },
    _searchMore() {
    },
    _normalizeBlogs(mblogs) {
      let ret = []
      mblogs.forEach((item) => {
        let blogData = item
        let blog = createBlog(blogData)
        let date = new Date(blog.time)
        const timeStamp = date.getTime()
        blog.time = formatTime(timeStamp)
        ret.push(blog)
      })
      return ret
    },
    _normalizeBlogger(user) {
      return createBlogger(user)
    }
  },
  components: {
    BloggerList
  }
}
</script>

<style scoped lang="stylus" rel="stylus/stylesheet">
.normal-enter-active, .normal-leave-active
  transition: all .5s
.normal-enter, .normal-leave-to
  transform: translate3d(100%, 0, 0)
</style>