import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

import InventoryEditForm from './InventoryEditForm'

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

      <button type="button" onClick={() => setIsEditing(true)}>
        Edit
      </button>

      {isEditing && (
        <InventoryEditForm
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
    }),
  }).isRequired,
  INVENTORY_ITEMS_QUERY: PropTypes.shape({}).isRequired,
  setIsSorted: PropTypes.func.isRequired,
}

export default Details
