import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import FormAddDate from './FormAddDate'
import FormEdit from './FormEdit'

import {
  DISHES_QUERY,
  SORTED_FILTERED_DISHES_QUERY,
  SORT_AND_FILTER_DISHES_MUTATION,
} from '../../queries'

const Details = ({ dish }) => {
  const [isEditing, setIsEditing] = useState(false)

  const [sortAndFilterDishes] = useMutation(SORT_AND_FILTER_DISHES_MUTATION)
  const [deleteDish] = useMutation(DELETE_DISH_MUTATION, {
    refetchQueries: [
      { query: SORTED_FILTERED_DISHES_QUERY },
      { query: DISHES_QUERY },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => sortAndFilterDishes(),
  })
  const [deleteDishDate] = useMutation(DELETE_DISH_DATE_MUTATION, {
    refetchQueries: [
      { query: SORTED_FILTERED_DISHES_QUERY },
      { query: DISHES_QUERY },
    ],
  })

  return (
    <StyledDetails>
      <div className="row">
        <Tags>
          {dish.tags && dish.tags.map((tag) => <p key={tag.id}>{tag.name}</p>)}
        </Tags>
        <Ingredients>
          {dish.ingredientSets.map((ingredientSet) => (
            <p key={ingredientSet.id}>
              {ingredientSet.ingredients.map((ingredient, index) => (
                <span key={ingredient.id}>
                  {ingredient.item.name}{' '}
                  {index === ingredientSet.ingredients.length - 1 ? '' : '/'}{' '}
                  {ingredientSet.optional && ' (optional)'}
                </span>
              ))}
            </p>
          ))}
        </Ingredients>
        <Dates>
          <h3>History</h3>
          {dish.dates.map((date) => (
            <p key={date.id}>
              {moment(Number(date.date)).format('M/D/YY')}
              <button
                type="button"
                onClick={() => deleteDishDate({ variables: { id: date.id } })}
              >
                X
              </button>
            </p>
          ))}
          <FormAddDate
            dishID={dish.id}
            DISHES_QUERY={SORTED_FILTERED_DISHES_QUERY}
          />
        </Dates>
        <Actions>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <br />
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this dish?'))
                deleteDish({ variables: { id: dish.id } })
            }}
          >
            Delete
          </button>
        </Actions>
      </div>
      {isEditing && <FormEdit setIsEditing={setIsEditing} dish={dish} />}
    </StyledDetails>
  )
}

const DELETE_DISH_MUTATION = gql`
  mutation deleteDish($id: ID!) {
    deleteDish(id: $id)
  }
`

const DELETE_DISH_DATE_MUTATION = gql`
  mutation deleteDishDate($id: ID!) {
    deleteDishDate(id: $id)
  }
`
const StyledDetails = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  .row {
    display: flex;
  }
`

const Tags = styled.div`
  flex-grow: 1;
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
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
}

export default Details
