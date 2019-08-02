const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    items: [Item]!
    item(id: ID!): Item
    inventoryItems: [InventoryItem]!
    inventoryItem(id: ID!): InventoryItem
  }

  type Mutation {
    addItem(name: String!): Item!
    deleteItem(id: ID!): Int
    addInventoryItem(
      name: String!
      addDate: String
      amount: String
      expiration: String
      defaultShelflife: Int
    ): InventoryItem!
    updateInventoryItem(
      id: ID!
      addDate: String
      amount: String
      expiration: String
    ): InventoryItem!
    deleteInventoryItem(id: ID!): Int
  }

  type Item {
    id: ID!
    name: String!
    countsAs: [Item]
    default_shelflife: Int
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
