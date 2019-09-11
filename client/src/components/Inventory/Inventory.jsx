import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { withApollo } from 'react-apollo'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  INVENTORY_ITEMS_QUERY,
  SORTED_FILTERED_INVENTORY_ITEMS_QUERY,
  SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION,
} from '../../queries'

import InventoryListItem from './InventoryListItem'
import FormAdd from './FormAdd'
import Sidebar from './Sidebar'

const Inventory = () => {
  const [selectedItemID, setSelectedItemID] = useState(null)

  const { data: sortedFilteredData } = useQuery(
    SORTED_FILTERED_INVENTORY_ITEMS_QUERY
  )
  const { loading: inventoryItemsLoading } = useQuery(INVENTORY_ITEMS_QUERY, {
    onCompleted: () => {
      if (
        sortedFilteredData &&
        !sortedFilteredData.sortedFilteredInventoryItems.length
      ) {
        sortAndFilterInventoryItems()
      }
    },
  })

  const [sortAndFilterInventoryItems] = useMutation(
    SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION
  )

  if (inventoryItemsLoading) return <p>Loading...</p>

  return (
    <StyledInventory>
      <h1>Inventory</h1>
      <div className="container">
        <Sidebar />
        <div className="content">
          <InventoryItemList>
            <div style={{ display: 'flex' }}>
              <div
                role="button"
                tabIndex="-1"
                className="column column--name"
                onClick={() =>
                  sortAndFilterInventoryItems({
                    variables: { sortBy: 'name', manual: true },
                  })
                }
              >
                Name
              </div>
              <div
                role="button"
                tabIndex="-1"
                className="column column--expiration"
                onClick={() =>
                  sortAndFilterInventoryItems({
                    variables: { sortBy: 'expiration', manual: true },
                  })
                }
              >
                Expiration
              </div>
              <div className="column column--delete" />
            </div>
            {sortedFilteredData.sortedFilteredInventoryItems &&
              sortedFilteredData.sortedFilteredInventoryItems.map(
                (inventoryItem) => (
                  <InventoryListItem
                    key={inventoryItem.id}
                    inventoryItem={inventoryItem}
                    selectedItemID={selectedItemID}
                    setSelectedItemID={setSelectedItemID}
                  />
                )
              )}
          </InventoryItemList>
          <FormAdd />
        </div>
      </div>
    </StyledInventory>
  )
}

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
