import React from 'react'
import styled from 'styled-components'

const ListItem = styled.li`
  display: flex;
`

const ItemName = styled.div`
  flex: 1;
  text-transform: lowercase;
`

const DeleteButton = styled.button``

const InventoryListItem = ({ inventoryItem }) => {
  return (
    <ListItem>
      <ItemName>{inventoryItem.item.name}</ItemName>
      <DeleteButton>Delete</DeleteButton>
    </ListItem>
  )
}

export default InventoryListItem
