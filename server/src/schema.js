const typeDefs = `
  type Query {
    items: [Item]!
    item(id: ID!): Item
  }
  
  type Mutation {
    addItem(name: String!): Item!
    deleteItem(id: ID!): Int
  }

  type Item {
    id: ID!
    name: String!
  }
`

module.exports = typeDefs
