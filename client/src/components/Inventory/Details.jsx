import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

import FormEdit from './FormEdit'

const Details = ({ inventoryItem }) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <StyledDetails>
      <Row>
        <Detail>
          <Title>Added</Title>
          <Text>{moment(Number(inventoryItem.add_date)).format('M/D/YY')}</Text>
        </Detail>

        {inventoryItem.item.countsAs.length > 0 && (
          <Detail>
            <Title>Counts as</Title>
            <Text>
              {inventoryItem.item.countsAs.map((genericItem) => (
                <span key={genericItem.id}>{genericItem.name}</span>
              ))}
            </Text>
          </Detail>
        )}

        {inventoryItem.amount && (
          <Detail>
            <Title>Amount</Title>
            <Text>{inventoryItem.amount}</Text>
          </Detail>
        )}

        {inventoryItem.item.dishes.length > 0 && (
          <Detail>
            <Title>Used In</Title>
            <Text>
              {inventoryItem.item.dishes.map((dish, index) => (
                <span key={dish.id}>
                  {dish.name}
                  {index < inventoryItem.item.dishes.length - 1 && ', '}
                </span>
              ))}
            </Text>
          </Detail>
        )}

        {inventoryItem.item.category && (
          <Detail>
            <Title>Category</Title>
            <Text>{inventoryItem.item.category.name}</Text>
          </Detail>
        )}

        {inventoryItem.location && (
          <Detail>
            <Title>Location</Title>
            <Text>{inventoryItem.location.name}</Text>
          </Detail>
        )}

        <button type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </Row>
      {isEditing && (
        <FormEdit inventoryItem={inventoryItem} setIsEditing={setIsEditing} />
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

const Title = styled.div``

const Text = styled.div``

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
}

export default Details
