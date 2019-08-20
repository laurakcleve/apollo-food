import React from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const Item = ({ match, history }) => {
  const itemID = match.params.id

  const { loading, error, data } = useQuery(ITEM_QUERY, {
    variables: { id: itemID },
  })
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    onCompleted: () => history.push('/items'),
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>

  return (
    <>
      <div>
        <h1>{data.item.name}</h1>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (window.confirm('Are you sure you want to delete this item?'))
            deleteItem({ variables: { itemID: data.item.id } })
        }}
      >
        <button type="submit">Delete</button>
      </form>
    </>
  )
}

const ITEM_QUERY = gql`
  query item($id: ID!) {
    item(id: $id) {
      id
      name
    }
  }
`

const DELETE_ITEM_MUTATION = gql`
  mutation deleteItem($itemID: ID!) {
    deleteItem(id: $itemID)
  }
`

Item.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default Item
