const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    items: [Item]!
    item(id: ID!): Item
    inventoryItems: [InventoryItem]!
    inventoryItem(id: ID!): InventoryItem
    dishes: [Dish]!
    dish(id: ID!): Dish
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
    addDish(name: String!, ingredientSets: IngredientSetsInput): Dish!
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

  type Dish {
    id: ID!
    name: String!
    ingredientSets: [IngredientSet]
  }

  type IngredientSet {
    id: ID!
    ingredients: [Ingredient]
    optional: Boolean
  }

  type Ingredient {
    id: ID!
    item: Item!
  }

  input IngredientSetsInput {
    ingredientSets: [IngredientSetInput]!
  }

  input IngredientSetInput {
    id: ID!
    items: [IngredientInput]!
  }

  input IngredientInput {
    id: ID!
    name: String!
  }
`

module.exports = typeDefs
