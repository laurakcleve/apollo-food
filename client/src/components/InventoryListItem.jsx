import React from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import moment from 'moment'

const DELETE_INVENTORY_ITEM_MUTATION = gql`
  mutation deleteInventoryItem($itemID: ID!) {
    deleteInventoryItem(id: $itemID)
  }
`

const ListItem = styled.div`
  display: flex;
`

const DeleteButton = styled.button``

const InventoryListItem = ({ inventoryItem, INVENTORY_ITEMS_QUERY }) => {
  return (
    <ListItem>
      <div className="column column--name">{inventoryItem.item.name}</div>

      <div className="column column--amount">
        {inventoryItem.amount ? inventoryItem.amount : ''}
      </div>

      <div className="column column--add-date">
        {inventoryItem.add_date
          ? moment(Number(inventoryItem.add_date)).format('M/D/YY')
          : ''}
      </div>

      <div className="column column--expiration">
        {inventoryItem.expiration
          ? moment(Number(inventoryItem.expiration)).format('M/D/YY')
          : ''}
      </div>

      <div className="column column--delete">
        <Mutation
          mutation={DELETE_INVENTORY_ITEM_MUTATION}
          variables={{ itemID: inventoryItem.id }}
          refetchQueries={[{ query: INVENTORY_ITEMS_QUERY }]}
        >
          {(deleteInventoryItem) => (
            <DeleteButton type="button" onClick={deleteInventoryItem}>
              Delete
            </DeleteButton>
          )}
        </Mutation>
      </div>
    </ListItem>
  )
}

export default InventoryListItem
