import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Details = ({ dish }) => {
  return (
    <StyledDetails>
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
    </StyledDetails>
  )
}

const StyledDetails = styled.div`
  padding: 0 20px;
  border: 1px solid #ccc;
`

Details.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
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
}

export default Details
