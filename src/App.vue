<template>
  <div id="app" @touchmove.prevent>
    <div class="header">
      <i class="iconfont icon-yonghu" @click="pushMine"></i>
      <div class="search-wrapper" @touchstart.capture.stop.prevent="focusAction">
        <search-box :skip="skip"></search-box>
      </div>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <skim-picture></skim-picture>
    <comments></comments>
    <media></media>
  </div>
</template>

<script type="text/ecmascript-6">
import SkimPicture from 'components/skim-picture/skim-picture'
import Comments from 'components/comments/comments'
import Media from 'components/media/media'
import SearchBox from 'base/search-box/search-box'

export default {
  data() {
    return {
      skip: true
    }
  },
  methods: {
    pushMine() {
      this.$router.push({
        path: `/mine`
      })
    },
    focusAction(e) {
      this.$router.push({
        path: `/search`
      })
    }
  },
  components: {
    SkimPicture,
    Comments,
    Media,
    SearchBox
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px
}
.header
  position absolute
  top 0
  left 0
  height 40px
  padding 0 15px
  width 100%
  box-sizing border-box
  display flex
  align-items center
  background #fff
  border-bottom 1px solid #e5e5e5
  .iconfont
    width 40px
    flex 0 0 40px
    text-align left
    font-size 26px
    line-height 30px
  .search-wrapper
    flex 1
</style>
