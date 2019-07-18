import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import styled from 'styled-components'
import moment from 'moment'

import InventoryListItem from './InventoryListItem'

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
    }
  }
`

const InventoryItemList = styled.ul`
  max-width: 400px;
  list-style-type: none;
`

const Inventory = () => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemAddDate, setNewItemAddDate] = useState(moment().format('M/D/YY'))

  const submitInventoryItem = (addInventoryItem, event) => {
    event.preventDefault()
    addInventoryItem()
  }

  return (
    <>
      <Query query={INVENTORY_ITEMS_QUERY} fetchPolicy="network-only">
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          return (
            <div>
              <h1>Inventory</h1>
              <Link to="/">Home</Link>
              <InventoryItemList>
                {data.inventoryItems.map((inventoryItem) => (
                  <InventoryListItem
                    key={inventoryItem.id}
                    inventoryItem={inventoryItem}
                    INVENTORY_ITEMS_QUERY={INVENTORY_ITEMS_QUERY}
                  />
                ))}
              </InventoryItemList>
            </div>
          )
        }}
      </Query>

      <form>
        <div>Add an item</div>

        <label htmlFor="itemName">
          <span>Name</span>
          <input
            id="itemName"
            type="text"
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
          />
        </label>

        <label htmlFor="itemAddDate">
          <span>Add date</span>
          <input
            id="itemAddDate"
            type="text"
            value={newItemAddDate}
            onChange={(event) => setNewItemAddDate(event.target.value)}
          />
        </label>

        <div>
          <Mutation
            mutation={ADD_INVENTORY_ITEM_MUTATION}
            variables={{ itemName: newItemName, itemAddDate: newItemAddDate }}
            refetchQueries={[{ query: INVENTORY_ITEMS_QUERY }]}
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
    </>
  )
}

export default Inventory
