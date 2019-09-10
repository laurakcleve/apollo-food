import { gql } from 'apollo-boost'

const typeDefs = gql`
  extend type Query {
    filteredDishes: [Dish]!
    currentFilters: [String]!
    sortedFilteredDishes: [Dish]!
    currentDishSortBy: String!
    currentDishSortOrder: String!
  }

  extend type Mutation {
    sortAndFilterDishes(sortBy: String): [Dish]!
    setFilteredDishes: [Dish]!
    addFilter: [String]!
    setSortedFilteredDishes(sortBy: String!, manual: Boolean): [Dish]!
  }
`
export default typeDefs
