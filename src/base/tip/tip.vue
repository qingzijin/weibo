<template>
  <div class="tip-container">
    <div class="dotted">
      <div class="tip-content">
        {{tips}}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript">

export default {
  props: {
    tips: {
      type: String,
      default: '我是有底线的'
    }
  }
}
</script>

<style lang="stylus" scoped>
.tip-container
  width 100%
  padding 24px 15px
  box-sizing border-box
  .dotted
    border-top 1px dotted #999
    height 0px
    .tip-content
      position relative
      padding 0 20px
      width 110px
      background #e5e5e5
      font-size 14px
      top -7px
      left 50%
      transform translateX(-50%)
      color #999
</style>