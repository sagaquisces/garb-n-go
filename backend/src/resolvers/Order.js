async function items(parent, args, ctx, info) {

  const items = await ctx.prisma.order({ id: parent.id }).items()

  return items
}

module.exports = {
  items,
}