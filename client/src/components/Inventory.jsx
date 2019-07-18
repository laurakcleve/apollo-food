import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

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
  mutation addInventoryItem($itemName: String!) {
    addInventoryItem(name: $itemName) {
      id
      item {
        id
        name
      }
    }
  }
`

const Inventory = () => {
  const [newItemName, setNewItemName] = useState('')

  const submitInventoryItem = (addInventoryItem, event) => {
    event.preventDefault()
    addInventoryItem()
  }

  return (
    <>
      <Query query={INVENTORY_ITEMS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          return (
            <div>
              <h1>Inventory</h1>
              <Link to="/">Home</Link>
              <ul>
                {data.inventoryItems.map((inventoryItem) => (
                  <li>
                    <span>{inventoryItem.item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }}
      </Query>

      <form>
        <label htmlFor="itemName">
          <span>Add an item:</span>
          <input
            id="itemName"
            type="text"
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
          />
        </label>

        <Mutation
          mutation={ADD_INVENTORY_ITEM_MUTATION}
          variables={{ itemName: newItemName }}
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
      </form>
    </>
  )
}

export default Inventory
