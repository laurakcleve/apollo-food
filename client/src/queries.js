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

export const SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION = gql`
  mutation sortAndFilterInventoryItems($sortBy: String, $manual: Boolean) {
    sortAndFilterInventoryItems(sortBy: $sortBy, manual: $manual) @client
  }
`

export const CURRENT_DISH_FILTERS_QUERY = gql`
  query currentDishFiltersQuery {
    currentDishFilters @client
  }
`

export const CURRENT_INVENTORY_FILTER_QUERY = gql`
  query currentInventoryFilterQuery {
    currentInventoryFilter @client
  }
`

export const ITEMS_QUERY = gql`
  query items {
    items {
      id
      name
      default_shelflife
      category {
        id
        name
      }
      countsAs {
        id
        name
      }
      dishes {
        id
        name
      }
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

export const INVENTORY_ITEMS_QUERY = gql`
  query inventoryItems {
    inventoryItems {
      id
      item {
        id
        name
        countsAs {
          id
          name
        }
        default_shelflife
        dishes {
          id
          name
        }
        category {
          id
          name
        }
      }
      add_date
      expiration
      amount
      location {
        id
        name
      }
    }
  }
`

export const SORTED_FILTERED_INVENTORY_ITEMS_QUERY = gql`
  query sortedFilteredInventoryItems {
    sortedFilteredInventoryItems @client {
      id
      item {
        id
        name
        countsAs {
          id
          name
        }
        default_shelflife
        dishes {
          id
          name
        }
        category {
          id
          name
        }
      }
      add_date
      expiration
      amount
      location {
        id
        name
      }
    }
  }
`

export const LOCATIONS_QUERY = gql`
  query itemLocations {
    itemLocations {
      id
      name
    }
  }
`

export const CATEGORIES_QUERY = gql`
  query categories {
    categories {
      id
      name
    }
  }
`
