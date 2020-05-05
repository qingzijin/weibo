<template>
  <div class="suggest-wrapper" v-show="present">
    <scroll class="suggest"
            pullup="pullup"
            @scrollToEnd="searchMore"
            :data="blog"
    >
      <div>
        <div class="person" @click="saveBlogger(person.uid, person)" v-show="person.uid">
          <div class="profile">
            <img :src="person.avater" alt="">
          </div>
          <div class="content">
            <h3>{{person.name}}</h3>
            <p class="desc">{{person.description}}</p>
            <p class="followers">{{person.desc2}}</p>
          </div>
          <div class="focus" @click.stop="add">
            <i class="iconfont icon-yonghu"></i>
            <span>{{ifFollow}}</span>
          </div>
        </div>
        <div class="blog-wrapper">
          <hot-list :hotList="blog" @selectBlogger="saveBlogger" @select="saveAlbum"></hot-list>
        </div>
        <div class="loading">
          <loading></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getSuggest} from 'api/search'
import {ERR_OK} from 'api/config'
import {createBlog} from 'common/js/hot-list'
import HotList from 'components/hot-list/hot-list'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Loading from 'base/loading/loading'

export default {
  data() {
    return {
      person: {},
      blog: [],
      pullup: true,
      total: 0,
      page: 1
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    present: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ifFollow() {
      let index = this.follow.findIndex((item) => {
        return item.uid === this.person.uid
      })
      if (index === -1) {
        return '加关注'
      }
      return '已关注'
    },
    ...mapGetters([
      'follow'
    ])
  },
  methods: {
    add() {
      let index = this.follow.findIndex((item) => {
        return item.uid === this.person.uid
      })
      if (index === -1) {
        this.saveFollow(this.person)
      }
    },
    regulate(data) {
      this.total = data.cardlistInfo.total
      const cards = data.cards
      let ret = []
      let user = {}
      cards.forEach((card) => {
        if (card.card_type === 11) {
          card.card_group.forEach((item) => {
            if (item.card_type === 10) {
              user.description = item.desc1
              user.desc2 = item.desc2
              user.uid = item.user.id
              user.name = item.user.screen_name
              user.avater = item.user.profile_image_url
              user.coverimagePhone = item.user.cover_image_phone
              this.person = user
            }
            if (item.card_type === 9) {
              let blogData = item.mblog
              ret.push(createBlog(blogData))
            }
          })
        }
        if (card.card_type === 9) {
          ret.push(createBlog(card.mblog))
        }
      })
      console.log(ret)
      return ret
    },
    search() {
      getSuggest(this.query).then((res) => {
        if (res.ok === ERR_OK) {
          this.blog = this.regulate(res.data)
        }
      })
    },
    searchMore() {
      this.page++
      getSuggest(this.query, this.page).then((res) => {
        if (res.ok === ERR_OK) {
          this.blog = this.blog.concat(this.regulate(res.data))
        }
      })
    },
    saveBlogger(uid, item) {
      this.setBlogger(uid)
      this.setBloggerDetail(item)
      console.log(item)
      this.$router.push({
        path: `/search/${uid}`
      })
    },
    saveAlbum(album, index, size) {
      this.selectAlbums({album, index, size})
    },
    ...mapMutations({
      setBlogger: 'SET_BLOGGER',
      setBloggerDetail: 'SET_BLOGGER_DETAIL'
    }),
    ...mapActions([
      'selectAlbums',
      'saveFollow'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        return
      }
      this.blog = []
      this.person = {}
      this.search(newQuery)
    }
  },
  components: {
    HotList,
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus">
.suggest
  position fixed
  top 36px
  bottom 0
  background #ffffff
  width 100%
  z-index 3
  .loading
    margin 10px 0
  .person
    display flex
    padding 10px 15px
    border-bottom 1px solid #e5e5e5
    align-items center
    background #fff
    .profile
      width 70px
      border-radius 50%
      overflow hidden
      flex 0 0 70px
      margin 0 10px 0 0
      img
        width 70px
        height 70px
        display block
    .content
      flex 1
      text-align left
      overflow hidden
      h3
        color #ff8200
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
      i, span
        font-size 30px
        color #ff8200
        display inline-block
        width 100%
      span
        font-size 12px
  .blog-wrapper
    width 100%
</style>