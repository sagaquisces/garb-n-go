const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'variables.env' })
const createServer = require('./createServer')
const { prisma } = require('./generated/prisma-client')

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

// populate user on each request
server.express.use(async (req, res, next) => {

  // not logged in skip this
  if(!req.userId) return next()

  console.log("Should not get to this point")
  console.log(req.userId)

  const user = await prisma.user(
    { id: req.userId }, 
    '{ id, permissions, email, name }'
  )


  // for some reason not getting what I asked for above,
  // so I need to manually write to an object with the fields
  const strippedUser = {
    id: user.id,
    permissions: user.permissions,
    email: user.email,
    name: user.name
  }

  req.user = user
  next();
})

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  }, 
  details => {
    console.log(`Server is now running on 4000`)
  }
)