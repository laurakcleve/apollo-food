const { ApolloServer } = require('apollo-server')
require('dotenv').config()

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const ItemsAPI = require('./datasources/items')
const InventoryItemsAPI = require('./datasources/inventoryItems')
const DishesAPI = require('./datasources/dishes')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    itemsAPI: new ItemsAPI(),
    inventoryItemsAPI: new InventoryItemsAPI(),
    dishesAPI: new DishesAPI(),
  }),
})

server.listen().then(({ url }) => console.log(`Running on ${url}`))
