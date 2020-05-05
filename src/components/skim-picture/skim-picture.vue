<template>
  <transition name="normal"
              @enter="enter"
              @after-enter="afterenter"
              @leave="leave"
              @after-leave="afterleave"
  >
    <div class="img-browser" @click="close" v-show="flag" ref="browser">
      <div class="img-header">
        <div class="left">
          <span>{{currentPage}}</span><span>/{{album.length}}</span>
        </div>
        <div class="right iconfont icon-guanbi">
        </div>
      </div>
      <div class="img-wrapper"
          ref="imgWrapper"
          @touchstart.prevent ="imgTouchStart"
          @touchmove.prevent ="imgTouchMove"
          @touchend="imgTouchEnd"
      >
        <div class="trans-layer" ref="layer">
          <div class="img-content" ref="imgContent" :style="widthStyle" >
            <div class="img-item" :style="hstyle"
                                  v-for="item in album"
                                  :key="item"
            >
              <img :src="item" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
export default {
  data() {
    return {
      flag: false
    }
  },
  computed: {
    hstyle() {
      const height = document.documentElement.clientHeight
      return `max-height:${height}px`
    },
    currentPage() {
      return this.imgIndex + 1
    },
    ...mapGetters([
      'album',
      'imgIndex',
      'size',
      'stateIndex'
    ]),
    widthStyle() {
      return `width: ${this.album.length}00%`
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    imgTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    imgTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      this.touch.change = 0
      const delta = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(delta)) {
        return
      }
      this.touch.delta = delta
      const width = this.$refs.imgWrapper.clientWidth
      const translateX = Math.min(0, Math.max(delta - width * this.imgIndex, -width * (this.album.length - 1)))
      this.touch.change = translateX
      this.$refs.imgContent.style.transform = `translateX(${translateX}px)`
      this.$refs.imgContent.style.transition = ''
    },
    imgTouchEnd(e) {
      const width = this.$refs.imgWrapper.clientWidth
      const percent = Math.abs(this.touch.delta / width)
      let translateX = 0
      const mintrans = (1 - this.album.length) * width
      if (this.touch.change === 0 || this.touch.change === mintrans) {
        return
      }
      if (this.touch.delta > 0) {
        if (percent > 0.2) {
          translateX = -(this.imgIndex - 1) * width
          this.setimgIndex(this.imgIndex - 1)
        } else {
          translateX = -this.imgIndex * width
        }
      } else {
        if (percent > 0.2) {
          translateX = -(this.imgIndex + 1) * width
          this.setimgIndex(this.imgIndex + 1)
        } else {
          translateX = -this.imgIndex * width
        }
      }
      this.touch.initiated = false
      this.$refs.imgContent.style.transition = 'all .5s'
      this.$refs.imgContent.style.transform = `translateX(${translateX}px)`
    },
    close() {
      this.flag = false
      setTimeout(() => {
        this.setAlbum([])
        this.$refs.imgContent.style.transition = ''
      }, 500)
    },
    enter(el, done) {
      const { x, y, width } = this.size

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${width / window.innerWidth})`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'cubic-bezier(.4,0,.22,1)'
        }
      })
      animations.runAnimation(this.$refs.layer, 'move', done)
    },
    afterenter() {
      animations.unregisterAnimation('move')
      this.$refs.layer.style.animation = ''
    },
    leave(el, done) {
      this.$refs.layer.style.transition = 'all 0.4s cubic-bezier(.4,0,.22,1)'
      const {sx, sy, width} = this._getLeaveSize()
      this.$refs.layer.style.transform = `translate3d(${sx}px,${sy}px,0) scale(${width / window.innerWidth})`
      this.$refs.layer.addEventListener('transitionend', done)
    },
    afterleave() {
      this.$refs.layer.style.transition = ''
      this.$refs.layer.style.transform = ''
    },
    _initPosition() {
      const index = this.imgIndex
      this.$refs.imgContent.style.transform = `translateX(${-index * window.innerWidth}px)`
    },
    _getLeaveSize() {
      const { x, y, width } = this.size
      const len = this.album.length
      if (len === 1 || len === 2 || len === 4) {
        let sx = ((this.imgIndex % 2) - (this.stateIndex % 2)) * width * 1.03 + x
        let sy = (Math.floor(this.imgIndex / 2) - Math.floor(this.stateIndex / 2)) * width * 1.03 + y
        return {
          sx,
          sy,
          width
        }
      } else {
        let sx = ((this.imgIndex % 3) - (this.stateIndex % 3)) * width * 1.03 + x
        let sy = (Math.floor(this.imgIndex / 3) - Math.floor(this.stateIndex / 3)) * width * 1.03 + y
        return {
          sx,
          sy,
          width
        }
      }
    },
    ...mapMutations({
      setAlbum: 'SET_ALBUM',
      setimgIndex: 'SET_IMGINDEX'
    })
  },
  watch: {
    album(newAlbum) {
      this._initPosition()
      if (newAlbum.length > 0) {
        this.flag = true
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.normal-enter-active, .normal-leave-active
  transition: all 0.4s cubic-bezier(.4,0,.22,1)
.normal-enter, .normal-leave-to
  opacity: 0
.img-browser
  position fixed
  top 0
  bottom 0
  width 100%
  background #000
  display flex
  align-items center
  z-index 9
  .img-header
    position absolute
    top 0
    width 100%
    padding 0 20px
    box-sizing border-box
    display flex
    justify-content space-between
    line-height 40px
    color #fff
    font-size 16px
    background:rgba(0, 0, 0, .5)
    z-index 6
    .right
      font-size 18px
  .img-wrapper
    width 100%
    max-height 100%
    .trans-layer
      position relative
      top 0
      left 0
      width 100%
      overflow hidden
      .img-content
        width 400%
        display flex
        align-items center
        .img-item
          text-align center
          flex: 1
          overflow-y scroll
          overflow-x hidden
          img
            width 100%
            max-width 414px

</style>