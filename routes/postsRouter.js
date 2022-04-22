const url = require('url')
const isRouteError = require('../helper/checkRouteError')
const { PATH, httpStatusCode: statusCode } = require('../config')
const { errorHandler, successHandler } = require('../helper/responseHandler')
const { getRequestBody } = require('../helper/utils')
const {
  getPostsHandler,
  addNewPostHandler,
  deletePostHandler,
  updatePostHandler,
} = require('../controllers/postsController')

const postsRouter = async (req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  const splitUrl = req.url.split('/').filter(e => e)
  const urlParser = {
    pathname,
    query,
    splitUrl
  }
  console.log('url parser: ', urlParser)

  // 初步檢查路徑
  if (isRouteError(req, PATH)) {
    errorHandler(res, statusCode.BAD_REQUEST, '請求路徑錯誤')
  }

  // 帶 body 的 request
  let reqData = null
  try {
    const body = await getRequestBody(req)
    if (body) reqData = JSON.parse(body)
    console.log('reqData: ', reqData)
  } catch (error) {
    errorHandler(res, statusCode.BAD_REQUEST, '欄位未填寫正確')
    return
  }

  switch (req.method) {
    case 'GET':
      getPostsHandler(res, urlParser)
      break

    case 'POST':
      addNewPostHandler(res, reqData)
      break

    case 'DELETE':
      deletePostHandler(res, urlParser)
      break

    case 'PATCH':
      updatePostHandler(res, urlParser, reqData)
      break

    case 'OPTIONS':
      successHandler(res)
      break

    default:
      errorHandler(res, statusCode.NOT_FOUND, '請求方法錯誤')
      break
  }

}

module.exports = postsRouter