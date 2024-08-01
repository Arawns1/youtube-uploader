class Video {
  constructor(id, title, description, format, size, url, author, videoPath) {
    this.id = id
    this.title = title
    this.description = description
    this.format = format
    this.size = size
    this.url = url
    this.author = author
    this.videoPath = videoPath
  }

  getExtension() {
    return this.format.split('/')[1]
  }
}

export default Video
