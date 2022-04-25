const http = require('http')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const postsRouter = require('./routes/postsRouter')

dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || '8080'

let mongoDB = process.env.DATABASE_DEV
// MongoDB 連線設定
if (process.env.NODE_ENV === 'production') {
  mongoDB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  )
}

const options = {
  serverSelectionTimeoutMS: 5000,
}

mongoose.connect(mongoDB, options)
  .then(() => console.log('資料庫連線成功'))
  .catch(error => console.error(error))

const server = http.createServer(postsRouter)
server.listen(PORT, console.log(`Server is running at PORT ${PORT} ...`))