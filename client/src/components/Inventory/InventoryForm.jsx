import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import moment from 'moment'
import styled from 'styled-components'

import ItemInput from '../ItemInput'

const InventoryForm = () => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [newItemAddDate, setNewItemAddDate] = useState(moment().format('M/D/YY'))
  const [newItemShelflife, setNewItemShelflife] = useState('')

  const nameInput = React.createRef()

  const focusNameInput = () => nameInput.current.focus()

  const submitInventoryItem = (addInventoryItem, event) => {
    event.preventDefault()
    if (newItemName) addInventoryItem()
  }

  const resetInputs = () => {
    setNewItemName('')
    setNewItemAmount('')
    setNewItemShelflife('')
    focusNameInput()
  }

  return (
    <Form>
      <h2>Add an item</h2>

      <Row>
        <div className="label">Name</div>
        <ItemInput
          ref={nameInput}
          newItemName={newItemName}
          setNewItemName={setNewItemName}
        />
      </Row>

      <Row>
        <label htmlFor="itemAmount">
          <div className="label">Amount</div>
          <input
            type="text"
            value={newItemAmount}
            onChange={(event) => setNewItemAmount(event.target.value)}
          />
        </label>
      </Row>

      <Row>
        <label htmlFor="itemAddDate">
          <div className="label">Add date</div>
          <input
            id="itemAddDate"
            type="text"
            value={newItemAddDate}
            onChange={(event) => setNewItemAddDate(event.target.value)}
          />
        </label>
      </Row>

      <Row>
        <label htmlFor="itemShelflife">
          <div className="label">Shelflife (days)</div>
          <input
            id="itemShelflife"
            type="number"
            value={newItemShelflife}
            onChange={(event) => setNewItemShelflife(event.target.value)}
          />
        </label>
      </Row>

      <div>
        <Mutation
          mutation={ADD_INVENTORY_ITEM_MUTATION}
          variables={{
            name: newItemName,
            amount: newItemAmount,
            addDate: moment(newItemAddDate, 'M/D/YY').format('YYYY-MM-DD'),
            expiration: moment(newItemAddDate, 'M/D/YY')
              .add(Number(newItemShelflife), 'days')
              .format('YYYY-MM-DD'),
          }}
          update={(cache, { data: { addInventoryItem } }) => {
            const { inventoryItems } = cache.readQuery({
              query: INVENTORY_ITEMS_QUERY,
            })
            cache.writeQuery({
              query: INVENTORY_ITEMS_QUERY,
              data: { inventoryItems: inventoryItems.concat([addInventoryItem]) },
            })
          }}
          onCompleted={() => resetInputs()}
        >
          {(addInventoryItem) => (
            <button
              type="submit"
              onClick={(event) => submitInventoryItem(addInventoryItem, event)}
            >
              Save
            </button>
          )}
        </Mutation>
      </div>
    </Form>
  )
}

const Form = styled.form`
  label {
    display: block;
  }
`

const Row = styled.div`
  display: flex;
  label {
    display: flex;
  }
  .label {
    width: 110px;
  }
`

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

const ADD_INVENTORY_ITEM_MUTATION = gql`
  mutation addInventoryItem(
    $name: String!
    $addDate: String
    $amount: String
    $expiration: String
  ) {
    addInventoryItem(
      name: $name
      addDate: $addDate
      amount: $amount
      expiration: $expiration
    ) {
      id
      item {
        id
        name
      }
      add_date
      amount
      expiration
    }
  }
`

export default InventoryForm
