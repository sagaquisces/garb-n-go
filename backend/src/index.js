const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'variables.env' })
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

server.express.use(cookieParser())

// decode the JWT so we can get user id
server.express.use((req, res, next) => {
  const { token } = req.cookies
  if(token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    // put userId onto the req for future
    req.userId = userId
  }
  next()
})

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, details => {
  console.log(`Server is now running on 4000`)
})