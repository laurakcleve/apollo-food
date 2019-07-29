import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

const Details = ({ inventoryItem }) => {
  return (
    <StyledDetails>
      <p>Added</p>
      <p>{moment(Number(inventoryItem.add_date)).format('M/D/YY')}</p>
    </StyledDetails>
  )
}

const StyledDetails = styled.div`
  border: 1px solid #ccc;
`

export default Details
