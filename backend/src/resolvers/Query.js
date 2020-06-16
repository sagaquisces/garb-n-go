const { forwardTo } = require('prisma-binding')
const { hasPermissions } = require('../utils')

async function items(parent, args, ctx, info) {
  const items = await ctx.prisma.items(args, info)

  return items
}

async function item(parent, args, ctx, info) {

  const item = await ctx.prisma.item(args, info)
  return item
}

async function itemsConnection(parent, args, ctx) {

  const itemsConnection = await ctx.prisma.itemsConnection(args)
  // don't know why aggregate property is not on object. will just manually add count
  const newItemsConnection = {
    ...itemsConnection,
    aggregate: {
      count: itemsConnection.edges.length
    }
  }

  return newItemsConnection
}

async function me(parent, args, ctx, info) {

  if(!ctx.request.userId) {
    return null
  }
  const user = await ctx.prisma.user({id: ctx.request.userId}, info)

  return user
}

async function users(parent, args, ctx, info) {
  // // Logged in?
  if(!ctx.request.userId) {
    throw new Error('You must be logged in.')
  }
  // Check if user has persmission to run this query
  hasPermissions(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
  // If so, query all the users
  // console.log("Past hasPermissions")
  // const users = await ctx.prisma.users(args)
  // return users
  const users = await ctx.prisma.users({}, info)

  return users
}

async function order(parent, args, ctx, info) {
  if(!ctx.request.userId) {
    throw new Error('You must be logged in.')
  }

  const order = await ctx.prisma.order(
    {id: args.id},
    info
  )
  console.log("ORDER from order resolver")
  console.log(order)

  const orderUser = await ctx.prisma.order({id: order.id}).user()

  console.log("ORDER USER")
  console.log(orderUser)
  const ownsOrder = orderUser.id === ctx.request.userId

  const hasPersmissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN')
  if (!ownsOrder && !hasPersmissionToSeeOrder) {
    throw new Error("You can't see this order")
  }
  return order
}

async function orders(parent, args, ctx, info) {
  const { userId } = ctx.request
  if(!userId) {
    throw new Error('You must be signed in...')
  }
  return ctx.prisma.orders({
    where: {
      user: { id: userId }
    }
  }, info)
}

module.exports = {
  items,
  item,
  itemsConnection,
  me,
  users,
  order,
  orders,
}