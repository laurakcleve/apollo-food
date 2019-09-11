import { gql } from 'apollo-boost'

import {
  DISHES_QUERY,
  SORTED_FILTERED_DISHES_QUERY,
  CURRENT_DISH_FILTERS_QUERY,
  INVENTORY_ITEMS_QUERY,
  SORTED_FILTERED_INVENTORY_ITEMS_QUERY,
  CURRENT_INVENTORY_FILTER_QUERY,
} from './queries'

const resolvers = {
  Mutation: {
    sortAndFilterDishes: (
      _,
      { sortBy = 'last date', manual = false },
      { cache }
    ) => {
      const { dishes } = cache.readQuery({ query: DISHES_QUERY })
      const { currentFilters } = cache.readQuery({
        query: CURRENT_DISH_FILTERS_QUERY,
      })
      const { currentDishSortBy, currentDishSortOrder } = cache.readQuery({
        query: CURRENT_DISH_SORT_QUERY,
      })

      let filteredDishes = dishes

      if (!currentFilters.includes('all')) {
        filteredDishes = dishes.filter((dish) => {
          let tagFound = false
          dish.tags.forEach((tag) => {
            if (currentFilters.includes(tag.name)) tagFound = true
          })
          return tagFound
        })
      }

      const innerSort = (items, sortOrder) => {
        const sortedItems = [].concat(items)

        if (sortBy === 'name') {
          sortedItems.sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
          })
        } else if (sortBy === 'last date') {
          sortedItems.sort((a, b) => {
            if (a.dates.length <= 0) return -1
            if (b.dates.length <= 0) return 1
            if (Number(a.dates[0].date) < Number(b.dates[0].date)) return -1
            if (Number(a.dates[0].date) > Number(b.dates[0].date)) return 1
            return 0
          })
        }

        if (sortOrder === 'desc') sortedItems.reverse()

        return sortedItems
      }

      let newSortOrder
      if (manual && currentDishSortBy === sortBy) {
        newSortOrder = currentDishSortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        newSortOrder = 'asc'
      }

      const sortedFilteredDishes = innerSort(filteredDishes, newSortOrder)

      cache.writeData({
        data: { currentDishSortBy: sortBy, currentDishSortOrder: newSortOrder },
      })

      const data = {
        sortedFilteredDishes,
      }
      cache.writeQuery({ query: SORTED_FILTERED_DISHES_QUERY, data })
    },

    addFilter: (_, { filter }, { cache }) => {
      let newFilters
      if (filter === 'all') newFilters = ['all']
      else {
        const { currentFilters } = cache.readQuery({
          query: CURRENT_DISH_FILTERS_QUERY,
        })
        newFilters = [...currentFilters]
        if (newFilters.includes('all'))
          newFilters.splice(newFilters.indexOf('all'), 1)
        if (newFilters.includes(filter)) {
          newFilters.splice(newFilters.indexOf(filter), 1)
        } else {
          newFilters.push(filter)
        }
      }
      const data = {
        currentFilters: newFilters,
      }
      cache.writeQuery({ query: CURRENT_DISH_FILTERS_QUERY, data })
      return data.currentFilters
    },

    sortAndFilterInventoryItems: (
      _,
      { sortBy = 'expiration', manual = false },
      { cache }
    ) => {
      const { inventoryItems } = cache.readQuery({ query: INVENTORY_ITEMS_QUERY })
      const { currentInventorySortBy, currentInventorySortOrder } = cache.readQuery({
        query: CURRENT_INVENTORY_SORT_QUERY,
      })
      const { currentInventoryFilter } = cache.readQuery({
        query: CURRENT_INVENTORY_FILTER_QUERY,
      })

      const filteredInventoryItems =
        currentInventoryFilter === 'all'
          ? inventoryItems
          : inventoryItems.filter(
              (item) =>
                item.location && item.location.name === currentInventoryFilter
            )

      const innerSort = (items, sortOrder) => {
        const sortedItems = [].concat(items)

        if (sortBy === 'name') {
          sortedItems.sort((a, b) => {
            if (a.item.name < b.item.name) return -1
            if (a.item.name > b.item.name) return 1
            return 0
          })
        } else if (sortBy === 'expiration') {
          sortedItems.sort((a, b) => {
            if (!a.expiration) return 1
            if (!b.expiration) return -1
            if (Number(a.expiration) < Number(b.expiration)) return -1
            if (Number(a.expiration) > Number(b.expiration)) return 1
            return 0
          })
        }

        if (sortOrder === 'desc') sortedItems.reverse()

        return sortedItems
      }

      let newSortOrder
      if (manual && currentInventorySortBy === sortBy) {
        newSortOrder = currentInventorySortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        newSortOrder = 'asc'
      }

      const sortedFilteredInventoryItems = innerSort(
        filteredInventoryItems,
        newSortOrder
      )

      cache.writeData({
        data: {
          currentInventorySortBy: sortBy,
          currentInventorySortOrder: newSortOrder,
        },
      })

      const data = { sortedFilteredInventoryItems }
      cache.writeQuery({ query: SORTED_FILTERED_INVENTORY_ITEMS_QUERY, data })
    },
  },
}

const CURRENT_DISH_SORT_QUERY = gql`
  query dishSortQuery {
    currentDishSortBy @client
    currentDishSortOrder @client
  }
`

const CURRENT_INVENTORY_SORT_QUERY = gql`
  query currentInventorySortQuery {
    currentInventorySortBy @client
    currentInventorySortOrder @client
  }
`

export default resolvers
