import { gql } from 'apollo-boost'

const resolvers = {
  Mutation: {
    sortAndFilterDishes: (
      _,
      { sortBy = 'last date', manual = false },
      { cache }
    ) => {
      const { dishes } = cache.readQuery({ query: DISHES_QUERY })
      const { currentFilters } = cache.readQuery({ query: CURRENT_FILTERS_QUERY })
      const { currentDishSortBy, currentDishSortOrder } = cache.readQuery({
        query: DISH_SORT_QUERY,
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

    setFilteredDishes: (_, __, { cache }) => {
      const { dishes } = cache.readQuery({ query: DISHES_QUERY })
      const { currentFilters } = cache.readQuery({ query: CURRENT_FILTERS_QUERY })
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
      const data = {
        filteredDishes,
      }

      console.log({ filteredDishes })

      cache.writeQuery({ query: GET_FILTERED_DISHES, data })
      return data.filteredDishes
    },

    addFilter: (_, { filter }, { cache }) => {
      let newFilters
      if (filter === 'all') newFilters = ['all']
      else {
        const { currentFilters } = cache.readQuery({ query: CURRENT_FILTERS_QUERY })
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
      cache.writeQuery({ query: CURRENT_FILTERS_QUERY, data })
      return data.currentFilters
    },

    setSortedFilteredDishes: (_, { sortBy }, { cache }) => {
      const { filteredDishes } = cache.readQuery({ query: GET_FILTERED_DISHES })
      const { currentDishSortBy, currentDishSortOrder } = cache.readQuery({
        query: DISH_SORT_QUERY,
      })

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
      if (currentDishSortBy === sortBy) {
        newSortOrder = currentDishSortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        newSortOrder = 'asc'
      }

      const sortedFilteredDishes = innerSort(filteredDishes, newSortOrder)

      console.log({ currentDishSortBy, sortBy, currentDishSortOrder, newSortOrder })
      console.log({ sortedFilteredDishes })
      cache.writeData({
        data: { currentDishSortBy: sortBy, currentDishSortOrder: newSortOrder },
      })

      const data = {
        sortedFilteredDishes,
      }
      cache.writeQuery({ query: GET_SORTED_FILTERED_DISHES, data })
    },
  },
}

const DISHES_QUERY = gql`
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

const SORTED_FILTERED_DISHES_QUERY = gql`
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

const GET_FILTERED_DISHES = gql`
  query filteredDishes {
    filteredDishes @client {
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

const GET_SORTED_FILTERED_DISHES = gql`
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
const CURRENT_FILTERS_QUERY = gql`
  query currentFiltersQuery {
    currentFilters @client
  }
`

const DISH_SORT_QUERY = gql`
  query dishSortQuery {
    currentDishSortBy @client
    currentDishSortOrder @client
  }
`

export default resolvers
