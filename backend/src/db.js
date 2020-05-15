const { Prisma } = require('prisma-binding')

const db = require('./generated/prisma-client/')

console.log('db')
console.log(db)

module.exports = db 