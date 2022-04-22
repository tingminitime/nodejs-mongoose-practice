const mongoose = require('mongoose')
const { Schema } = mongoose

const schemaOptions = {
  collection: 'posts',
  versionKey: false,
}

const postSchema = new Schema({
  name: {
    type: String,
    required: [true, '貼文姓名 name 未填寫']
  },
  tags: {
    type: [String],
    default: undefined,
    validate: {
      validator: (v) => {
        if (Array.isArray(v) && v.length === 0) return false
        else if (v.some(text => text === '')) return false
        else return true
      },
      message: `資料格式錯誤`
    },
    required: [true, '貼文標籤 tags 未填寫']
  },
  type: {
    type: String,
    enum: ['group', 'person']
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: true
  },
  content: {
    type: String,
    required: [true, '貼文內容 content 未填寫']
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  }
}, schemaOptions)

const Post = mongoose.model('posts', postSchema)

module.exports = Post
