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
    }
  }
`

const InventoryItemList = styled.table`
  width: 600px;

  tr {
    display: flex;
  }

  td {
  }
`

const Inventory = ({ client }) => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemAddDate, setNewItemAddDate] = useState(moment().format('M/D/YY'))

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
                <thead>
                  <tr>
                    <th
                      style={{ flex: '1' }}
                      onClick={() => sort(data.inventoryItems)}
                    >
                      Name
                    </th>
                    <th>Amount</th>
                    <th>Add date</th>
                    <th>Expiration</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.inventoryItems.map((inventoryItem) => (
                    <InventoryListItem
                      key={inventoryItem.id}
                      inventoryItem={inventoryItem}
                      INVENTORY_ITEMS_QUERY={INVENTORY_ITEMS_QUERY}
                    />
                  ))}
                </tbody>
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

export default withApollo(Inventory)
