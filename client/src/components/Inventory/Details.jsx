import React from 'react'
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
            <p>{genericItem.name}</p>
          ))}
        </>
      )}
    </StyledDetails>
  )
}

const StyledDetails = styled.div`
  border: 1px solid #ccc;
`

export default Details
