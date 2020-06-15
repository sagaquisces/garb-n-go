const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const Item = require('./resolvers/Item')
const User = require('./resolvers/User')
const CartItem = require('./resolvers/CartItem')
const Order = require('./resolvers/Order')
const db = require('./db')

// create graphql yoga server
function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query,
      Item,
      User,
      CartItem,
      Order,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({
       ...req, 
       prisma
    })
  })
}

module.exports=createServer