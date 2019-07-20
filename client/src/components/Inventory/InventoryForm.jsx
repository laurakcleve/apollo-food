import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import moment from 'moment'
import ItemInput from '../ItemInput'

const INVENTORY_ITEMS_QUERY = gql`
  query inventoryItems {
    inventoryItems {
      id
      item {
        id
        name
      }
      add_date
      expiration
      amount
    }
  }
`

const ADD_INVENTORY_ITEM_MUTATION = gql`
  mutation addInventoryItem($itemName: String!, $itemAddDate: String) {
    addInventoryItem(name: $itemName, addDate: $itemAddDate) {
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

const InventoryForm = () => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemAddDate, setNewItemAddDate] = useState(moment().format('M/D/YY'))
  const [newItemAmount, setNewItemAmount] = useState('')

  const submitInventoryItem = (addInventoryItem, event) => {
    event.preventDefault()
    if (newItemName) addInventoryItem()
  }

  return (
    <form>
      <div>Add an item</div>

      <span>Name</span>
      <ItemInput newItemName={newItemName} setNewItemName={setNewItemName} />

      <label htmlFor="itemAddDate">
        <span>Add date</span>
        <input
          id="itemAddDate"
          type="text"
          value={newItemAddDate}
          onChange={(event) => setNewItemAddDate(event.target.value)}
        />
      </label>

      <label htmlFor="itemAmount">
        <span>Amount</span>
        <input
          type="text"
          value={newItemAmount}
          onChange={(event) => setNewItemAmount(event.target.value)}
        />
      </label>

      <div>
        <Mutation
          mutation={ADD_INVENTORY_ITEM_MUTATION}
          variables={{
            itemName: newItemName,
            itemAddDate: newItemAddDate,
            itemAmount: newItemAmount,
          }}
          update={(cache, { data: { addInventoryItem } }) => {
            const { inventoryItems } = cache.readQuery({
              query: INVENTORY_ITEMS_QUERY,
            })
            cache.writeQuery({
              query: INVENTORY_ITEMS_QUERY,
              data: { inventoryItems: inventoryItems.concat([addInventoryItem]) },
            })
          }}
          onCompleted={() => setNewItemName('')}
        >
          {(addInventoryItem) => (
            <button
              type="submit"
              onClick={(event) => submitInventoryItem(addInventoryItem, event)}
            >
              Save
            </button>
          )}
        </Mutation>
      </div>
    </form>
  )
}

export default InventoryForm
