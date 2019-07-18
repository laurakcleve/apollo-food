const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    items: [Item]!
    item(id: ID!): Item
    inventoryItems: [InventoryItem]!
  }

  type Mutation {
    addItem(name: String!): Item!
    deleteItem(id: ID!): Int
  }

  type Item {
    id: ID!
    name: String!
  }

  type InventoryItem {
    id: ID!
    item: Item!
    add_date: String
    expiration: String
    amount: String
  }
`

module.exports = typeDefs
