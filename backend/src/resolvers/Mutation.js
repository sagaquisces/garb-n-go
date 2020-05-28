const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function createItem(parent, args, ctx) {
  // todo: Check if logged in

  const item = await ctx.prisma.createItem({...args})

  return item
}

function updateItem(parent, args, ctx, info) {
  // copy the update
  const updates = { ...args }
  // remove id from update
  delete updates.id
  return ctx.prisma.updateItem({
    data: updates,
    where: {
      id: args.id
    }
  })
}

async function deleteItem(parent, args, ctx, info) {
  console.log("in deleteItemResolver")
  const where = { id: args.id }
  console.log(args.id)
  // find the item
  const item = await ctx.prisma.item({id: args.id})
  console.log("ITEM:")
  console.log(item)
  // check if the user has persmissions
  // TODO
  // Delete it!
  return ctx.prisma.deleteItem({id: item.id})
}
async function signup(parent, args, ctx, info) {
  args.email = args.email.toLowerCase()
  // hash the password
  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.prisma.createUser({
    
    ...args,
    password,
    permissions: { set: ['USER']}
    
  }, info)
  // create jwt
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  // set jwt as a cookie on response
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
  // return user
  return user
}
async function signin(parent, { email, password }, ctx, info) {
  // check if there is a user with that email
  const user = await ctx.prisma.user({email})
  if(!user) {
    throw new Error(`No such user found for email ${email}`)
  }
  // check if their password is right
  const valid = await bcrypt.compare(password, user.password)
  if(!valid) {
    throw new Error(`Invalid Password!`)
  }
  // generate jwt
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  // set cookie with token
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
  // return user
  return user
}
async function signout(parent, args, ctx, info) {
  ctx.response.clearCookie('token')
  return { message: 'Goodbye!'}
}

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  signup,
  signin,
  signout,
}