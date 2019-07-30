import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import moment from 'moment'

import Details from './Details'

const DELETE_INVENTORY_ITEM_MUTATION = gql`
  mutation deleteInventoryItem($itemID: ID!) {
    deleteInventoryItem(id: $itemID)
  }
`

const ListItem = styled.div``

const TitleBar = styled.div`
  display: flex;
`

const DeleteButton = styled.button``

const InventoryListItem = ({
  inventoryItem,
  INVENTORY_ITEMS_QUERY,
  setIsSorted,
  selectedItemID,
  setSelectedItemID,
}) => {
  const toggleOpen = () => {
    if (selectedItemID === inventoryItem.id) {
      setSelectedItemID(null)
    } else {
      setSelectedItemID(inventoryItem.id)
    }
  }

  return (
    <ListItem>
      <TitleBar>
        <div
          role="button"
          tabIndex="-1"
          className="column column--name"
          onClick={toggleOpen}
        >
          {inventoryItem.item.name}
        </div>

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
            onCompleted={() => {
              setIsSorted(false)
            }}
          >
            {(deleteInventoryItem) => (
              <DeleteButton type="button" onClick={deleteInventoryItem}>
                Delete
              </DeleteButton>
            )}
          </Mutation>
        </div>
      </TitleBar>
      {selectedItemID === inventoryItem.id && (
        <Details inventoryItem={inventoryItem} />
      )}
    </ListItem>
  )
}

InventoryListItem.propTypes = {
  inventoryItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    add_date: PropTypes.string,
    amount: PropTypes.string,
    expiration: PropTypes.string,
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      countsAs: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
    }),
  }).isRequired,
  INVENTORY_ITEMS_QUERY: PropTypes.shape({}).isRequired,
  setIsSorted: PropTypes.func.isRequired,
  selectedItemID: PropTypes.string,
  setSelectedItemID: PropTypes.func.isRequired,
}

InventoryListItem.defaultProps = {
  selectedItemID: null,
}

export default InventoryListItem
