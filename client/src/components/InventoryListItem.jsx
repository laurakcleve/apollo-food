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

const ListItem = styled.li`
  display: flex;
`

const ItemName = styled.div`
  flex: 1;
`

const AddDate = styled.div``

const DeleteButton = styled.button``

const InventoryListItem = ({ inventoryItem, INVENTORY_ITEMS_QUERY }) => {
  return (
    <ListItem>
      <ItemName>{inventoryItem.item.name}</ItemName>

      <AddDate>
        {inventoryItem.add_date
          ? moment(Number(inventoryItem.add_date)).format('M/D/YY')
          : ''}
      </AddDate>

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
    </ListItem>
  )
}

export default InventoryListItem
