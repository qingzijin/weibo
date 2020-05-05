<template>
  <div class="mblog-content">
    <div class="mblog-item" v-for="(item, index) in hotList" :key="index">
      <div class="item-header">
        <div class="photo" @click.stop="selectBlogger(item)">
          <img :src="item.avater" alt=""/>
        </div>
        <div class="text">
          <h3>{{item.name}}</h3>
          <p>{{item.time}} 来自 {{item.source}}</p>
        </div>
        <div class="inter1" @click="selectFollow(item)" v-show="ifFollow(item) === -1">
          +关注
        </div>
        <div class="inter2" v-show="ifFollow(item) > -1">
          已关注
        </div>
      </div>
      <div class="item-content" v-html="item.text" @click="saveDetailBlog(item)">
      </div>
      <ul class="img-wrapper" v-show="item.pic">
        <li class="bg-img" :style="bgsize(item.pic.length)" v-for="(list, index) in item.pic" :key="list" @click.stop="select($event, item.pic, index)">
          <div class="bg-wrapper" :style="{backgroundImage: 'url(' + list + ')'}"></div>
        </li>
      </ul>
      <div class="media" :style="bgStyle(item.mediaPic)" v-show="item.media" @click="savaMedia(item.media)">
        <div class="button iconfont icon-bofang1"></div>
      </div>
      <div class="bottom">
        <div class="tab_bar">
          <i class="iconfont icon-web-icon-"></i>
          {{pad(item.repostsCount)}}
        </div>
        <div class="tab_bar" @click="saveDetailBlog(item)">
          <i class="iconfont icon-BAI-pinglun"></i>
          {{pad(item.commentsCount)}}
        </div>
        <div class="tab_bar" @click="changeattitude">
          <i class="iconfont icon-dianzan"></i>
          {{pad(item.attitudesCount)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  props: {
    hotList: {
      type: Array
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'media',
      'follow'
    ])
  },
  created() {
  },
  methods: {
    bgsize(len) {
      if (len === 1 || len === 2 || len === 4) {
        return `width:48.5%;margin: 0 1.5% 1.5% 0`
      } else {
        return `width:32.2%;margin: 0 1.13% 1.13% 0`
      }
    },
    bgStyle(pic) {
      return `background-image:url("${pic}")`
    },
    ifFollow(blogger) {
      let follow = this.follow.slice(0)
      let index = follow.findIndex((item) => {
        return item.uid === blogger.uid
      })
      return index
    },
    changeattitude() {
    },
    pad(num) {
      if (num < 10000) {
        return num
      } else {
        let l = parseInt(num / 10000)
        let r = parseInt((num % 10000) / 1000) === 0 ? '' : `.${parseInt((num % 10000) / 1000)}`
        return `${l}${r}万`
      }
    },
    select(e, album, index) {
      let el = e.target
      let size = this._getPosAndStl(el)
      this.$emit('select', album, index, size)
    },
    selectBlogger(item) {
      this.$emit('selectBlogger', item.uid, item)
    },
    saveDetailBlog(detail) {
      this.setDetailBlog(detail)
    },
    savaMedia(media) {
      this.setMedia(media)
    },
    selectFollow(blogger) {
      this.saveFollow(blogger)
    },
    _getPosAndStl(el) {
      const rect = el.getBoundingClientRect()
      const width = el.clientWidth
      const targetX = rect.left + width / 2
      const targetY = rect.top + width / 2
      const x = targetX - window.innerWidth / 2
      const y = targetY - window.innerHeight / 2
      return {
        x,
        y,
        width
      }
    },
    ...mapMutations({
      setDetailBlog: 'SET_DETAIL_BLOG',
      setMedia: 'SET_MEDIA'
    }),
    ...mapActions([
      'saveFollow'
    ])
  },
  components: {
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .mblog-content
      background #e5e5e5
      .mblog-item
        margin 0 0 10px 0
        padding 0 12px 0 17px
        background #fff
        overflow:hidden
        .item-header
          display flex
          margin 10px 0 20px 0
          align-items center
          .photo
            flex 0 0 40px
            width 40px
            margin-right 10px
            border-radius 50%
            overflow hidden
            background #666
            height 40px
            img
              width 40px
              height 40px
          .text
            flex 1
            text-align left
            h3
              color #111
              font-size 15px
              margin-bottom 4px
            p
              color #999
              margin-top 2px
              font-size 13px
          .inter1
            color #ff8200
            font-size 12px
            text-align center
            border 1px solid #ff8200
            padding 0 20px
            line-height 26px
            height 26px
          .inter2
            color #999
            font-size 12px
            text-align center
            border 1px solid #999
            padding 0 20px
            line-height 26px
            height 26px
        .item-content
          font-size 17px
          color #333
          line-height 24px
          padding 0 0 10px 0
          text-align left
        .img-wrapper
          text-align left
          .bg-img
            display inline-block
            width 32.4%
            margin 0 0.93% 0.93% 0
            vertical-align top
            background #ebebec
            .bg-wrapper
              width 100%
              padding-top 100%
              box-sizing border-box
              background-size cover
              background-position center center
              background-repeat no-repeat
        .media
          margin 0 5px 0 0
          background-size cover
          background-position center center
          padding-top 60%
          position relative
          .button
            width 60px
            height 60px
            border-radius 50%
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
            background rgba(0, 0, 0, .4)
            text-align center
            &.icon-bofang1
              color #fff
              font-size 24px
              line-height 60px
        .bottom
          padding 10px 0 6px 0
          text-align left
          .tab_bar
            display inline-block
            font-size 13px
            color #666
            line-height 20px
            padding 0 30px 0 0
            .icon-web-icon-, .icon-BAI-pinglun, .icon-dianzan
              font-size 20px
              vertical-align middle

</style>