import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import styled from 'styled-components'

import {
  INVENTORY_ITEMS_QUERY,
  CATEGORIES_QUERY,
  LOCATIONS_QUERY,
  SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION,
} from '../../queries'

import {
  unixTimeToFormatted,
  formattedTimeToPg,
  getExpiration,
  getDaysLeft,
} from '../../utils'

const FormEdit = ({ inventoryItem, setIsEditing }) => {
  const [amount, setAmount] = useState(inventoryItem.amount)
  const [addDate, setAddDate] = useState(
    unixTimeToFormatted(inventoryItem.add_date) || ''
  )
  const [daysLeft, setDaysLeft] = useState(getDaysLeft(inventoryItem.expiration))
  const [category, setCategory] = useState(
    inventoryItem.item.category ? inventoryItem.item.category.name : ''
  )
  const [location, setLocation] = useState(
    inventoryItem.location ? inventoryItem.location.name : ''
  )

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(CATEGORIES_QUERY)
  const {
    loading: loadingLocations,
    error: errorLocations,
    data: dataLocations,
  } = useQuery(LOCATIONS_QUERY)
  const [sortAndFilterInventoryItems] = useMutation(
    SORT_AND_FILTER_INVENTORY_ITEMS_MUTATION
  )
  const [updateInventoryItem] = useMutation(UPDATE_INVENTORY_ITEM_MUTATION, {
    refetchQueries: [{ query: INVENTORY_ITEMS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setIsEditing(false)
      sortAndFilterInventoryItems()
    },
  })

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        updateInventoryItem({
          variables: {
            id: inventoryItem.id,
            addDate: formattedTimeToPg(addDate),
            amount,
            expiration: getExpiration(daysLeft),
            category,
            location,
          },
        })
      }}
    >
      <Row>
        <label htmlFor="amount">
          <div className="label">Amount</div>
          <input
            type="text"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
      </Row>

      <Row>
        <label htmlFor="addDate">
          <div className="label">Add date</div>
          <input
            type="text"
            value={addDate}
            onChange={(event) => setAddDate(event.target.value)}
          />
        </label>
      </Row>

      <Row>
        <label htmlFor="daysLeft">
          <div className="label">Days left</div>
          <input
            type="number"
            value={daysLeft}
            onChange={(event) => setDaysLeft(event.target.value)}
          />
        </label>
      </Row>

      <Row>
        <label htmlFor="category">
          <div className="label">Category</div>
          <input
            id="category"
            type="text"
            list="categoryList"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          {!categoriesLoading && !categoriesError && (
            <datalist id="categoryList">
              {categoriesData.categories.map((listCategory) => (
                <option key={listCategory.id}>{listCategory.name}</option>
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

      <button type="submit">Save</button>
    </Form>
  )
}

const UPDATE_INVENTORY_ITEM_MUTATION = gql`
  mutation updateInventoryItem(
    $id: ID!
    $addDate: String
    $amount: String
    $expiration: String
    $category: String
    $location: String
  ) {
    updateInventoryItem(
      id: $id
      addDate: $addDate
      amount: $amount
      expiration: $expiration
      category: $category
      location: $location
    ) {
      id
      item {
        id
        name
      }
      add_date
      amount
      expiration
      location {
        id
        name
      }
    }
  }
`

const Form = styled.form`
  margin-top: 20px;

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

FormEdit.propTypes = {
  inventoryItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    add_date: PropTypes.string,
    amount: PropTypes.string,
    expiration: PropTypes.string,
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
      countsAs: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
    }),
    location: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  setIsEditing: PropTypes.func.isRequired,
}

export default FormEdit
