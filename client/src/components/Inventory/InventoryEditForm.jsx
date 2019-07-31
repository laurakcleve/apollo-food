import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { unixTimeToPg, unixTimeToFormatted, formattedTimeToPg } from '../../utils'

const InventoryEditForm = ({ inventoryItem, setIsEditing }) => {
  const [amount, setAmount] = useState(inventoryItem.amount)
  const [addDate, setAddDate] = useState(
    unixTimeToFormatted(inventoryItem.add_date) || ''
  )

  const saveInventoryItem = (updateInventoryItem, event) => {
    event.preventDefault()
    updateInventoryItem()
  }

  return (
    <form>
      <label htmlFor="amount">
        <span>Amount</span>
        <input
          type="text"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      <label htmlFor="addDate">
        <span>Add date</span>
        <input
          type="text"
          value={addDate}
          onChange={(event) => setAddDate(event.target.value)}
        />
      </label>

      <Mutation
        mutation={UPDATE_INVENTORY_ITEM_MUTATION}
        variables={{
          id: inventoryItem.id,
          addDate: formattedTimeToPg(addDate),
          amount,
          expiration: unixTimeToPg(inventoryItem.expiration),
        }}
        onCompleted={() => {
          setIsEditing(false)
        }}
      >
        {(updateInventoryItem) => (
          <button
            type="submit"
            onClick={(event) => saveInventoryItem(updateInventoryItem, event)}
          >
            Save
          </button>
        )}
      </Mutation>
    </form>
  )
}

const UPDATE_INVENTORY_ITEM_MUTATION = gql`
  mutation updateInventoryItem(
    $id: ID!
    $addDate: String
    $amount: String
    $expiration: String
  ) {
    updateInventoryItem(
      id: $id
      addDate: $addDate
      amount: $amount
      expiration: $expiration
    ) {
      id
      item {
        id
        name
      }
      add_date
      amount
      expiration
    }
  }
`

InventoryEditForm.propTypes = {
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
  setIsEditing: PropTypes.func.isRequired,
}

export default InventoryEditForm
