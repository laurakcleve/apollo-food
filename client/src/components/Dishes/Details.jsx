import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import FormAddDate from './FormAddDate'

const Details = ({ dish, DISHES_QUERY }) => {
  const [deleteDishDate] = useMutation(DELETE_DISH_DATE_MUTATION, {
    refetchQueries: [
      {
        query: DISHES_QUERY,
      },
    ],
  })

  return (
    <StyledDetails>
      <Ingredients>
        {dish.ingredientSets.map((ingredientSet) => (
          <p key={ingredientSet.id}>
            {ingredientSet.ingredients.map((ingredient, index) => (
              <span key={ingredient.id}>
                {ingredient.item.name}{' '}
                {index === ingredientSet.ingredients.length - 1 ? '' : '/'}{' '}
              </span>
            ))}
          </p>
        ))}
      </Ingredients>
      <Dates>
        <h3>History</h3>
        {dish.dates.map((date) => (
          <p>
            {moment(Number(date.date)).format('M/D/YY')}
            <button
              type="button"
              onClick={() => deleteDishDate({ variables: { id: date.id } })}
            >
              X
            </button>
          </p>
        ))}
        <FormAddDate dishID={dish.id} DISHES_QUERY={DISHES_QUERY} />
      </Dates>
      <Actions>
        <p>(Edit button)</p>
        <p>(Delete button)</p>
      </Actions>
    </StyledDetails>
  )
}

const DELETE_DISH_DATE_MUTATION = gql`
  mutation deleteDishDate($id: ID!) {
    deleteDishDate(id: $id)
  }
`

const StyledDetails = styled.div`
  padding: 0 20px;
  border: 1px solid #ccc;
  display: flex;
`

const Ingredients = styled.div`
  flex-grow: 1;
`

const Dates = styled.div`
  flex-grow: 1;
`

const Actions = styled.div`
  flex-grow: 1;
`

Details.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ),
    ingredientSets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        ingredients: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            item: PropTypes.shape({
              id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
            }).isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  DISHES_QUERY: PropTypes.shape({}).isRequired,
}

export default Details
