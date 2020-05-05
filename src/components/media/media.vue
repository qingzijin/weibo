<template>
  <div class="media-container" v-show="show">
    <div class="close iconfont icon-guanbi" @click.stop="close"></div>
    <video autoPlay ref="video" @click="toggle" @ended="end" @timeupdate="updateTime" @playing="ready" :src="media"></video>
    <div class="control-position">
      <div class="control">
        <div class="playpause iconfont" :class="playPause" @click="toggle"></div>
        <div class="currentTime">{{format(currentTime)}}</div>
        <div class="progress-position" @click="clickChange">
          <div class="control_bar" ref="control">
            <div class="passed" ref="passed"></div>
            <div class="button"
                ref="button"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"
            ></div>
          </div>
        </div>
        <div class="currentTime">{{format(totalTime)}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
export default {
  props: {
  },
  data() {
    return {
      currentTime: 0,
      percent: 0,
      videoReady: false,
      playing: false,
      show: false
    }
  },
  created() {
    this.touch = {}
  },
  computed: {
    totalTime() {
      if (!this.videoReady) {
        return
      }
      return this.$refs.video.duration
    },
    playPause() {
      return this.playing ? 'icon-zanting' : 'icon-bofang'
    },
    ...mapGetters([
      'media'
    ])
  },
  methods: {
    toggle() {
      this.playing = !this.playing
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    ready() {
      this.videoReady = true
      this.playing = true
    },
    format(time) {
      time = time | 0
      const minute = time / 60 | 0
      const second = this._pad(time % 60)
      return `${minute}:${second}`
    },
    progressTouchStart(e) {
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.left = this.$refs.passed.clientWidth
    },
    progressTouchMove(e) {
      const touch = e.touches[0]
      const delta = touch.pageX - this.touch.startX
      const maxWidth = this.$refs.control.clientWidth - this.$refs.button.clientWidth
      let offWidth = Math.max(0, Math.min(delta + this.touch.left, maxWidth))
      this.$refs.passed.style.width = `${offWidth}px`
      this.$refs.button.style.left = `${offWidth}px`
      let percent = offWidth / maxWidth
      this.changeCurrentTime(percent)
    },
    progressTouchEnd(e) {
    },
    clickChange(e) {
      const maxWidth = this.$refs.control.clientWidth - this.$refs.button.clientWidth
      const left = e.pageX - this.$refs.control.getBoundingClientRect().left
      this.$refs.passed.style.width = `${left}px`
      this.$refs.button.style.left = `${left}px`
      const percent = left / maxWidth
      this.changeCurrentTime(percent)
      console.log('gaibian')
    },
    changeCurrentTime(percent) {
      const currentTime = this.$refs.video.duration * percent
      this.currentTime = currentTime
      this.$refs.video.currentTime = currentTime
    },
    close() {
      this.setMedia('')
      this.$refs.passed.style.width = '0px'
      this.$refs.button.style.left = '0px'
    },
    end() {
      this.playing = false
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    ...mapMutations({
      setMedia: 'SET_MEDIA'
    })
  },
  watch: {
    currentTime(newTime) {
      const video = this.$refs.video
      this.percent = newTime / video.duration
      const width = this.$refs.control.clientWidth - this.$refs.button.clientWidth
      this.$refs.passed.style.width = `${this.percent * width}px`
      this.$refs.button.style.left = `${this.percent * width}px`
    },
    playing(newPlaying) {
      const video = this.$refs.video
      newPlaying ? video.play() : video.pause()
    },
    media(newMedia) {
      let len = newMedia.toString().length
      if (len > 0) {
        this.show = true
        this.videoReady = false
        this.playing = false
      } else {
        this.show = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.media-container
  width 100%
  position fixed
  top 0
  bottom 0
  color #fff
  background-color #000
  z-index 9
  .close
    position absolute
    top 16px
    left 6px
    font-size 20px
    z-index 3000000000
    width 40px
    height 40px
    text-align center
  video
    position absolute
    width 100%
    height 100%
    top 0
    left 0
  video::-webkit-media-controls
    display none !important
  .control-position
    width 100%
    position absolute
    left 0
    bottom 30px
    z-index 2147483755
  .control
    display flex
    align-items center
    padding 0 16px
    .playpause
      text-align center
      font-size 18px
      margin 0 10px 0 0
      flex 0 0  20px
    .currentTime
      font-size 12px
      padding 0 5px
    .progress-position
      flex 1
      margin 0 10px
      height 14px
    .control_bar
      position relative
      top 6px
      height 2px
      background-color hsla(0,0%,100%,.3)
      .passed
        width 0
        height 100%
        background-color #ffffff
      .button
        width 14px
        height 14px
        background-color #ffffff
        border-radius 50%
        position absolute
        left 0
        top -6px
</style>