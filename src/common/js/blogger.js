export default class Blogger {
  constructor({avatar, id, name, image, followCount, followerCount, verified, description}) {
    this.avatar = avatar
    this.id = id
    this.name = name
    this.image = image
    this.followCount = followCount
    this.followerCount = followerCount
    this.verified = verified
    this.description = description
  }
}

export function createBlogger(blogger) {
  return new Blogger({
    avatar: blogger.avatar_hd,
    id: blogger.id,
    name: blogger.screen_name,
    image: blogger.cover_image_phone,
    followCount: blogger.follow_count,
    followerCount: blogger.followers_count,
    verified: blogger.verified_reason,
    description: blogger.description
  })
}

export function formatTime(timeStamp) {
  const date = new Date()
  let now = date.getTime()
  let tip = ''
  const distanseNow = (now - timeStamp) / 1000
  const yestoday = getYestoday()
  const yearUnix = getYearUnix()
  if (distanseNow < 60) {
    tip = '刚刚'
  } else if (distanseNow < 60 * 60) {
    tip = Math.floor(distanseNow / 60) + '分钟前'
  } else if (distanseNow < 60 * 60 * 24) {
    tip = Math.floor(distanseNow / 3600) + '小时前'
  } else if ((timeStamp - yestoday) >= 0) {
    tip = '昨天' + getStanHourMin(timeStamp)
  } else if ((timeStamp - yearUnix) >= 0) {
    tip = getStanMonDate(timeStamp) + getStanHourMin(timeStamp)
  } else {
    tip = getStanderdYear(timeStamp) + ' ' + getStanMonDate(timeStamp) + ' ' + getStanHourMin(timeStamp)
  }
  return tip
}

function getYestoday() {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.getTime() - 24 * 60 * 60 * 1000
}

function getYearUnix() {
  const date = new Date()
  date.setMonth(0)
  date.setDate(1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.getTime()
}

function getStanderdYear(time) {
  let date = new Date(time)
  return date.getFullYear()
}

function getStanMonDate(time) {
  let date = new Date(time)
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return month + '-' + day
}

function getStanHourMin(time) {
  let date = new Date(time)
  const hour = date.getHours()
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return hour + ':' + minute
}