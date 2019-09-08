import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

import FormEdit from './FormEdit'

const Details = ({ inventoryItem, INVENTORY_ITEMS_QUERY, setIsSorted }) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <StyledDetails>
      <p>Added: {moment(Number(inventoryItem.add_date)).format('M/D/YY')}</p>

      {inventoryItem.item.countsAs.length > 0 && (
        <>
          <p>
            Counts as:{' '}
            {inventoryItem.item.countsAs.map((genericItem) => (
              <span key={genericItem.id}>{genericItem.name}</span>
            ))}
          </p>
        </>
      )}

      {inventoryItem.amount && (
        <>
          <p>Amount: {inventoryItem.amount}</p>
        </>
      )}

      {inventoryItem.item.dishes.length > 0 && (
        <>
          <p>
            Used In:{' '}
            {inventoryItem.item.dishes.map((dish, index) => (
              <span key={dish.id}>
                {dish.name}
                {index < inventoryItem.item.dishes.length - 1 && ', '}
              </span>
            ))}
          </p>
        </>
      )}

      {inventoryItem.item.category && (
        <>
          <p>Category: {inventoryItem.item.category.name}</p>
        </>
      )}

      {inventoryItem.location && <p>Location: {inventoryItem.location.name}</p>}

      <button type="button" onClick={() => setIsEditing(true)}>
        Edit
      </button>

      {isEditing && (
        <FormEdit
          inventoryItem={inventoryItem}
          setIsEditing={setIsEditing}
          INVENTORY_ITEMS_QUERY={INVENTORY_ITEMS_QUERY}
          setIsSorted={setIsSorted}
        />
      )}
    </StyledDetails>
  )
}

const StyledDetails = styled.div`
  padding: 0 20px;
  border: 1px solid #ccc;
`

Details.propTypes = {
  inventoryItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    add_date: PropTypes.string,
    amount: PropTypes.string,
    expiration: PropTypes.string,
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      countsAs: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
      category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
      dishes: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
    }),
    location: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  INVENTORY_ITEMS_QUERY: PropTypes.shape({}).isRequired,
  setIsSorted: PropTypes.func.isRequired,
}

export default Details
