async function items(parent, args, ctx) {
  const items = await ctx.prisma.items()
  return items
}

async function item(parent, args, ctx) {
  const item = await ctx.prisma.item(args)
  return item
}

module.exports = {
  items,
  item
}