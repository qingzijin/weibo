<template>
  <transition name="search">
    <div class="container">
      <div class="header">
        <i class="iconfont icon-fanhui1" @click="back"></i>
        <div class="search-wrapper">
            <search-box @select="changeQuery" @getFocus="changePresent" :autoFocus="autoFocus" ref="searchBox" :present = "present"></search-box>
        </div>
        <span v-show="showCancel&&!present" @click="changePresent(true)">取消</span>
      </div>
      <scroll class="list">
        <div>
          <div class="history">
            <search-history :historyList="historyList" @select="selectSearch"></search-history>
            <div class="clearOpen" v-text="searchText" @click="openOrClear" v-show="searchHistory.length > 0">
            </div>
          </div>
          <div class="hot-search">
            <div class="hot-word" v-for="(item, index) in hotWords" :key="index">
              <div class="inner" @click="selectSearch(item.title_sub)">
                <span v-html="cutWords(item.title_sub)"></span>
                <img :src="item.icon" alt="">
              </div>
            </div>
          </div>
        </div>
      </scroll>
      <suggest :query="query" :present = "present"></suggest>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Loading from 'base/loading/loading'
import Suggest from 'components/suggest/suggest'
import SearchHistory from 'base/search-history/search-history'
import Scroll from 'base/scroll/scroll'
import {getHotWords} from 'api/search'
import {ERR_OK} from 'api/config'
import {mapGetters, mapActions} from 'vuex'

export default {
  props: {
  },
  data() {
    return {
      hotWords: [],
      query: '',
      open: false,
      autoFocus: true,
      present: false,
      showCancel: false
    }
  },
  created() {
    setTimeout(() => {
      this._getHotWords()
    }, 20)
  },
  deactivated() {
    this.showCancel = false
  },
  computed: {
    searchText() {
      let len = this.searchHistory.length
      if (!this.open && len > 2) {
        return '全部搜索历史'
      } else {
        return '清空搜索历史'
      }
    },
    historyList() {
      if (!this.open) {
        return this.searchHistory.slice(0, 2)
      }
      return this.searchHistory
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    cutWords(words) {
      if (words.toString().length <= 8) {
        return words
      }
      return words.toString().substr(0, 8) + '...'
    },
    openOrClear() {
      let len = this.searchHistory.length
      if (!this.open && len > 2) {
        this.open = true
      } else {
        this.clearSearchHistory()
        this.open = false
      }
    },
    back() {
      this.$router.push({
        path: '/recommend'
      })
    },
    changeQuery(query) {
      this.query = query
      if (!query) {
        return
      }
      this.showCancel = true
      this.present = true
      this.saveSearchHistory(query)
    },
    changePresent(present) {
      this.present = present
    },
    selectSearch(word) {
      this.$refs.searchBox.setQuery(word)
    },
    _getHotWords() {
      getHotWords().then((res) => {
        if (res.ok === ERR_OK) {
          this.hotWords = res.data.cards[0].card_group[0].group.slice(0, 6)
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'clearSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Loading,
    Suggest,
    SearchHistory,
    Scroll
  }
}
</script>

<style scoped lang="stylus">
.container
  position fixed
  top 0
  bottom 0
  width 100%
  background #ebebec
  left 0
  z-index 2
  .header
    position relative
    top 0
    left 0
    height 40px
    padding 0 15px
    width 100%
    box-sizing border-box
    display flex
    align-items center
    z-index 4
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
    span
      padding-left 10px
  .list
    position fixed
    top 40px
    bottom 0
    width 100%
    z-index 1
    .history
      width 100%
      background #fff
      .clearOpen
        color #999
        font-size 14px
        padding 10px 0
        margin 0 0 8px 0
        border-bottom 1px solid #dcdcdc
    .hot-search
      display flex
      flex-wrap wrap
      box-sizing border-box
      padding 0 15px
      background #fff
      border-top 1px solid #dcdcdc
      .hot-word
        width 50%
        box-sizing border-box
        font-size 16px
        padding 8px 0
        border-bottom 1px solid #e5e5e5
        .inner
          width 100%
          box-sizing border-box
          padding 6px 0
          text-align left
          white-space nowrap
          img
            width 14px
      .hot-word:nth-child(even)
        .inner
          border-left 1px solid #e5e5e5
          padding 6px 0 6px 15px
  &.search-enter-active, &.search-leave-active
    transition all .3s
  &.search-enter, &.search-leave-to
    transform translate3d(100%,0,0)
</style>