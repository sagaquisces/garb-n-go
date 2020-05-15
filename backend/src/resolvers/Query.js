async function items(parent, args, ctx) {
  const items = await ctx.prisma.items()
  return items
}

module.exports = {
  items
}