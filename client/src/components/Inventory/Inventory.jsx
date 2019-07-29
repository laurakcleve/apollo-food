import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Query, withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'
import styled from 'styled-components'

import InventoryListItem from './InventoryListItem'
import InventoryForm from './InventoryForm'

const Inventory = ({ client }) => {
  const [isSorted, setIsSorted] = useState(false)
  const [currentSortBy, setCurrentSortBy] = useState('expiration')
  const [currentSortOrder, setCurrentSortOrder] = useState('asc')

  const innerSort = ({ items, sortBy, order }) => {
    const sortedItems = [].concat(items)
    if (sortBy === 'name') {
      if (order === 'asc') {
        sortedItems.sort((a, b) => {
          if (a.item.name < b.item.name) return -1
          if (a.item.name > b.item.name) return 1
          return 0
        })
      }
      if (order === 'desc') {
        sortedItems.sort((a, b) => {
          if (a.item.name > b.item.name) return -1
          if (a.item.name < b.item.name) return 1
          return 0
        })
      }
    } else if (sortBy === 'expiration') {
      if (order === 'asc') {
        sortedItems.sort((a, b) => {
          if (Number(a.expiration) < Number(b.expiration)) return -1
          if (Number(a.expiration) > Number(b.expiration)) return 1
          return 0
        })
      }
      if (order === 'desc') {
        sortedItems.sort((a, b) => {
          if (Number(a.expiration) > Number(b.expiration)) return -1
          if (Number(a.expiration) < Number(b.expiration)) return 1
          return 0
        })
      }
    }
    return sortedItems
  }

  const sort = ({
    prevSortBy = currentSortBy,
    prevOrder = currentSortOrder,
    newSortBy = currentSortBy,
    changeSort = false,
  }) => {
    setCurrentSortBy(newSortBy)
    const { inventoryItems } = client.readQuery({
      query: INVENTORY_ITEMS_QUERY,
    })

    let sortedItems = [].concat(inventoryItems)
    let newOrder = prevOrder

    if (!changeSort) {
      sortedItems = innerSort({
        items: sortedItems,
        sortBy: prevSortBy,
        order: prevOrder,
      })
    } else if (prevSortBy === newSortBy) {
      newOrder = prevOrder === 'asc' ? 'desc' : 'asc'
      sortedItems = innerSort({
        items: sortedItems,
        sortBy: prevSortBy,
        order: newOrder,
      })
    } else {
      newOrder = 'asc'
      sortedItems = innerSort({
        items: sortedItems,
        sortBy: newSortBy,
        order: 'asc',
      })
    }

    setCurrentSortOrder(newOrder)
    setIsSorted(true)

    client.writeQuery({
      query: INVENTORY_ITEMS_QUERY,
      data: {
        inventoryItems: sortedItems,
      },
    })
  }

  return (
    <>
      <Query
        query={INVENTORY_ITEMS_QUERY}
        onCompleted={() => {
          if (!isSorted) sort({})
        }}
      >
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error</p>

          return (
            <StyledInventory>
              <h1>Inventory</h1>
              <InventoryItemList>
                <div style={{ display: 'flex' }}>
                  <div
                    className="column column--name"
                    onClick={() => sort({ newSortBy: 'name', changeSort: true })}
                  >
                    Name
                  </div>
                  <div className="column column--amount">Amount</div>
                  <div className="column column--add-date">Add Date</div>
                  <div
                    className="column column--expiration"
                    onClick={() =>
                      sort({ newSortBy: 'expiration', changeSort: true })
                    }
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
                    setCurrentSort={setCurrentSortBy}
                    setIsSorted={setIsSorted}
                  />
                ))}
              </InventoryItemList>
              <InventoryForm client={client} setIsSorted={setIsSorted} />
            </StyledInventory>
          )
        }}
      </Query>
    </>
  )
}

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

const StyledInventory = styled.div`
  max-width: ${({ theme }) => theme.containerWidth};
  margin: 0 auto;
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

export default withApollo(Inventory)
