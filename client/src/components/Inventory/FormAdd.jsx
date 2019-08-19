import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

import ItemInput from '../ItemInput'

const FormAdd = ({ setIsSorted, INVENTORY_ITEMS_QUERY, client }) => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [newItemAddDate, setNewItemAddDate] = useState(moment().format('M/D/YY'))
  const [newItemShelflife, setNewItemShelflife] = useState('')

  const nameInput = React.createRef()

  const focusNameInput = () => nameInput.current.focus()

  const checkShelflife = () => {
    if (newItemName === '') return
    const { items } = client.readQuery({ query: ITEMS_QUERY })
    const itemObj = items.filter((item) => item.name === newItemName)[0]
    if (itemObj && itemObj.default_shelflife)
      setNewItemShelflife(Number(itemObj.default_shelflife))
  }

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
          setNewItemShelflife={setNewItemShelflife}
          checkShelflife={checkShelflife}
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
            onChange={(event) => setNewItemShelflife(Number(event.target.value))}
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
            defaultShelflife: newItemShelflife,
          }}
          refetchQueries={[{ query: INVENTORY_ITEMS_QUERY }, { query: ITEMS_QUERY }]}
          onCompleted={() => {
            resetInputs()
            setIsSorted(false)
          }}
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

const ADD_INVENTORY_ITEM_MUTATION = gql`
  mutation addInventoryItem(
    $name: String!
    $addDate: String
    $amount: String
    $expiration: String
    $defaultShelflife: Int
  ) {
    addInventoryItem(
      name: $name
      addDate: $addDate
      amount: $amount
      expiration: $expiration
      defaultShelflife: $defaultShelflife
    ) {
      id
      item {
        id
        name
        default_shelflife
      }
      add_date
      amount
      expiration
    }
  }
`

const ITEMS_QUERY = gql`
  query items {
    items {
      id
      name
      default_shelflife
    }
  }
`

FormAdd.propTypes = {
  setIsSorted: PropTypes.func.isRequired,
  INVENTORY_ITEMS_QUERY: PropTypes.shape({}).isRequired,
  client: PropTypes.shape({
    readQuery: PropTypes.func.isRequired,
  }).isRequired,
}

export default FormAdd
