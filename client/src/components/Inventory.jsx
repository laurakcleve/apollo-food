import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Query, Mutation, withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'
import styled from 'styled-components'
import moment from 'moment'

import InventoryListItem from './InventoryListItem'
import ItemInput from './ItemInput'

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

const InventoryItemList = styled.div`
  width: 600px;

  .column {
    padding: 5px;

    &--name {
      flex: 1;
    }

    &--amount,
    &--add-date,
    &--expiration {
      min-width: 90px;
    }

    &--delete {
      width: 70px;
    }
  }
`

const Inventory = ({ client }) => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemAddDate, setNewItemAddDate] = useState(moment().format('M/D/YY'))
  const [newItemAmount, setNewItemAmount] = useState('')

  const submitInventoryItem = (addInventoryItem, event) => {
    event.preventDefault()
    if (newItemName) addInventoryItem()
  }

  const sort = (items) => {
    const sortedItems = [].concat(items)
    sortedItems.sort((a, b) => {
      if (a.item.name < b.item.name) return -1
      if (a.item.name > b.item.name) return 1
      return 0
    })
    client.writeQuery({
      query: INVENTORY_ITEMS_QUERY,
      data: {
        inventoryItems: sortedItems,
      },
    })
  }

  return (
    <>
      <Query query={INVENTORY_ITEMS_QUERY} fetchPolicy="network-only">
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          sort(data.inventoryItems)

          return (
            <div>
              <h1>Inventory</h1>
              <Link to="/">Home</Link>
              <InventoryItemList>
                <div style={{ display: 'flex' }}>
                  <div
                    className="column column--name"
                    onClick={() => sort(data.inventoryItems)}
                  >
                    Name
                  </div>
                  <div className="column column--amount">Amount</div>
                  <div className="column column--add-date">Add Date</div>
                  <div className="column column--expiration">Expiration</div>
                  <div className="column column--delete" />
                </div>
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
    </>
  )
}

export default withApollo(Inventory)
