const { hasPermissions } = require('../utils')

async function items(parent, args, ctx) {
  const items = await ctx.prisma.items(args)
  console.log("ITEM ARGS+++++")
  console.log(args)
  return items
}

async function item(parent, args, ctx, info) {
  console.log('ITEM ARGS:')
  console.log(args)
  const item = await ctx.prisma.item(args, info)
  return item
}

async function itemsConnection(parent, args, ctx) {
  console.log('getting itemsConnection')
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
  console.log("ARGS==>")
  console.log(args)
  if(!ctx.request.userId) {
    return null
  }
  return ctx.prisma.user({id: ctx.request.userId}, info)
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
  const users = await ctx.prisma.users(args)

  return users
}

module.exports = {
  items,
  item,
  itemsConnection,
  me,
  users,
}