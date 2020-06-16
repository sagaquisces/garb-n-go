function items(parent, args, ctx, info) {
  return ctx.prisma.order({ id: parent.id }).items()
}

function user(parent, args, ctx, info) {
  return ctx.prisma.order({ id: parent.id }).user()
}

module.exports = {
  items,
  user,
}