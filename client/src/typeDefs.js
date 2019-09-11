import { gql } from 'apollo-boost'

const typeDefs = gql`
  extend type Query {
    sortedFilteredDishes: [Dish]!
    currentFilters: [String]!
    currentDishSortBy: String!
    currentDishSortOrder: String!
  }

  extend type Mutation {
    sortAndFilterDishes(sortBy: String): [Dish]!
    addFilter: [String]!
  }
`
export default typeDefs
