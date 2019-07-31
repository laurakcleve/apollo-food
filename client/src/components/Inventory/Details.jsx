import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

const Details = ({ inventoryItem }) => {
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
}

export default Details
