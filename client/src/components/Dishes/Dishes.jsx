import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import styled from 'styled-components'

import FormAdd from './FormAdd'
import DishListItem from './DishListItem'

const Dishes = () => {
  const [selectedDishID, setSelectedDishID] = useState(null)

  return (
    <StyledDishes>
      <h1>Dishes</h1>
      <Query query={DISHES_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          return (
            <DishList>
              <div>
                {data.dishes.map((dish) => (
                  <DishListItem
                    key={dish.id}
                    dish={dish}
                    selectedDishID={selectedDishID}
                    setSelectedDishID={setSelectedDishID}
                  />
                ))}
              </div>
            </DishList>
          )
        }}
      </Query>

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
        ingredients {
          id
          item {
            id
            name
          }
        }
      }
    }
  }
`

const StyledDishes = styled.div`
  max-width: ${({ theme }) => theme.containerWidth};
  margin: 0 auto;
`

const DishList = styled.div`
  width: 600px;
`

export default Dishes
