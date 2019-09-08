import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

import FormEdit from './FormEdit'

const Details = ({ inventoryItem, INVENTORY_ITEMS_QUERY, setIsSorted }) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <StyledDetails>
      <Row>
        <Detail>
          <DetailTitle>Added</DetailTitle>
          <DetailText>
            {moment(Number(inventoryItem.add_date)).format('M/D/YY')}
          </DetailText>
        </Detail>

        {inventoryItem.item.countsAs.length > 0 && (
          <Detail>
            <DetailTitle>Counts as</DetailTitle>
            <DetailText>
              {inventoryItem.item.countsAs.map((genericItem) => (
                <span key={genericItem.id}>{genericItem.name}</span>
              ))}
            </DetailText>
          </Detail>
        )}

        {inventoryItem.amount && (
          <Detail>
            <DetailTitle>Amount</DetailTitle>
            <DetailText>{inventoryItem.amount}</DetailText>
          </Detail>
        )}

        {inventoryItem.item.dishes.length > 0 && (
          <Detail>
            <DetailTitle>Used In</DetailTitle>
            <DetailText>
              {inventoryItem.item.dishes.map((dish, index) => (
                <span key={dish.id}>
                  {dish.name}
                  {index < inventoryItem.item.dishes.length - 1 && ', '}
                </span>
              ))}
            </DetailText>
          </Detail>
        )}

        {inventoryItem.item.category && (
          <Detail>
            <DetailTitle>Category</DetailTitle>
            <DetailText>{inventoryItem.item.category.name}</DetailText>
          </Detail>
        )}

        {inventoryItem.location && (
          <Detail>
            <DetailTitle>Location</DetailTitle>
            <DetailText>{inventoryItem.location.name}</DetailText>
          </Detail>
        )}

        <button type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </Row>
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
  padding: 20px;
  border: 1px solid #ccc;
`

const Row = styled.div`
  display: flex;
`

const Detail = styled.div`
  width: 100px;
`

const DetailTitle = styled.div``

const DetailText = styled.div``

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
