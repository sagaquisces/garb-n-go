async function items(parent, args, ctx) {
  const items = await ctx.prisma.items(args)
  return items
}

async function item(parent, args, ctx) {
  const item = await ctx.prisma.item(args)
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

module.exports = {
  items,
  item,
  itemsConnection
}