import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { withApollo } from 'react-apollo'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import FormAdd from './FormAdd'
import DishListItem from './DishListItem'

const Dishes = ({ client }) => {
  const [selectedDishID, setSelectedDishID] = useState(null)
  const [currentSortBy, setCurrentSortBy] = useState('last date')
  const [currentSortOrder, setCurrentSortOrder] = useState('desc')
  const { loading, error, data } = useQuery(DISHES_QUERY)

  const innerSort = (items, sortBy, sortOrder) => {
    const sortedItems = [].concat(items)

    if (sortBy === 'name') {
      sortedItems.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
    } else if (sortBy === 'last date') {
      sortedItems.sort((a, b) => {
        if (Number(a.dates[0].date) < Number(b.dates[0].date)) return -1
        if (Number(a.dates[0].date) > Number(b.dates[0].date)) return 1
        return 0
      })
    }

    if (sortOrder === 'desc') sortedItems.reverse()

    return sortedItems
  }

  const sort = (sortBy) => {
    let newSortOrder
    if (currentSortBy === sortBy) {
      newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      newSortOrder = 'asc'
    }

    const sortedDishes = innerSort(data.dishes, sortBy, newSortOrder)

    setCurrentSortBy(sortBy)
    setCurrentSortOrder(newSortOrder)

    client.writeQuery({
      query: DISHES_QUERY,
      data: {
        dishes: sortedDishes,
      },
    })
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>

  return (
    <StyledDishes>
      <h1>Dishes</h1>
      <DishList>
        <div style={{ display: 'flex' }}>
          <div
            role="button"
            tabIndex="-1"
            className="column column--name"
            onClick={() => sort('name')}
          >
            Name
          </div>
          <div
            role="button"
            tabIndex="-1"
            className="column column--last-date"
            onClick={() => sort('last date')}
          >
            Last Date
          </div>
        </div>
        {data.dishes.map((dish) => (
          <DishListItem
            key={dish.id}
            dish={dish}
            DISHES_QUERY={DISHES_QUERY}
            selectedDishID={selectedDishID}
            setSelectedDishID={setSelectedDishID}
          />
        ))}
      </DishList>
      <FormAdd DISHES_QUERY={DISHES_QUERY} />
    </StyledDishes>
  )
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

const StyledDishes = styled.div`
  max-width: ${({ theme }) => theme.containerWidth};
  margin: 0 auto;
`

const DishList = styled.div`
  width: 700px;

  .column {
    &--name {
      flex: 1;
    }

    &--last-date {
      flex: 1;
    }
  }
`

Dishes.propTypes = {
  client: PropTypes.shape({
    readQuery: PropTypes.func.isRequired,
    writeQuery: PropTypes.func.isRequired,
  }).isRequired,
}

export default withApollo(Dishes)
