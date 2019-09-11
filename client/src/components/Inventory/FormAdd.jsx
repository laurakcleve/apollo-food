import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import moment from 'moment'
import styled from 'styled-components'

import {
  ITEMS_QUERY,
  INVENTORY_ITEMS_QUERY,
  CATEGORIES_QUERY,
  LOCATIONS_QUERY,
  SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION,
} from '../../queries'

const FormAdd = () => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [addDate, setAddDate] = useState(moment().format('M/D/YY'))
  const [shelflife, setShelflife] = useState('')
  const [countsAs, setCountsAs] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  const { loading, error, data } = useQuery(ITEMS_QUERY)
  const {
    loading: loadingCategories,
    error: errorCategories,
    data: dataCategories,
  } = useQuery(CATEGORIES_QUERY)
  const {
    loading: loadingLocations,
    error: errorLocations,
    data: dataLocations,
  } = useQuery(LOCATIONS_QUERY)

  const [sortAndFilterInventoryItems] = useMutation(
    SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION
  )
  const [addInventoryItem] = useMutation(ADD_INVENTORY_ITEM_MUTATION, {
    refetchQueries: [{ query: INVENTORY_ITEMS_QUERY }, { query: ITEMS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      resetInputs()
      sortAndFilterInventoryItems()
    },
  })

  const nameInput = useRef(null)

  const focusNameInput = () => {
    nameInput.current.focus()
  }

  const checkItemDetails = () => {
    if (name === '') return
    const itemObj = data.items.filter((item) => item.name === name)[0]
    if (itemObj && itemObj.default_shelflife)
      setShelflife(Number(itemObj.default_shelflife))
    if (itemObj && itemObj.category) setCategory(itemObj.category.name)
  }

  const resetInputs = () => {
    setName('')
    setAmount('')
    setShelflife('')
    setCategory('')
    setLocation('')
    focusNameInput()
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        if (name) {
          addInventoryItem({
            variables: {
              name,
              amount,
              addDate: moment(addDate, 'M/D/YY').format('YYYY-MM-DD'),
              expiration: moment(addDate, 'M/D/YY')
                .add(Number(shelflife), 'days')
                .format('YYYY-MM-DD'),
              defaultShelflife: shelflife,
              countsAs,
              category,
              location,
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
          value={name}
          onChange={(event) => {
            setShelflife('')
            setName(event.target.value)
          }}
          onBlur={checkItemDetails}
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
        <div className="label">Category</div>
        <input
          type="text"
          list="categoryList"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value)
          }}
        />
        {!loadingCategories && !errorCategories && (
          <datalist id="categoryList">
            {dataCategories.categories.map((listCategory) => (
              <option key={listCategory.id}>{listCategory.name}</option>
            ))}
          </datalist>
        )}
      </Row>

      <Row>
        <label htmlFor="itemAmount">
          <div className="label">Amount</div>
          <input
            type="text"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
      </Row>

      <Row>
        <label htmlFor="itemAddDate">
          <div className="label">Add date</div>
          <input
            id="itemAddDate"
            type="text"
            value={addDate}
            onChange={(event) => setAddDate(event.target.value)}
          />
        </label>
      </Row>

      <Row>
        <label htmlFor="itemShelflife">
          <div className="label">Shelflife (days)</div>
          <input
            id="itemShelflife"
            type="number"
            value={shelflife}
            onChange={(event) => setShelflife(Number(event.target.value))}
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
            value={countsAs}
            onChange={(event) => setCountsAs(event.target.value)}
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

      <Row>
        <label htmlFor="location">
          <div className="label">Location</div>
          <input
            id="location"
            type="text"
            list="locationList"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
          {!loadingLocations && !errorLocations && (
            <datalist id="locationList">
              {dataLocations.itemLocations.map((itemLocation) => (
                <option key={itemLocation.id}>{itemLocation.name}</option>
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
    $category: String
    $location: String
  ) {
    addInventoryItem(
      name: $name
      addDate: $addDate
      amount: $amount
      expiration: $expiration
      defaultShelflife: $defaultShelflife
      countsAs: $countsAs
      category: $category
      location: $location
    ) {
      id
      item {
        id
        name
        category {
          id
          name
        }
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

export default FormAdd
