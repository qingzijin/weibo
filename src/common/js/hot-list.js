export default class Blog {
  constructor({id, mid, uid, user, avater, coverimagePhone, name, time, source, text, pic, media, mediaPic, attitudesCount, commentsCount, repostsCount, description}) {
    this.id = id
    this.mid = mid
    this.uid = uid
    this.user = user
    this.avater = avater
    this.coverimagePhone = coverimagePhone
    this.name = name
    this.time = time
    this.source = source
    this.text = text
    this.pic = pic
    this.media = media
    this.mediaPic = mediaPic
    this.attitudesCount = attitudesCount
    this.commentsCount = commentsCount
    this.repostsCount = repostsCount
    this.description = description
  }
}

export function createBlog(blogData) {
  return new Blog({
    id: blogData.id,
    mid: blogData.mid,
    uid: blogData.user.id,
    user: blogData.user,
    avater: blogData.user.avatar_hd,
    coverimagePhone: blogData.user.cover_image_phone,
    name: blogData.user.screen_name,
    time: blogData.created_at,
    source: blogData.source,
    text: blogData.text,
    pic: filterPic(blogData.pics),
    media: blogData.page_info ? blogData.page_info.media_info ? blogData.page_info.media_info.stream_url : '' : '',
    mediaPic: blogData.page_info ? blogData.page_info.page_pic ? blogData.page_info.page_pic.url : '' : '',
    attitudesCount: blogData.attitudes_count,
    commentsCount: blogData.comments_count,
    repostsCount: blogData.reposts_count,
    description: blogData.user.description
  })
}
function filterPic(pics) {
  if (!pics) {
    return ''
  }
  let ret = []
  pics.forEach((item) => {
    ret.push(item.url)
  })
  return ret
}