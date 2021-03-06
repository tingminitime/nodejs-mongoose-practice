const { HEADERS } = require('../config')

const errorHandler = (res, statusCode, message = 'error', validationResult = {}) => {
  res.writeHead(statusCode, HEADERS)
  res.write(JSON.stringify({
    success: false,
    message,
    validationResult,
  }))
  res.end()
}

const successHandler = (res, data = [], message = 'success') => {
  res.writeHead(200, HEADERS)
  res.write(JSON.stringify({
    data,
    success: true,
    message,
  }))
  res.end()
}

const schemaErrorHandler = (errors) => {
  if (!errors) return
  let result = {}
  for (const [key, value] of Object.entries(errors)) {
    result[key] = value.message || 'error'
  }
  return result
}

module.exports = {
  errorHandler,
  successHandler,
  schemaErrorHandler,
}