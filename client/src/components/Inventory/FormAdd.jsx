import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

const FormAdd = ({ setIsSorted, INVENTORY_ITEMS_QUERY, client }) => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [newItemAddDate, setNewItemAddDate] = useState(moment().format('M/D/YY'))
  const [newItemShelflife, setNewItemShelflife] = useState('')
  const [newItemCountsAs, setNewItemCountsAs] = useState('')

  const { loading, error, data } = useQuery(ITEMS_QUERY)
  const [addInventoryItem] = useMutation(ADD_INVENTORY_ITEM_MUTATION, {
    onCompleted: () => {
      resetInputs()
      setIsSorted(false)
    },
    refetchQueries: [
      {
        query: INVENTORY_ITEMS_QUERY,
      },
      {
        query: ITEMS_QUERY,
      },
    ],
  })

  const nameInput = useRef(null)

  const focusNameInput = () => {
    nameInput.current.focus()
  }

  const checkShelflife = () => {
    if (newItemName === '') return
    // const { items: readQueryItems } = client.readQuery({ query: ITEMS_QUERY })
    const itemObj = data.items.filter((item) => item.name === newItemName)[0]
    if (itemObj && itemObj.default_shelflife)
      setNewItemShelflife(Number(itemObj.default_shelflife))
  }

  const resetInputs = () => {
    setNewItemName('')
    setNewItemAmount('')
    setNewItemShelflife('')
    focusNameInput()
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        if (newItemName) {
          addInventoryItem({
            variables: {
              name: newItemName,
              amount: newItemAmount,
              addDate: moment(newItemAddDate, 'M/D/YY').format('YYYY-MM-DD'),
              expiration: moment(newItemAddDate, 'M/D/YY')
                .add(Number(newItemShelflife), 'days')
                .format('YYYY-MM-DD'),
              defaultShelflife: newItemShelflife,
              countsAs: newItemCountsAs,
            },
          })
        }
      }}
    >
      <h2>Add an item</h2>

      <Row>
        <div className="label">Name</div>
        <input
          type="text"
          ref={nameInput}
          list="itemList"
          value={newItemName}
          onChange={(event) => {
            setNewItemShelflife('')
            setNewItemName(event.target.value)
          }}
          onBlur={checkShelflife}
        />
        {!loading && !error && (
          <datalist id="itemList">
            {data.items.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </datalist>
        )}
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

      <Row>
        <label htmlFor="itemCountsAs">
          <div className="label">Counts as</div>
          <input
            id="itemCountsAs"
            type="text"
            list="itemCountsAsList"
            value={newItemCountsAs}
            onChange={(event) => setNewItemCountsAs(event.target.value)}
          />
          {!loading && !error && (
            <datalist id="itemCountsAsList">
              {data.items.map((item) => (
                <option key={item.id}>{item.name}</option>
              ))}
            </datalist>
          )}
        </label>
      </Row>

      <div>
        <button type="submit">Save</button>
      </div>
    </Form>
  )
}

const ADD_INVENTORY_ITEM_MUTATION = gql`
  mutation addInventoryItem(
    $name: String!
    $addDate: String
    $amount: String
    $expiration: String
    $defaultShelflife: Int
    $countsAs: String
  ) {
    addInventoryItem(
      name: $name
      addDate: $addDate
      amount: $amount
      expiration: $expiration
      defaultShelflife: $defaultShelflife
      countsAs: $countsAs
    ) {
      id
      item {
        id
        name
        default_shelflife
        countsAs {
          id
          name
        }
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

FormAdd.propTypes = {
  setIsSorted: PropTypes.func.isRequired,
  INVENTORY_ITEMS_QUERY: PropTypes.shape({}).isRequired,
  client: PropTypes.shape({
    readQuery: PropTypes.func.isRequired,
  }).isRequired,
}

export default FormAdd
