async function createItem(parent, args, ctx) {
  // todo: Check if logged in

  const item = await ctx.prisma.createItem({...args})

  return item
}

module.exports = {
  createItem,
}