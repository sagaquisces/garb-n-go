function item(parent, args, ctx, info) {
  return ctx.prisma.cartItem({id: parent.id}).item()
}

function user(parent, args, ctx, info) {
  return ctx.prisma.cartItem({id: parent.id}).user()
}

module.exports = {
  item,
  user,
}