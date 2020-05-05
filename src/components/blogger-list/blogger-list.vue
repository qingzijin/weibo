<template>
  <div class="blogger-list">
    <div class="header" ref="header">
      <div class="back" @click="back">
        <i class="iconfont icon-fanhui1"></i>
        <span>返回</span>
      </div>
      <div class="name">{{user.name}}</div>
      <div class="follow" v-html="ifFollow" @click="cancel"></div>
    </div>
    <div class="bg-wrapper" :style="bgStyle" ref="bgWrapper">
    </div>
    <scroll class="blogger-content"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            :pullup="pullup"
            @scroll="scroll"
    >
      <div>
        <div class="blogger-info" ref="info">
          <div class="info-wrapper">
            <div class="avatar">
              <img :src="user.avatar" alt="">
            </div>
            <h3>{{user.name}}</h3>
            <div class="follow">
              <div>关注 <span>{{user.followCount}}</span></div>
              <div>粉丝 <span>{{pad(user.followerCount)}}</span></div>
            </div>
            <p v-if="user.verified">微博认证：<span>{{user.verified}}</span></p>
            <p v-if="!user.verified">简介：<span>{{user.description}}</span></p>
          </div>
        </div>
        <div class="blog-wrapper">
          <hot-list :hotList="blogList" @select="saveAlbum"></hot-list>
        </div>
        <div v-show="blogList.length" class="tip-wrapper">
          <tip></tip>
        </div>
      </div>
      <div v-show="!blogList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import HotList from 'components/hot-list/hot-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Tip from 'base/tip/tip'
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  name: 'bloggerList',
  data() {
    return {
      listenScroll: true,
      scrollY: 0,
      minTranslatY: 0,
      imgClient: 0
    }
  },
  props: {
    blogList: {
      type: Array,
      default: null
    },
    user: {
      type: Object,
      default: null
    },
    bgImg: {
      type: String,
      default: ''
    }
  },
  created() {
    this.probeType = 3
    this.pullup = true
  },
  mounted() {
    setTimeout(() => {
      this.imgClient = this.$refs.bgWrapper.clientHeight
    }, 200)
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`
    },
    ifFollow() {
      let index = this.follow.findIndex((item) => {
        return item.uid === this.user.id
      })
      if (index > -1) {
        return '取消关注'
      }
      return ''
    },
    ...mapGetters([
      'follow'
    ])
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    saveAlbum(album, index, size) {
      this.selectAlbums({album, index, size})
    },
    searchMore() {
      this.$emit.searchMore()
    },
    back() {
      this.$router.back(-1)
    },
    pad(num) {
      if (num >= 10000) {
        return Math.floor(num / 10000) + '万'
      }
      return num
    },
    cancel() {
      this.deleteFollow(this.user)
    },
    ...mapMutations({
      setBlogger: 'SET_BLOGGER'
    }),
    ...mapActions([
      'selectAlbums',
      'deleteFollow'
    ])
  },
  components: {
    HotList,
    Scroll,
    Tip,
    Loading
  },
  watch: {
    scrollY(newVal) {
      this.minTranslateY = -this.$refs.bgWrapper.clientHeight
      let translateY = Math.min(0, Math.max(newVal, this.minTranslateY))
      let percent = Math.abs(newVal / this.minTranslateY)
      this.$refs.bgWrapper.style.transform = `translate3d(0,${translateY}px,0)`
      if (newVal > 0) {
        this.$refs.bgWrapper.style.transform = `scale(${percent + 1})`
      } else {
        this.$refs.header.style.background = `rgba(255,255,255,${Math.min(1, percent)})`
        newVal < -40 ? this.$refs.header.style.color = `#333` : this.$refs.header.style.color = `#fff`
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .blogger-list
    position fixed
    top 0
    bottom 0
    width 100%
    background #e5e5e5
    z-index 4
    .header
      position absolute
      top 0
      left 0
      width 100%
      height 50px
      line-height 50px
      font-size 17px
      color #fff
      z-index 7
      background rgba(255,255,255,0)
      .back
        position absolute
        left 10px
        font-size 16px
        line-height 50px
        .iconfont
          font-size 18px
        span
          display inline-block
      .name
        text-align center
      .follow
        position absolute
        top 0
        right 10px
        font-size 16px
        line-height 50px
    .bg-wrapper
      position relative
      top 0
      left 0
      width 100%
      padding-top 60%
      background-size cover
      background-position center center
      background-repeat no repeat
      transform-origin top
      background-color #fff
      z-index 5
    .blogger-content
      position absolute
      height 100%
      top 0
      left 0
      width 100%
      z-index 6
      .blogger-info
        position relative
        width 100%
        padding-top 60%
        margin 0 0 10px 0
        .info-wrapper
          color #fff
          position absolute
          width 100%
          bottom 20px
          .avatar
            margin 10px auto
            border-radius 50%
            overflow hidden
            width 60px
            img
              display block
              width 60px
              height 60px
          h3
            font-size 18px
            line-height 30px
          .follow
            font-size 14px
            line-height 14px
            margin 5px auto
            height 14px
            div
              display inline-block
              vertical-align top
              width 50%
              text-align right
              padding-right 10px
              box-sizing border-box
              float left
            div + div
              border-left 1px solid #ffffff
              text-align left
              padding 0 0 0 10px
          p
            font-size 12px
            line-height 20px
            margin 8px 0 0 0
</style>