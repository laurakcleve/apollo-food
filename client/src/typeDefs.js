import { gql } from 'apollo-boost'

const typeDefs = gql`
  extend type Query {
    sortedFilteredDishes: [Dish]!
    currentDishFilters: [String]!
    currentDishSortBy: String!
    currentDishSortOrder: String!
    sortedFilteredInventoryItems: [InventoryItem]!
    currentInventoryFilter: String!
  }

  extend type Mutation {
    sortAndFilterDishes(sortBy: String): [Dish]!
    addFilter: [String]!
    sortAndFilterInventoryItems: [InventoryItem]!
  }
`
export default typeDefs
