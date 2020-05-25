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
  }, info)
}

module.exports = {
  createItem,
  updateItem
}