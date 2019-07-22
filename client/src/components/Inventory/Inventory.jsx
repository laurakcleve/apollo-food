import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Query, withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'
import styled from 'styled-components'

import InventoryListItem from './InventoryListItem'
import InventoryForm from './InventoryForm'

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
  const [isSorted, setIsSorted] = useState(false)
  const [currentSort, setCurrentSort] = useState('')

  const sort = (items, sortBy) => {
    console.log('sorting')
    const sortedItems = [].concat(items)

    if (sortBy === 'name') {
      if (currentSort === 'name') sortedItems.reverse()
      else {
        sortedItems.sort((a, b) => {
          if (a.item.name < b.item.name) return -1
          if (a.item.name > b.item.name) return 1
          return 0
        })
        setCurrentSort('name')
      }
    } else if (sortBy === 'expiration') {
      if (currentSort === 'expiration') sortedItems.reverse()
      else {
        sortedItems.sort((a, b) => {
          if (Number(a.expiration) < Number(b.expiration)) return -1
          if (Number(a.expiration) > Number(b.expiration)) return 1
          return 0
        })
        setCurrentSort('expiration')
      }
    }
    client.writeQuery({
      query: INVENTORY_ITEMS_QUERY,
      data: {
        inventoryItems: sortedItems,
      },
    })
    setIsSorted(true)
  }

  return (
    <>
      <Query query={INVENTORY_ITEMS_QUERY} fetchPolicy="network-only">
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          if (!isSorted) sort(data.inventoryItems, 'expiration')

          return (
            <>
              <h1>Inventory</h1>
              <Link to="/">Home</Link>
              <InventoryItemList>
                <div style={{ display: 'flex' }}>
                  <div
                    className="column column--name"
                    onClick={() => sort(data.inventoryItems, 'name')}
                  >
                    Name
                  </div>
                  <div className="column column--amount">Amount</div>
                  <div className="column column--add-date">Add Date</div>
                  <div
                    className="column column--expiration"
                    onClick={() => sort(data.inventoryItems, 'expiration')}
                  >
                    Expiration
                  </div>
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
              <InventoryForm />
            </>
          )
        }}
      </Query>
    </>
  )
}

export default withApollo(Inventory)
