import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { withApollo } from 'react-apollo'
import styled from 'styled-components'

import Sidebar from './Sidebar'
import FormAdd from './FormAdd'
import DishListItem from './DishListItem'

const Dishes = () => {
  const [selectedDishID, setSelectedDishID] = useState(null)

  const { data: sortedData } = useQuery(SORTED_FILTERED_DISHES_QUERY)
  const { data: dishesData } = useQuery(DISHES_QUERY, {
    onCompleted: () => {
      if (sortedData && !sortedData.sortedFilteredDishes.length) {
        sortAndFilterDishes()
      }
    },
  })

  const [sortAndFilterDishes] = useMutation(SORT_AND_FILTER_DISHES_MUTATION)

  return (
    <StyledDishes>
      <h1>Dishes</h1>
      <div className="container">
        <Sidebar sortAndFilterDishes={sortAndFilterDishes} />
        <div className="content">
          <DishList>
            <div style={{ display: 'flex' }}>
              <div
                role="button"
                tabIndex="-1"
                className="column column--name"
                onClick={() =>
                  sortAndFilterDishes({
                    variables: { sortBy: 'name', manual: true },
                  })
                }
              >
                Name
              </div>
              <div
                role="button"
                tabIndex="-1"
                className="column column--last-date"
                onClick={() =>
                  sortAndFilterDishes({
                    variables: { sortBy: 'last date', manual: true },
                  })
                }
              >
                Last Date
              </div>
            </div>
            {sortedData &&
              sortedData.sortedFilteredDishes &&
              sortedData.sortedFilteredDishes.map((dish) => (
                <DishListItem
                  key={dish.id}
                  dish={dish}
                  SORTED_FILTERED_DISHES_QUERY={SORTED_FILTERED_DISHES_QUERY}
                  selectedDishID={selectedDishID}
                  setSelectedDishID={setSelectedDishID}
                />
              ))}
          </DishList>
          <FormAdd SORTED_FILTERED_DISHES_QUERY={SORTED_FILTERED_DISHES_QUERY} />
        </div>
      </div>
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

const SORT_AND_FILTER_DISHES_MUTATION = gql`
  mutation sortAndFilterDishes($sortBy: String, $manual: Boolean) {
    sortAndFilterDishes(sortBy: $sortBy, manual: $manual) @client
  }
`

const StyledDishes = styled.div`
  max-width: ${({ theme }) => theme.containerWidth};
  margin: 0 auto;

  .container {
    display: flex;
  }
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

export default withApollo(Dishes)
