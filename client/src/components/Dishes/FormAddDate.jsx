import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import { formattedTimeToPg } from '../../utils'
import {
  DISHES_QUERY,
  SORTED_FILTERED_DISHES_QUERY,
  SORT_AND_FILTER_DISHES_MUTATION,
} from '../../queries'

const FormAddDate = ({ dishID }) => {
  const [date, setDate] = useState('')
  const [sortAndFilterDishes] = useMutation(SORT_AND_FILTER_DISHES_MUTATION)
  const [addDishDate] = useMutation(ADD_DISH_DATE_MUTATION, {
    refetchQueries: [
      { query: DISHES_QUERY },
      { query: SORTED_FILTERED_DISHES_QUERY },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setDate('')
      sortAndFilterDishes()
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        addDishDate({
          variables: {
            dishID,
            date: formattedTimeToPg(date),
          },
        })
      }}
    >
      <label htmlFor="date">
        <span>Add date:</span>
        <input
          type="text"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  )
}

const ADD_DISH_DATE_MUTATION = gql`
  mutation addDishDate($dishID: ID!, $date: String!) {
    addDishDate(dishID: $dishID, date: $date) {
      id
      date
    }
  }
`

FormAddDate.propTypes = {
  dishID: PropTypes.string.isRequired,
}

export default FormAddDate
