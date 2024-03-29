const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    items: [Item]!
    item(id: ID!): Item
    inventoryItems: [InventoryItem]!
    inventoryItem(id: ID!): InventoryItem
    dishes: [Dish]!
    dish(id: ID!): Dish
    categories: [Category]!
    itemLocations: [ItemLocation]!
    dishTags: [DishTag]!
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
      countsAs: String
      category: String
      location: String
    ): InventoryItem!
    updateInventoryItem(
      id: ID!
      addDate: String
      amount: String
      expiration: String
      category: String
      location: String
    ): InventoryItem!
    deleteInventoryItem(id: ID!): Int
    addDish(
      name: String!
      tags: [DishTagInput]!
      ingredientSets: [IngredientSetInput]!
    ): Dish!
    updateDish(
      id: ID!
      name: String!
      tags: [DishTagInput]!
      ingredientSets: [IngredientSetInput]!
    ): Dish!
    deleteDish(id: ID!): Int
    addDishDate(dishID: ID!, date: String!): DishDate!
    deleteDishDate(id: ID!): Int
  }

  type Item {
    id: ID!
    name: String!
    countsAs: [Item]
    default_shelflife: Int
    dishes: [Dish]
    category: Category
  }

  type Category {
    id: ID!
    name: String!
  }

  type InventoryItem {
    id: ID!
    item: Item!
    add_date: String
    expiration: String
    amount: String
    location: ItemLocation
  }

  type ItemLocation {
    id: ID!
    name: String!
  }

  type Dish {
    id: ID!
    name: String!
    ingredientSets: [IngredientSet]
    dates: [DishDate]
    tags: [DishTag]
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

  type DishDate {
    id: ID!
    date: String!
  }

  type DishTag {
    id: ID!
    name: String!
  }

  input DishTagInput {
    id: ID!
    name: String!
  }

  input IngredientSetInput {
    id: ID!
    optional: Boolean!
    ingredients: [IngredientInput]!
  }

  input IngredientInput {
    id: ID!
    item: IngredientItemInput!
  }

  input IngredientItemInput {
    id: ID!
    name: String!
  }
`

module.exports = typeDefs
