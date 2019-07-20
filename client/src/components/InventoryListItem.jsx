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

const ListItem = styled.tr`
  display: flex;
`

const Name = styled.td`
  flex: 1;
`

const Amount = styled.td``

const AddDate = styled.td``

const Expiration = styled.td``

const DeleteButton = styled.button``

const InventoryListItem = ({ inventoryItem, INVENTORY_ITEMS_QUERY }) => {
  return (
    <ListItem>
      <Name>{inventoryItem.item.name}</Name>

      <Amount />

      <AddDate>
        {inventoryItem.add_date
          ? moment(Number(inventoryItem.add_date)).format('M/D/YY')
          : ''}
      </AddDate>

      <Expiration />

      <td>
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
      </td>
    </ListItem>
  )
}

export default InventoryListItem
