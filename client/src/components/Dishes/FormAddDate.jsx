import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { formattedTimeToPg } from '../../utils'

const FormAddDate = ({ dishID, DISHES_QUERY }) => {
  const [date, setDate] = useState('')
  const [addDishDate] = useMutation(ADD_DISH_DATE_MUTATION, {
    refetchQueries: [
      {
        query: DISHES_QUERY,
      },
    ],
    onCompleted: () => {
      setDate('')
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
  DISHES_QUERY: PropTypes.shape({}).isRequired,
}

export default FormAddDate
