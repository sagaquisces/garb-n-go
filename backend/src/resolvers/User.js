async function cart(parent, args, ctx, info) {

  const cart = await ctx.prisma.user({ id: parent.id }).cart()

  return cart
}

module.exports = {
  cart,
}