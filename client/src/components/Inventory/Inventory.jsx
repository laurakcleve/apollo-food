import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import InventoryListItem from './InventoryListItem'
import FormAdd from './FormAdd'
import Sidebar from './Sidebar'

const Inventory = ({ client }) => {
  const [isSorted, setIsSorted] = useState(false)
  const [currentSortBy, setCurrentSortBy] = useState('expiration')
  const [currentSortOrder, setCurrentSortOrder] = useState('asc')
  const [selectedItemID, setSelectedItemID] = useState(null)
  const [filteredItems, setFilteredItems] = useState(null)

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

  const { loading, error, data } = useQuery(INVENTORY_ITEMS_QUERY, {
    onCompleted: () => {
      if (!isSorted) sort({})
      if (!filteredItems) setFilteredItems(data.inventoryItems)
    },
  })

  const filter = (filterBy) => {
    if (data.inventoryItems) {
      let newFilteredItems
      if (filterBy === 'all') newFilteredItems = data.inventoryItems
      else {
        newFilteredItems = data.inventoryItems.filter(
          (item) => item.location && item.location.name === filterBy
        )
      }
      setFilteredItems(newFilteredItems)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>

  return (
    <StyledInventory>
      <h1>Inventory</h1>
      <div className="container">
        <Sidebar filter={filter} />
        <div className="content">
          <InventoryItemList>
            <div style={{ display: 'flex' }}>
              <div
                role="button"
                tabIndex="-1"
                className="column column--name"
                onClick={() => sort({ newSortBy: 'name', changeSort: true })}
              >
                Name
              </div>
              <div
                role="button"
                tabIndex="-1"
                className="column column--expiration"
                onClick={() => sort({ newSortBy: 'expiration', changeSort: true })}
              >
                Expiration
              </div>
              <div className="column column--delete" />
            </div>
            {filteredItems &&
              filteredItems.map((inventoryItem) => (
                <InventoryListItem
                  key={inventoryItem.id}
                  inventoryItem={inventoryItem}
                  INVENTORY_ITEMS_QUERY={INVENTORY_ITEMS_QUERY}
                  setIsSorted={setIsSorted}
                  selectedItemID={selectedItemID}
                  setSelectedItemID={setSelectedItemID}
                />
              ))}
          </InventoryItemList>
          <FormAdd
            client={client}
            setIsSorted={setIsSorted}
            INVENTORY_ITEMS_QUERY={INVENTORY_ITEMS_QUERY}
          />
        </div>
      </div>
    </StyledInventory>
  )
}

const INVENTORY_ITEMS_QUERY = gql`
  query inventoryItems {
    inventoryItems {
      id
      item {
        id
        name
        countsAs {
          id
          name
        }
        default_shelflife
        dishes {
          id
          name
        }
        category {
          id
          name
        }
      }
      add_date
      expiration
      amount
      location {
        id
        name
      }
    }
  }
`

const StyledInventory = styled.div`
  max-width: ${({ theme }) => theme.containerWidth};
  margin: 0 auto;
  .container {
    display: flex;
  }
`

const InventoryItemList = styled.div`
  width: 450px;

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

Inventory.propTypes = {
  client: PropTypes.shape({
    readQuery: PropTypes.func.isRequired,
    writeQuery: PropTypes.func.isRequired,
  }).isRequired,
}

export default withApollo(Inventory)
