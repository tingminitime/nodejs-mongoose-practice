const Post = require('../models/posts')
const { PATH, httpStatusCode: statusCode } = require('../config')
const { errorHandler, successHandler, schemaErrorHandler } = require("../helper/responseHandler")

// 取得 post 資料
const getPostsHandler = async (res, urlParser) => {
  const { query, splitUrl } = urlParser

  // 若有 ID，則回傳該筆資料
  if (splitUrl.length === 2) {
    try {
      const post = await Post.findById(splitUrl[1])
      if (post) {
        successHandler(res, post)
      } else {
        errorHandler(res, statusCode.NOT_FOUND, '找不到該筆貼文')
      }
    } catch (error) {
      console.error(error)
      errorHandler(res, statusCode.BAD_REQUEST, 'id 未填寫正確')
    }
  }
  // 若沒有 ID，則須輸入頁碼及一頁顯示幾筆 query
  else {
    if (!query.pageSize || !query.currentPage) {
      errorHandler(res, statusCode.BAD_REQUEST, '請輸入正確頁碼資訊')
      return
    } else {
      try {
        const posts = await Post
          .find()
          .skip(query.pageSize * (query.currentPage - 1))
          .limit(query.pageSize)

        successHandler(
          res,
          posts,
          `貼文資料取得成功，目前為第 ${query.currentPage} 頁，顯示 ${query.pageSize} 筆`
        )
      } catch (error) {
        console.error(error)
        errorHandler(res, statusCode.BAD_REQUEST, '欄位未填寫正確')
      }
    }
  }
}

// 新增 post 資料
const addNewPostHandler = async (res, reqData) => {
  if (!reqData || Object.keys(reqData).length === 0) {
    errorHandler(res, statusCode.BAD_REQUEST, '欄位不可為空')
  } else {
    try {
      if (!reqData.content) {
        errorHandler(res, statusCode.BAD_REQUEST, 'content 不可為空')
        return
      }
      const newPost = await Post.create({
        name: reqData.name,
        tags: reqData.tags,
        type: reqData.type,
        image: reqData.image,
        content: reqData.content,
      })

      successHandler(res, newPost, '新增 post 成功')
    } catch (error) {
      console.error('TypeError', error)
      const errorMessage = schemaErrorHandler(error.errors)
      errorHandler(
        res,
        statusCode.BAD_REQUEST,
        '資料格式錯誤',
        errorMessage ? errorMessage : '欄位未填寫正確'
      )
    }
  }
}

// 刪除所有 post 資料、刪除指定 post 資料
const deletePostHandler = async (res, urlParser) => {
  const { pathname, splitUrl } = urlParser

  // 刪除全部 post
  if (pathname === PATH) {
    try {
      const data = await Post.deleteMany({})
      successHandler(
        res,
        [],
        `刪除全部貼文成功，總計刪除 ${data.deletedCount} 筆`,
      )
    } catch (error) {
      console.error(error)
      errorHandler(res, statusCode.INTERNAL_SERVER, '伺服器錯誤')
    }
  }
  // 刪除指定 post
  else if (splitUrl.length === 2) {
    try {
      const deletePost = await Post.findByIdAndDelete({ _id: splitUrl[1] })
      successHandler(
        res,
        deletePost,
        `刪除一筆貼文: ${deletePost.name} ${deletePost._id}`
      )
    } catch (error) {
      console.error(error)
      errorHandler(res, statusCode.NOT_FOUND, '無此筆貼文')
    }
  }
  else {
    errorHandler(res, statusCode.BAD_REQUEST, '欄位未填寫正確')
  }
}

// 更新指定資料
const updatePostHandler = async (res, urlParser, reqData) => {
  const { splitUrl } = urlParser
  if (splitUrl.length === 2) {
    try {
      const updatePost = await Post.findByIdAndUpdate(
        { _id: splitUrl[1] },
        reqData,
        { new: true, runValidators: true }
      )
      if (updatePost) {
        successHandler(res, updatePost, '更新成功')
      } else {
        errorHandler(res, statusCode.BAD_REQUEST, '無此筆 id 貼文資料或連線錯誤')
      }
    } catch (error) {
      console.error('TypeError', error)
      const errorMessage = schemaErrorHandler(error.errors)
      errorHandler(
        res,
        statusCode.BAD_REQUEST,
        '無此筆 id 貼文資料或連線錯誤',
        errorMessage ? errorMessage : '無此筆 id 貼文資料或連線錯誤'
      )
    }
  } else {
    errorHandler(res, statusCode.BAD_REQUEST, '請輸入正確路徑')
  }
}

module.exports = {
  getPostsHandler,
  addNewPostHandler,
  deletePostHandler,
  updatePostHandler,
}