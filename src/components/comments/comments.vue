<template>
  <div class="mblog-contents" v-show="detailBlog.id">
    <div class="context">
      <div class="return iconfont icon-fanhui1" @click="back"></div>
      <div class="title">微博正文</div>
    </div>
    <scroll class="list" :pullup="pullup" @scrollToEnd = "_getMoreComments" :data="comments" ref="list">
      <div>
        <div class="mblog-item">
          <div class="item-header">
            <div class="photo" @click="selectBlogger(detailBlog.uid)">
              <img :src="detailBlog.avater" alt=""/>
            </div>
            <div class="text">
              <h3>{{detailBlog.name}}</h3>
              <p>{{detailBlog.time}} 来自 {{detailBlog.source}}</p>
            </div>
            <div class="inter">
              +关注
            </div>
          </div>
          <div class="item-content" v-html="longContent">
          </div>
          <ul class="img-wrapper" v-show="detailBlog.pic">
            <li class="bg-img" :style="bgsize(detailBlog.pic.length)" v-for="(list, index) in detailBlog.pic" :key="list" @click="select($event, detailBlog.pic, index)">
              <div class="bg-wrapper" :style="{backgroundImage: 'url(' + list + ')'}"></div>
            </li>
          </ul>
          <div class="media" :style="bgStyle(detailBlog.mediaPic)" v-show="detailBlog.media" @click="savaMedia(detailBlog.media)">
            <div class="button"></div>
          </div>
          <div class="bottom">
            <div class="tab_bar">
                <i class="iconfont icon-BAI-pinglun"></i>
                {{pad(detailBlog.commentsCount)}}
            </div>
          </div>
        </div>
        <div class="comments">
          <div class="comments-item" v-for="item in comments" :key="item.id">
            <div class="comments-avatar">
              <img :src="item.user.avatar_hd" alt="">
            </div>
            <div class="comments-content">
              <div class="commenter">
                {{item.user.screen_name}}
              </div>
              <div class="comments-text" v-html="item.text">
              </div>
              <div class="comments-bottom">
                <div class="comments-time">{{getTime(item.created_at)}}</div>
                <div class="comments-prise">
                  <i class="iconfont icon-dianzan"></i>
                  {{item.like_count}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="loading-contain" v-if="hasMore">
          <loading></loading>
        </div>
        <div class="tip-wrapper" v-if="!hasMore">
          <tip :tips="tips"></tip>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {getComments, getLongText} from 'api/comments'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Tip from 'base/tip/tip'
import {formatTime} from 'common/js/blogger'

export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      comments: [],
      maxId: 0,
      hasMore: true,
      longText: ''
    }
  },
  computed: {
    longContent() {
      if (this.longText.toString().length > 0) {
        return this.longText
      }
      return this.detailBlog.text
    },
    tips() {
      if (this.comments.length > 0) {
        return '已加载全部评论'
      }
      return '暂时还没有评论'
    },
    ...mapGetters([
      'detailBlog'
    ])
  },
  created() {
    this.pullup = true
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
    changeattitude() {
    },
    savaMedia(media) {
      this.setMedia(media)
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
      this.saveAlbum(album, index, size)
    },
    selectBlogger(uid) {
      this.$emit('selectBlogger', uid)
    },
    back() {
      this.setDetailBlog({})
      this.comments = []
      this.maxId = 0
    },
    saveAlbum(album, index, size) {
      this.selectAlbums({album, index, size})
    },
    getTime(commentTime) {
      let time = new Date(commentTime)
      let timeStamp = time.getTime()
      return formatTime(timeStamp)
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
    _getComments(id, mid) {
      getComments(id, mid).then((res) => {
        if (res.ok === ERR_OK) {
          this.hasMore = true
          this.comments = res.data.data
          this.maxId = res.data.max_id
        }
        if (!this.maxId) {
          this.hasMore = false
        }
      })
    },
    _getMoreComments() {
      if (!this.hasMore) {
        return
      }
      const id = this.detailBlog.id
      const mid = this.detailBlog.mid
      const max = this.maxId
      getComments(id, mid, max).then((res) => {
        if (res.ok === ERR_OK) {
          this.comments = this.comments.concat(res.data.data)
          this.maxId = res.data.max_id
        }
      })
      if (!this.maxId) {
        this.hasMore = false
      }
    },
    _getLongText() {
      getLongText(this.detailBlog.id).then((res) => {
        if (res.ok === ERR_OK) {
          this.longText = res.data.longTextContent
        }
      })
    },
    ...mapMutations({
      setDetailBlog: 'SET_DETAIL_BLOG',
      setMedia: 'SET_MEDIA'
    }),
    ...mapActions([
      'selectAlbums'
    ])
  },
  components: {
    Scroll,
    Loading,
    Tip
  },
  watch: {
    detailBlog(newDetail) {
      if (!newDetail.id) {
        return
      }
      this.$refs.list.scrollTo(0, 0)
      this._getComments(this.detailBlog.id, this.detailBlog.mid)
      this._getLongText()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .mblog-contents
      position fixed
      top 0
      bottom 0
      width 100%
      background #e5e5e5
      z-index 5
      .context
        position relative
        top 0
        width 100%
        height 46px
        line-height 46px
        font-size 20px
        color #000
        background #fff
        z-index 8
        border 1px solid #e5e5e5
        .return
          position absolute
          top 0
          padding 0 0 0 17px
          font-size 20px
        .title
          width 100%
          font-size 16px
      .list
        position fixed
        top 46px
        bottom 0
        width 100%
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
                margin-bottom 6px
              p
                color #999
                font-size 13px
            .inter
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
        .comments
          text-align left
          background #fff
          .comments-item
            display flex
            padding 10px 15px 0
            align-items top
            .comments-avatar
              width 36px
              height 36px
              flex 0 0 36px
              margin 0 10px 0 0
              border-radius 50%
              overflow hidden
              img
                width 36px
                height 36px
            .comments-content
              flex 1
              padding 0 0 10px 0
              border-bottom 1px solid #e5e5e5
              .commenter
                font-size 14px
                line-height 28px
              .comments-text
                font-size 16px
                line-height 20px
                padding 4px 0 10px 0
              .comments-bottom
                display flex
                justify-content space-between
                font-size 12px
                color #666
                .comments-prise
                  .icon-dianzan
                    font-size 16px
  </style>