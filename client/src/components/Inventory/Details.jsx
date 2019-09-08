import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

import FormEdit from './FormEdit'

const Details = ({ inventoryItem, INVENTORY_ITEMS_QUERY, setIsSorted }) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <StyledDetails>
      <p>Added</p>
      <p>{moment(Number(inventoryItem.add_date)).format('M/D/YY')}</p>

      {inventoryItem.item.countsAs.length > 0 && (
        <>
          <p>Counts as</p>
          {inventoryItem.item.countsAs.map((genericItem) => (
            <p key={genericItem.id}>{genericItem.name}</p>
          ))}
        </>
      )}

      {inventoryItem.amount && (
        <>
          <p>Amount</p>
          <p>{inventoryItem.amount}</p>
        </>
      )}

      {inventoryItem.item.dishes.length > 0 && (
        <>
          <p>Used In</p>
          {inventoryItem.item.dishes.map((dish) => (
            <p key={dish.id}>{dish.name}</p>
          ))}
        </>
      )}

      {inventoryItem.item.category && (
        <>
          <p>Category</p>
          <p>{inventoryItem.item.category.name}</p>
        </>
      )}

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
  }).isRequired,
  INVENTORY_ITEMS_QUERY: PropTypes.shape({}).isRequired,
  setIsSorted: PropTypes.func.isRequired,
}

export default Details
