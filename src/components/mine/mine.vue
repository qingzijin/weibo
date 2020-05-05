<template>
  <transition name="search">
    <div class="mine">
      <div class="header">
        <div class="return iconfont icon-fanhui1" @click="back"></div>
        <div class="title">关注</div>
      </div>
      <scroll class="follow" :data="follow">
        <div>
          <div class="person" v-for="item in follow" :key="item.name" @click="selectBlogger(item.uid, item)">
            <div class="profile">
              <img :src="item.avater" alt="">
            </div>
            <div class="content">
              <h3>{{item.name}}</h3>
              <p class="desc">{{item.description}}</p>
            </div>
            <div class="focus">
              <i class="iconfont icon-duihao"></i>
              已关注
            </div>
          </div>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import Scroll from 'base/scroll/scroll'

export default {
  computed: {
    ...mapGetters([
      'follow'
    ])
  },
  methods: {
    back() {
      console.log('back被点击了')
      this.$router.push({
        path: `/recommend`
      })
    },
    selectBlogger(uid, item) {
      this.setBlogger(uid)
      this.setBloggerDetail(item)
      this.$router.push({
        path: `/mine/${uid}`
      })
    },
    ...mapMutations({
      setBlogger: 'SET_BLOGGER',
      setBloggerDetail: 'SET_BLOGGER_DETAIL'
    })
  },
  components: {
    Scroll
  }
}
</script>
<style scoped lang="stylus">
.mine
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 2
  .header
    position relative
    top 0
    left 0
    width 100%
    font-size 16px
    line-height 40px
    border-bottom 1px solid #e5e5e5
    background #fff
    z-index 4
    .return
      position absolute
      left 15px
      top 0px
      font-size 16px
  .follow
    position fixed
    top 40px
    bottom 0
    width 100%
    z-index 1
    background #fff
    .person
        display flex
        padding 5px 15px
        border-bottom 1px solid #dcdcdc
        align-items center
        background #fff
        .profile
          width 60px
          border-radius 50%
          overflow hidden
          flex 0 0 60px
          margin 0 10px 0 0
          img
            display block
            width 60px
            height 60px
        .content
          flex 1
          text-align left
          overflow hidden
          h3
            font-size 16px
            line-height 26px
          .desc
            font-size 12px
            color #111
            line-height 20px
            white-space nowrap
          .followers
            font-size 12px
            color #666
            line-height 20px
        .focus
          flex 0 0 60px
          color #666
          border 1px solid #999
          width 60px
          line-height 16px
          font-size 11px
          margin 0 0 0 20px
  &.search-enter-active, &.search-leave-active
    transition all .3s
  &.search-enter, &.search-leave-to
    transform translate3d(100%,0,0)
</style>