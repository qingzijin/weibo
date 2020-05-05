<template>
  <div class="search-box">
    <i class="iconfont icon-sousuo"></i>
    <input class="search" ref="searchBox" @change="_setQuery" @focus="getFocus" v-model="content" :placeholder="placeholder">
    <i class="iconfont icon-guanbi" v-show="!present&&content" @click="clearContent"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import {debounce} from 'common/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索微博和人物'
    },
    skip: {
      type: Boolean,
      default: false
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    present: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: '',
      query: ''
    }
  },
  activated() {
    if (this.autoFocus) {
      this.$nextTick(function() {
        this.$refs.searchBox.focus()
      })
    }
  },
  deactivated() {
    this.content = ''
    this.query = ''
  },
  methods: {
    setQuery(content) {
      this.query = content
      this.content = content
    },
    getFocus(e) {
      this.$emit('getFocus', false)
    },
    clearContent() {
      this.content = ''
      this.$refs.searchBox.focus()
    },
    _setQuery($event) {
      this.query = $event.target.value
      $event.target.blur()
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('select', newQuery)
    }, 500))
  }
}
</script>

<style scoped lang="stylus">
  .search-box
    display flex
    font-size 16px
    background #ebebec
    align-items center
    color #dbdbdb
    height 30px
    border-radius 5px
    .iconfont
      width 34px
      height 26px
      text-align center
      flex 0 0 34px
      line-height 26px
      font-size 18px
      color #8e8e93
      font-weight 700
    .icon-guanbi
      flex 0 0 20px
      height 20px
      line-height 20px
      margin-right 10px
      border-radius 50%
      background #cac8c8
      font-size 10px
      color #fff
    .search
      flex 1
      background #ebebec
      outline none
      color #333
      line-height 20px
      height 20px
      font-size 14px
      &::placeholder
        color #bdbdbd
    span
      padding 0 10px
</style>