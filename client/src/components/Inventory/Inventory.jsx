import React from 'react'
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
            <>
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
              <InventoryForm />
            </>
          )
        }}
      </Query>
    </>
  )
}

export default withApollo(Inventory)
