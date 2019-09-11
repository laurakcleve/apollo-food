import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import styled from 'styled-components'

import Sidebar from './Sidebar'
import FormAdd from './FormAdd'
import DishListItem from './DishListItem'
import {
  DISHES_QUERY,
  SORTED_FILTERED_DISHES_QUERY,
  SORT_AND_FILTER_DISHES_MUTATION,
} from '../../queries'

const Dishes = () => {
  const [selectedDishID, setSelectedDishID] = useState(null)

  const { data: sortedData } = useQuery(SORTED_FILTERED_DISHES_QUERY)
  const { loading: dishesLoading } = useQuery(DISHES_QUERY, {
    onCompleted: () => {
      if (sortedData && !sortedData.sortedFilteredDishes.length) {
        sortAndFilterDishes()
      }
    },
  })

  const [sortAndFilterDishes] = useMutation(SORT_AND_FILTER_DISHES_MUTATION)

  if (dishesLoading) return <p>Loading...</p>

  return (
    <StyledDishes>
      <h1>Dishes</h1>
      <div className="container">
        <Sidebar />
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
                  selectedDishID={selectedDishID}
                  setSelectedDishID={setSelectedDishID}
                />
              ))}
          </DishList>
          <FormAdd />
        </div>
      </div>
    </StyledDishes>
  )
}

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

export default Dishes
