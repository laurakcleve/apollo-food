import { gql } from 'apollo-boost'

export const DISHES_QUERY = gql`
  query dishes {
    dishes {
      id
      name
      ingredientSets {
        id
        optional
        ingredients {
          id
          item {
            id
            name
          }
        }
      }
      dates {
        id
        date
      }
      tags {
        id
        name
      }
    }
  }
`

export const SORTED_FILTERED_DISHES_QUERY = gql`
  query sortedFilteredDishes {
    sortedFilteredDishes @client {
      id
      name
      ingredientSets {
        id
        optional
        ingredients {
          id
          item {
            id
            name
          }
        }
      }
      dates {
        id
        date
      }
      tags {
        id
        name
      }
    }
  }
`

export const SORT_AND_FILTER_DISHES_MUTATION = gql`
  mutation sortAndFilterDishes($sortBy: String, $manual: Boolean) {
    sortAndFilterDishes(sortBy: $sortBy, manual: $manual) @client
  }
`

export const CURRENT_FILTERS_QUERY = gql`
  query currentFiltersQuery {
    currentFilters @client
  }
`

export const ITEMS_QUERY = gql`
  query items {
    items {
      id
      name
    }
  }
`

export const DISH_TAGS_QUERY = gql`
  query dishTags {
    dishTags {
      id
      name
    }
  }
`
