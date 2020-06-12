const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')
const { hasPermissions } = require('../utils')

async function createItem(parent, args, ctx, info) {
  // todo: Check if logged in
  if(!ctx.request.userId) {
    throw new Error('You must be logged in to do that')
  }
  // creating a relationship between an item and a user
  const item = await ctx.prisma.createItem({
    user: {
      connect: {
        id: ctx.request.userId
      },
    },
    ...args
  }, info)

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
  // find the item
  const ownerOfItem = await ctx.prisma.item({id: args.id}).user()

  // check if the user has persmissions
  const ownsItem = ownerOfItem.id === ctx.request.userId
  const hasPermissions = ctx.request.user.permissions.some
    (permission => ['ADMIN', 'ITEMDELETE'].includes(permission))

  if(!ownsItem && !hasPermissions) {
    throw new Error("You do not have permission to delete.")
  }
  // Delete it!
  return ctx.prisma.deleteItem({id: args.id})
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
function signout(parent, args, ctx, info) {
  ctx.response.clearCookie('token')
  return { message: 'Goodbye!'}
}
async function requestReset(parent, { email }, ctx, info) {
  // 1. check if real user
  const user = await ctx.prisma.user({ email })
  if(!user) {
    throw new Error(`No such user found for email: ${email}`)
  }
  // 2. set reset token and expiry
  const randomBytesPromisified = promisify(randomBytes)
  const resetToken = (await randomBytesPromisified(20)).toString('hex')
  const resetTokenExpiry = Date.now() + 3600000
  const res = await ctx.prisma.updateUser({
    where: { email },
    data: { resetToken, resetTokenExpiry },
  })
  // 3. email the reset token
  const mailRes = await transport.sendMail({
    from: 'sagaquisces@gmail.com',
    to: user.email,
    subject: 'Your Password Reset',
    html: makeANiceEmail(
      `Your password reset token is here! \n\n <a href='${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}'>Click here to reset.</a>`
    )
  })
  // 4. return the message
  return { message: 'Thanks.'}
}
async function resetPassword(parent, args, ctx, info) {
  // 1. check if passwords match
  if(args.password !== args.confirmPassword) {
    throw new Error('Passwords do not match')
  }
  // 2. check if it's legit
  // 3. check if expired
  const [user] = await ctx.prisma.users({
    where: {
      resetToken: args.resetToken,
      resetTokenExpiry_gte: Date.now() - 3600000,
    },
  })
  if(!user) {
    throw new Error('Token is invalid or expired')
  }
  // 4. Hash the new password
  const password = await bcrypt.hash(args.password, 10)
  // 5. Save new password to the user and remove old resetToken fields
  const updatedUser = await ctx.prisma.updateUser({
    where: { email: user.email },
    data: {
      password,
      resetToken: null,
      resetTokenExpiry: null,
    }
  })
  // 6. Generate JWT
  const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
  // 7. Set JWT cookie
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
  // 8. return new user
  return updatedUser
}

async function updatePermissions(parent, args, ctx, info) {
  // check if logged in
  if(!ctx.request.userId) {
    throw new Error('You must be logged in to update.')
  }
  // query current user
  const currentUser = await ctx.prisma.user({
    id: ctx.request.userId
  }, info)
  // check if permissions to do this
  hasPermissions(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
  // update the permissions
  return ctx.prisma.updateUser({
    data: {
      permissions: {
        set: args.permissions,
      }
    },
    where: {
      id: args.userId
    }
  }, info)
}

async function addToCart(parent, args, ctx, info) {

  // Make sure signed in
  const { userId } = ctx.request;
  if (!userId) {
    throw new Error("You must be signed in to add to cart")
  }

  // Query users current cart
  const [existingCartItem] = await ctx.prisma.cartItems({
    where: {
      user: { id: userId },
      item: { id: args.id },
    },
  })
  console.log("EXISTING CART ITEM")
  console.log(existingCartItem)
  // check if that item is already in the cart and ++
  if(existingCartItem) {
    console.log('This item is already in the cart')
    return ctx.prisma.updateCartItem({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + 1}
    }, info)
  }
  // if not in cart, create new cart item
  return ctx.prisma.createCartItem({
    
      user: {
        connect: { id: userId },
      },
      item: {
        connect: { id: args.id }
      }
    
  }, info)
}

async function removeFromCart(parent, args, ctx, info) {
  // find cart item
  const cartItem = await ctx.prisma.cartItem({
    id: args.id,
  })


  if(!cartItem) throw new Error('No Cart Item Found.')
  // make sure they own the item
  // 
  // if(cartItem.user.id !== ctx.request.userId) {
  //   throw new Error("You don't own this item")
  // }
  // delete the item
  return ctx.prisma.deleteCartItem({ id: args.id }, info)
}

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  signup,
  signin,
  signout,
  requestReset,
  resetPassword,
  updatePermissions,
  addToCart,
  removeFromCart,
}