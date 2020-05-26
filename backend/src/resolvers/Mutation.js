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

module.exports = {
  createItem,
  updateItem,
  deleteItem
}