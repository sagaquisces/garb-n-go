function user(parent, args, ctx) {
  return ctx.prisma.item({ id: parent.id }).user()
}

module.exports = {
  user
}