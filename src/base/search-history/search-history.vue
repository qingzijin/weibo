<template>
  <div class="history-wrapper">
    <div class="history-list" v-for="item in historyList" :key="item" @click="saveSearch(item)">
      <span>{{item}}</span>
      <span class="iconfont icon-guanbi" @click.stop="deleteHistory(item)"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript">
import {mapGetters, mapActions} from 'vuex'

export default {
  props: {
    historyList: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    saveSearch(item) {
      this.$emit('select', item)
    },
    deleteHistory(item) {
      this.deleteSearchHistory(item)
    },
    ...mapActions([
      'deleteSearchHistory'
    ])
  }
}
</script>

<style scoped lang="stylus">
.history-wrapper
  width 100%
  .history-list
    display flex
    justify-content space-between
    align-items center
    padding 0px
    border-bottom 1px solid #e5e5e5
    font-size 15px
    span
      line-height 24px
      padding 12px 30px
    .icon-guanbi
      color #999
      font-size 13px
      padding 12px 22px
</style>
