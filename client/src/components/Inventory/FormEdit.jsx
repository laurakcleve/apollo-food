import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import {
  unixTimeToFormatted,
  formattedTimeToPg,
  getExpiration,
  getDaysLeft,
} from '../../utils'

const FormEdit = ({
  inventoryItem,
  setIsEditing,
  INVENTORY_ITEMS_QUERY,
  setIsSorted,
}) => {
  const [amount, setAmount] = useState(inventoryItem.amount)
  const [addDate, setAddDate] = useState(
    unixTimeToFormatted(inventoryItem.add_date) || ''
  )
  const [daysLeft, setDaysLeft] = useState(getDaysLeft(inventoryItem.expiration))

  const [updateInventoryItem] = useMutation(UPDATE_INVENTORY_ITEM_MUTATION, {
    refetchQueries: [
      {
        query: INVENTORY_ITEMS_QUERY,
      },
    ],
    onCompleted: () => {
      setIsEditing(false)
      setIsSorted(false)
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        updateInventoryItem({
          variables: {
            id: inventoryItem.id,
            addDate: formattedTimeToPg(addDate),
            amount,
            expiration: getExpiration(daysLeft),
          },
        })
      }}
    >
      <label htmlFor="amount">
        <span>Amount</span>
        <input
          type="text"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      <br />

      <label htmlFor="addDate">
        <span>Add date</span>
        <input
          type="text"
          value={addDate}
          onChange={(event) => setAddDate(event.target.value)}
        />
      </label>

      <br />

      <label htmlFor="daysLeft">
        <span>Days left</span>
        <input
          type="number"
          value={daysLeft}
          onChange={(event) => setDaysLeft(event.target.value)}
        />
      </label>

      <br />

      <button type="submit">Save</button>
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

FormEdit.propTypes = {
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
  INVENTORY_ITEMS_QUERY: PropTypes.shape({}).isRequired,
  setIsSorted: PropTypes.func.isRequired,
}

export default FormEdit
